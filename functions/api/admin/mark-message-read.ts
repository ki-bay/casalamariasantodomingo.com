// Admin-only: mark a contact_messages row as read (or unread).
//   POST /api/admin/mark-message-read
//   body: { id: number, read?: boolean }   // defaults to read=true

import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "../../_lib/admin-auth";

interface Env {
  ADMIN_COOKIE_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const noStore = { "Cache-Control": "no-store", "Content-Type": "application/json" };

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: noStore });
  }
  let body: { id?: number; read?: boolean };
  try { body = await context.request.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: noStore });
  }
  const id = Number(body.id);
  if (!Number.isFinite(id) || id <= 0) {
    return new Response(JSON.stringify({ error: "Invalid id" }), { status: 400, headers: noStore });
  }
  const read = body.read !== false;

  const sb = createClient(
    context.env.NEXT_PUBLIC_SUPABASE_URL,
    context.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { error } = await sb
    .from("contact_messages")
    .update({ read, read_at: read ? new Date().toISOString() : null })
    .eq("id", id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: noStore });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: noStore });
};
