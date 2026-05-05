// Stripe webhook receiver. Stripe sends payment_intent.succeeded here after
// the guest's card is charged; we then push the booking to Lodgify and log
// it in Supabase.
//
// Configure in Stripe dashboard → Developers → Webhooks → Add endpoint:
//   URL:    https://casalamariazonacolonial.com/api/stripe-webhook
//   Events: payment_intent.succeeded, payment_intent.payment_failed
// Then copy the signing secret into Cloudflare Pages env var
// STRIPE_WEBHOOK_SECRET (whsec_…).

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { lodgifyCreateBooking, splitFullName } from "../_lib/lodgify";

interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  LODGIFY_API_KEY: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const sig = context.request.headers.get("stripe-signature") ?? "";
  if (!sig) return text("Missing signature", 400);

  const env = context.env;
  if (!env.STRIPE_SECRET_KEY || !env.STRIPE_WEBHOOK_SECRET) {
    return text("Stripe not configured", 500);
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });

  // Stripe needs the raw bytes for signature verification. constructEventAsync
  // handles WebCrypto under the hood (Workers runtime).
  const payload = await context.request.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      payload,
      sig,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return text(
      `Signature verification failed: ${err instanceof Error ? err.message : "unknown"}`,
      400,
    );
  }

  // We only act on payment_intent.succeeded. payment_intent.payment_failed
  // is acknowledged so Stripe stops retrying, but no booking is created.
  if (event.type === "payment_intent.payment_failed") {
    return text("ack failed", 200);
  }
  if (event.type !== "payment_intent.succeeded") {
    return text("ignored", 200);
  }

  const pi = event.data.object as Stripe.PaymentIntent;
  const md = pi.metadata ?? {};

  const sb = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Idempotency: if we've already processed this PaymentIntent, no-op.
  const { data: existing } = await sb
    .from("bookings")
    .select("id, lodgify_booking_id, status")
    .eq("stripe_payment_intent_id", pi.id)
    .maybeSingle();

  if (existing && existing.status === "confirmed") {
    return text("already processed", 200);
  }

  // Map Stripe metadata → Lodgify booking input
  const propertyId = Number(md.propertyId);
  const roomTypeId = Number(md.roomTypeId);
  const arrival = md.checkIn ?? "";
  const departure = md.checkOut ?? "";
  const fullName = md.guestName ?? "";
  const email = md.guestEmail ?? "";
  const phone = md.guestPhone ?? "";
  const notes = md.notes ?? "";
  const peopleStr = md.guests ?? "2";
  const people = Math.max(1, Number(peopleStr.replace(/[^0-9]/g, "")) || 2);
  const totalUsd = (pi.amount_received ?? pi.amount) / 100;

  const guestName = splitFullName(fullName);

  // Insert pending row first so we have a paper trail even if Lodgify fails.
  const { data: row } = await sb
    .from("bookings")
    .upsert(
      {
        stripe_payment_intent_id: pi.id,
        lodgify_property_id: propertyId,
        lodgify_room_type_id: roomTypeId,
        arrival,
        departure,
        guest_first_name: guestName.first_name,
        guest_last_name: guestName.last_name,
        guest_email: email,
        guest_phone: phone,
        people,
        total_amount: totalUsd,
        currency: "USD",
        notes,
        source: "website",
        status: "pending",
        raw_stripe_event: event as unknown as Record<string, unknown>,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "stripe_payment_intent_id" },
    )
    .select("id")
    .single();

  // Push to Lodgify. We mark Status=Booked and total_paid=total_amount because
  // Stripe already captured the payment.
  const result = await lodgifyCreateBooking(env.LODGIFY_API_KEY, {
    property_id: propertyId,
    arrival,
    departure,
    source: "Manual",
    status: "Booked",
    guest: { guest_name: guestName, email, phone },
    rooms: [{ room_type_id: roomTypeId, people }],
    total_amount: totalUsd,
    total_paid: totalUsd,
    currency_code: "USD",
    notes: notes
      ? `${notes}\n\n— Stripe PI: ${pi.id}`
      : `Stripe PI: ${pi.id}`,
  });

  if (!result.ok) {
    await sb
      .from("bookings")
      .update({
        status: "lodgify_failed",
        lodgify_error: `HTTP ${result.rawStatus}: ${result.rawBody.slice(0, 800)}`,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row?.id ?? -1);
    // Return 500 so Stripe retries the webhook; transient Lodgify outages
    // will recover automatically via Stripe's exponential backoff.
    return text(`Lodgify create failed: ${result.rawStatus}`, 500);
  }

  await sb
    .from("bookings")
    .update({
      status: "confirmed",
      lodgify_booking_id: result.bookingId,
      raw_lodgify_response: { status: result.rawStatus, body: result.rawBody },
      updated_at: new Date().toISOString(),
    })
    .eq("id", row?.id ?? -1);

  return text("ok", 200);
};

// Stripe will retry on any non-2xx, so be deliberate about status codes.
function text(body: string, status: number): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain" },
  });
}
