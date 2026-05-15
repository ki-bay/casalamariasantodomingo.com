// Admin-only: cancel a booking end-to-end.
//   POST /api/admin/cancel-booking
//   body: { id: number, note?: string, refund?: boolean }   // id = bookings.id (Supabase pk)
//
// Steps (best-effort, partial failures are recorded on the row):
//   1. Verify admin cookie
//   2. Load booking row from Supabase
//   3. If a Stripe PaymentIntent is present and refund !== false → full refund
//   4. If a Lodgify booking id is present → DELETE /v1/reservation/booking/{id}
//   5. Update Supabase row: status='cancelled', cancelled_at, stripe_refund_id,
//      lodgify_cancel_status, cancel_note
// Returns: { ok, refund?, lodgify_cancel_status?, errors[] }

import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "../../_lib/admin-auth";

interface Env {
  ADMIN_COOKIE_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  STRIPE_SECRET_KEY: string;
  LODGIFY_API_KEY: string;
}

const noStore = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: noStore });
  }

  let body: { id?: number; note?: string; refund?: boolean };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: noStore });
  }
  const bookingId = Number(body.id);
  const note = (body.note ?? "").slice(0, 500);
  const wantRefund = body.refund !== false; // default true
  if (!Number.isFinite(bookingId) || bookingId <= 0) {
    return new Response(JSON.stringify({ error: "Invalid booking id" }), { status: 400, headers: noStore });
  }

  if (!context.env.NEXT_PUBLIC_SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), { status: 500, headers: noStore });
  }

  const sb = createClient(
    context.env.NEXT_PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Load booking
  const { data: row, error: loadErr } = await sb
    .from("bookings")
    .select("id, status, stripe_payment_intent_id, stripe_refund_id, lodgify_booking_id, total_amount")
    .eq("id", bookingId)
    .maybeSingle();
  if (loadErr || !row) {
    return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404, headers: noStore });
  }
  if (row.status === "cancelled") {
    return new Response(JSON.stringify({ ok: true, alreadyCancelled: true }), { status: 200, headers: noStore });
  }

  const errors: string[] = [];
  let refundId: string | null = row.stripe_refund_id ?? null;
  let lodgifyCancelStatus: number | null = null;

  // 1. Stripe refund (only if not already refunded)
  if (wantRefund && row.stripe_payment_intent_id && !refundId && context.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(context.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-03-31.basil",
      });
      const refund = await stripe.refunds.create({
        payment_intent: row.stripe_payment_intent_id,
        // amount omitted → full refund
        reason: "requested_by_customer",
      });
      refundId = refund.id;
    } catch (err) {
      errors.push(`stripe_refund: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 2. Lodgify DELETE — soft-delete, sets is_deleted=true
  if (row.lodgify_booking_id && context.env.LODGIFY_API_KEY) {
    try {
      const r = await fetch(
        `https://api.lodgify.com/v1/reservation/booking/${row.lodgify_booking_id}`,
        { method: "DELETE", headers: { "X-ApiKey": context.env.LODGIFY_API_KEY } },
      );
      lodgifyCancelStatus = r.status;
      if (!r.ok && r.status !== 200 && r.status !== 204) {
        errors.push(`lodgify_delete: HTTP ${r.status}`);
      }
    } catch (err) {
      errors.push(`lodgify_delete: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // 3. Mark booking cancelled in Supabase
  const { error: updErr } = await sb
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      stripe_refund_id: refundId,
      lodgify_cancel_status: lodgifyCancelStatus,
      cancel_note: note || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);
  if (updErr) errors.push(`db_update: ${updErr.message}`);

  return new Response(
    JSON.stringify({
      ok: errors.length === 0,
      refund_id: refundId,
      lodgify_cancel_status: lodgifyCancelStatus,
      errors,
    }),
    { status: errors.length === 0 ? 200 : 207, headers: noStore },
  );
};
