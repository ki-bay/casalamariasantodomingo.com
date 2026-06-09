// Admin endpoints for the social-share queue.
//
// GET   /api/admin/social-shares?blog_post_id={id}  → list rows for one post
// PATCH /api/admin/social-shares?id={id}            → { action: "retry" | "cancel" }
//
// Retry just resets status to 'pending' so the next cron tick picks it up.
// Cancel marks it 'cancelled' so it stays out of the queue.

import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "../../_lib/admin-auth";

interface Env {
  ADMIN_COOKIE_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), {
    status: s,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });

function sb(env: Env) {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return json({ error: "Unauthorized" }, 401);
  }
  const url = new URL(context.request.url);
  const blogPostId = url.searchParams.get("blog_post_id");
  let query = sb(context.env)
    .from("blog_social_shares")
    .select("*")
    .order("attempted_at", { ascending: false })
    .limit(200);
  if (blogPostId) query = query.eq("blog_post_id", blogPostId);
  const { data, error } = await query;
  if (error) return json({ error: error.message }, 500);
  return json({ shares: data ?? [] });
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return json({ error: "Unauthorized" }, 401);
  }
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return json({ error: "id required" }, 400);
  let body: { action?: string };
  try {
    body = (await context.request.json()) as { action?: string };
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (body.action !== "retry" && body.action !== "cancel") {
    return json({ error: "action must be 'retry' or 'cancel'" }, 400);
  }
  const update =
    body.action === "retry"
      ? { status: "pending", error: null, attempted_at: new Date().toISOString() }
      : { status: "cancelled", attempted_at: new Date().toISOString() };
  const { data, error } = await sb(context.env)
    .from("blog_social_shares")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return json({ error: error.message }, 400);
  return json({ share: data });
};
