import Stripe from "stripe";

interface Env {
  STRIPE_SECRET_KEY: string;
}

interface PaymentIntentRequest {
  amount: number; // total in cents
  nights: number;
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  guests: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  notes?: string;
  // Lodgify routing — the website hits these per apartment unit.
  // For the legacy single-listing /reserva flow, defaults below kick in.
  propertyId?: number;   // Lodgify property_id
  roomTypeId?: number;   // Lodgify room_type_id
}

// Default to the original "Casa La Maria" listing if the caller didn't
// specify a unit. These are the IDs returned by /v2/properties.
const DEFAULT_PROPERTY_ID = 674785;
const DEFAULT_ROOM_TYPE_ID = 741756;

const ALLOWED_PROPERTY_IDS = new Set([674785, 674786, 674787, 674788, 674789]);

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

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

  const {
    amount, nights, checkIn, checkOut, guests, guestName, guestEmail,
    guestPhone, notes, propertyId, roomTypeId,
  } = body;

  if (!amount || amount < 100 || !checkIn || !checkOut) {
    return new Response(
      JSON.stringify({ error: "Missing required fields" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const finalPropertyId = propertyId ?? DEFAULT_PROPERTY_ID;
  const finalRoomTypeId = roomTypeId ?? DEFAULT_ROOM_TYPE_ID;
  if (!ALLOWED_PROPERTY_IDS.has(finalPropertyId)) {
    return new Response(
      JSON.stringify({ error: "Invalid propertyId" }),
      { status: 400, headers: corsHeaders }
    );
  }

  const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-03-31.basil",
  });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      // Stripe metadata is capped at 500 chars per value, 50 keys total.
      // The webhook reads these to push the booking into Lodgify.
      metadata: {
        property: "Casa La Maria",
        propertyId: String(finalPropertyId),
        roomTypeId: String(finalRoomTypeId),
        checkIn,
        checkOut,
        nights: String(nights),
        guests: guests ?? "",
        guestName: guestName ?? "",
        guestEmail: guestEmail ?? "",
        guestPhone: guestPhone ?? "",
        notes: (notes ?? "").slice(0, 480),
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
