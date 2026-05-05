// Lodgify webhook receiver. Lodgify pushes events here when a booking is
// created/updated/canceled — including bookings from Booking.com, Airbnb,
// or Lodgify direct (i.e. things our Stripe flow didn't create).
//
// Configure in Lodgify dashboard → Settings → Webhooks (or via Lodgify
// support). Point the URL at:
//   https://casalamariazonacolonial.com/api/lodgify-webhook?token=<LODGIFY_WEBHOOK_TOKEN>
//
// Auth: Lodgify webhooks don't sign payloads, so we use a shared-secret
// token in the query string. Set LODGIFY_WEBHOOK_TOKEN in Cloudflare Pages
// env vars (a random 32-byte hex string).

import { createClient } from "@supabase/supabase-js";

interface Env {
  LODGIFY_WEBHOOK_TOKEN: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface LodgifyWebhookPayload {
  event?: string;
  action?: string;
  booking_id?: number;
  reservation_id?: number;
  property_id?: number;
  // Lodgify's webhook payload schema isn't fully documented, so we accept
  // any shape and store the raw payload for debugging. The DB columns above
  // are best-effort extractions.
  [key: string]: unknown;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204 });
  }
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const url = new URL(context.request.url);
  const token = url.searchParams.get("token") ?? "";
  const expected = context.env.LODGIFY_WEBHOOK_TOKEN ?? "";
  if (!expected || token !== expected) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: LodgifyWebhookPayload;
  try {
    payload = await context.request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const sb = createClient(
    context.env.NEXT_PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const eventType = payload.event ?? payload.action ?? null;
  const bookingId =
    typeof payload.booking_id === "number"
      ? payload.booking_id
      : typeof payload.reservation_id === "number"
        ? payload.reservation_id
        : null;
  const propertyId =
    typeof payload.property_id === "number" ? payload.property_id : null;

  await sb.from("lodgify_webhook_events").insert({
    event_type: eventType,
    lodgify_booking_id: bookingId,
    lodgify_property_id: propertyId,
    payload: payload as unknown as Record<string, unknown>,
  });

  // We just store + ack for now. A future scheduled function (or trigger)
  // can reconcile lodgify_webhook_events into the bookings table — that lets
  // us evolve the mapping without losing data.
  return new Response("ok", { status: 200 });
};
