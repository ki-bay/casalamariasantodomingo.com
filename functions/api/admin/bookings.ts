// Admin-protected endpoint that returns recent bookings + Lodgify webhook
// events from Supabase. Cookie auth uses the same HMAC scheme as the
// middleware (clm_admin cookie → ADMIN_COOKIE_SECRET).
//
// GET /api/admin/bookings → { bookings: [...], events: [...] }
//
// The admin page calls this from the browser; the function is what actually
// holds the Supabase service-role key (never exposed to the client).

import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "../../_lib/admin-auth";

interface Env {
  ADMIN_COOKIE_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const noStore = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: noStore });
  }

  if (!context.env.NEXT_PUBLIC_SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500, headers: noStore });
  }

  const sb = createClient(
    context.env.NEXT_PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const [bookingsResult, eventsResult, messagesResult] = await Promise.all([
    sb.from("bookings")
      .select(
        "id, created_at, stripe_payment_intent_id, lodgify_booking_id, lodgify_property_id, arrival, departure, guest_first_name, guest_last_name, guest_email, guest_phone, people, total_amount, currency, source, status, lodgify_error, cancelled_at, stripe_refund_id",
      )
      .order("created_at", { ascending: false })
      .limit(100),
    sb.from("lodgify_webhook_events")
      .select("id, received_at, event_type, lodgify_booking_id, lodgify_property_id")
      .order("received_at", { ascending: false })
      .limit(20),
    sb.from("contact_messages")
      .select("id, created_at, name, email, subject, message, locale, read, email_sent, email_error")
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  return new Response(
    JSON.stringify({
      bookings: bookingsResult.data ?? [],
      events: eventsResult.data ?? [],
      messages: messagesResult.data ?? [],
    }),
    { status: 200, headers: noStore },
  );
};
