import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
}

interface PaymentIntentRequest {
  amount: number; // in cents
  nights: number;
  checkIn: string;
  checkOut: string;
  guests: string;
  guestName: string;
  guestEmail: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  // Handle preflight
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (!context.env.STRIPE_SECRET_KEY) {
    return new Response(
      JSON.stringify({ error: "Stripe not configured" }),
      { status: 500, headers: corsHeaders }
    );
  }

  let body: PaymentIntentRequest;
  try {
    body = await context.request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const { amount, nights, checkIn, checkOut, guests, guestName, guestEmail } = body;

  if (!amount || amount < 100 || !checkIn || !checkOut) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // already in cents
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: {
        checkIn,
        checkOut,
        guests: guests ?? "",
        nights: String(nights),
        guestName: guestName ?? "",
        guestEmail: guestEmail ?? "",
        property: "Casa La Maria",
      },
      ...(guestEmail ? { receipt_email: guestEmail } : {}),
      description: `Casa La Maria — ${nights} night${nights > 1 ? "s" : ""}: ${checkIn} → ${checkOut}`,
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stripe error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: corsHeaders }
    );
  }
};
