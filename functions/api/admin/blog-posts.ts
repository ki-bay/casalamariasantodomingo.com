// Admin-protected CRUD for the blog_posts table.
//
// GET    /api/admin/blog-posts            → list all rows (published or not)
// POST   /api/admin/blog-posts            → create a new row (body = post fields)
// PATCH  /api/admin/blog-posts?id=<uuid>  → update a row
// DELETE /api/admin/blog-posts?id=<uuid>  → delete a row
//
// New / updated published posts only appear on prod after the next Cloudflare
// Pages build (static export). The admin UI surfaces this caveat.

import { createClient } from "@supabase/supabase-js";
import { isAdminRequest } from "../../_lib/admin-auth";

interface Env {
  ADMIN_COOKIE_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });

function client(env: Env) {
  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Whitelist of fields the admin UI may write — prevents source/source_ref/
// llm_model from being clobbered by a careless PATCH.
const WRITABLE = [
  "slug",
  "title",
  "excerpt",
  "content",
  "cover_image",
  "og_image",
  "category",
  "read_time",
  "author",
  "published",
  "published_at",
  "title_i18n",
  "excerpt_i18n",
  "content_i18n",
  "meta_keywords_i18n",
  "meta_desc_i18n",
  "schema_blocks",
] as const;

function pickWritable(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of WRITABLE) {
    if (k in body) out[k] = body[k];
  }
  return out;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return json({ error: "Unauthorized" }, 401);
  }
  const sb = client(context.env);
  const { data, error } = await sb
    .from("blog_posts")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return json({ error: error.message }, 500);
  return json({ posts: data ?? [] });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return json({ error: "Unauthorized" }, 401);
  }
  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const fields = pickWritable(body);
  if (!fields.slug || !fields.title) {
    return json({ error: "slug and title are required" }, 400);
  }
  // Always mark admin-authored posts so we can tell them apart from Drive.
  const row = {
    ...fields,
    source: "admin",
    published_at:
      fields.published === true && !fields.published_at
        ? new Date().toISOString()
        : fields.published_at ?? null,
  };
  const sb = client(context.env);
  const { data, error } = await sb.from("blog_posts").insert(row).select("*").single();
  if (error) return json({ error: error.message }, 400);
  return json({ post: data }, 201);
};

export const onRequestPatch: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return json({ error: "Unauthorized" }, 401);
  }
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return json({ error: "id query param required" }, 400);
  let body: Record<string, unknown>;
  try {
    body = (await context.request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const fields = pickWritable(body);
  // If flipping to published and no published_at, stamp it now.
  if (fields.published === true && !fields.published_at) {
    fields.published_at = new Date().toISOString();
  }
  (fields as Record<string, unknown>).updated_at = new Date().toISOString();
  const sb = client(context.env);
  const { data, error } = await sb
    .from("blog_posts")
    .update(fields)
    .eq("id", id)
    .select("*")
    .single();
  if (error) return json({ error: error.message }, 400);
  return json({ post: data });
};

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  if (!(await isAdminRequest(context.request, context.env.ADMIN_COOKIE_SECRET))) {
    return json({ error: "Unauthorized" }, 401);
  }
  const id = new URL(context.request.url).searchParams.get("id");
  if (!id) return json({ error: "id query param required" }, 400);
  const sb = client(context.env);
  const { error } = await sb.from("blog_posts").delete().eq("id", id);
  if (error) return json({ error: error.message }, 400);
  return json({ ok: true });
};
