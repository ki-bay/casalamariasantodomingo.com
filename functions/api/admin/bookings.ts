// Admin-protected endpoint that returns recent bookings + Lodgify webhook
// events from Supabase. Cookie auth uses the same HMAC scheme as the
// middleware (clm_admin cookie → ADMIN_COOKIE_SECRET).
//
// GET /api/admin/bookings → { bookings: [...], events: [...] }
//
// The admin page calls this from the browser; the function is what actually
// holds the Supabase service-role key (never exposed to the client).

import { createClient } from "@supabase/supabase-js";

interface Env {
  ADMIN_COOKIE_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const ADMIN_COOKIE = "clm_admin";

const noStore = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  // 1. Verify admin cookie (same HMAC scheme as middleware.ts)
  const cookieValue = readCookie(context.request, ADMIN_COOKIE);
  const secret = context.env.ADMIN_COOKIE_SECRET ?? "";
  if (!secret || !cookieValue || !(await verifyAdminCookie(cookieValue, secret))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: noStore,
    });
  }

  // 2. Read recent bookings + webhook events from Supabase
  if (!context.env.NEXT_PUBLIC_SUPABASE_URL || !context.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Supabase not configured" }), {
      status: 500,
      headers: noStore,
    });
  }

  const sb = createClient(
    context.env.NEXT_PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  const [bookingsResult, eventsResult] = await Promise.all([
    sb.from("bookings")
      .select(
        "id, created_at, stripe_payment_intent_id, lodgify_booking_id, lodgify_property_id, arrival, departure, guest_first_name, guest_last_name, guest_email, guest_phone, people, total_amount, currency, source, status, lodgify_error",
      )
      .order("created_at", { ascending: false })
      .limit(50),
    sb.from("lodgify_webhook_events")
      .select("id, received_at, event_type, lodgify_booking_id, lodgify_property_id")
      .order("received_at", { ascending: false })
      .limit(20),
  ]);

  return new Response(
    JSON.stringify({
      bookings: bookingsResult.data ?? [],
      events: eventsResult.data ?? [],
    }),
    { status: 200, headers: noStore },
  );
};

// ─── HMAC cookie verification (mirror of middleware.ts) ──────────────

function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function verifyAdminCookie(cookieValue: string, secret: string): Promise<boolean> {
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, sigB64] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sig = b64urlDecode(sigB64);
    const valid = await crypto.subtle.verify("HMAC", key, sig, enc.encode(payloadB64));
    if (!valid) return false;
    const json = new TextDecoder().decode(b64urlDecode(payloadB64));
    const { exp } = JSON.parse(json) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}
