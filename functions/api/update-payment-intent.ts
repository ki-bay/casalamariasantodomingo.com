// Refresh PaymentIntent metadata after the user fills in the booking form.
// The dialog creates a PaymentIntent on open (empty form) so Stripe Elements
// can render; this endpoint is called just before confirmPayment to attach
// the filled-in guest details. The stripe-webhook reads metadata to push
// the booking into Lodgify, so it has to be fresh.

import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
}

interface UpdateRequest {
  paymentIntentId: string;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  notes?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const cors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (!context.env.STRIPE_SECRET_KEY) {
    return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 500, headers: cors });
  }

  let body: UpdateRequest;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), { status: 400, headers: cors });
  }

  if (!body.paymentIntentId?.startsWith("pi_")) {
    return new Response(JSON.stringify({ error: "Invalid paymentIntentId" }), { status: 400, headers: cors });
  }

  const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });

  try {
    // Stripe.update merges metadata — we only send the fields the user
    // actually filled in, leaving the propertyId/roomTypeId/checkIn etc.
    // captured at creation time intact.
    await stripe.paymentIntents.update(body.paymentIntentId, {
      metadata: {
        guestName: body.guestName ?? "",
        guestEmail: body.guestEmail ?? "",
        guestPhone: body.guestPhone ?? "",
        notes: (body.notes ?? "").slice(0, 480),
      },
      ...(body.guestEmail ? { receipt_email: body.guestEmail } : {}),
    });
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: cors });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: cors });
  }
};
