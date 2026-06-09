// Cron-fired worker that processes pending rows in blog_social_shares.
//
// POST /api/social-share-worker
//   Authorization: Bearer <CRON_SECRET>
//
// For each pending row whose platform has credentials configured:
//   1. Loads the blog post (must still be published)
//   2. Builds the platform-appropriate caption
//   3. Calls the platform adapter
//   4. Updates the row: posted (external_id/url + posted_at) or failed
//
// Failures get logged on the row; admin can retry from the UI. We do
// NOT auto-retry within the same run — the failure is usually a token
// or content issue that needs human review.

import { createClient } from "@supabase/supabase-js";
import { postToFacebook } from "../_lib/social/facebook";
import { postToInstagram } from "../_lib/social/instagram";
import { postToLinkedIn } from "../_lib/social/linkedin";
import { enabledPlatforms, type SocialEnv, type SocialPlatform } from "../_lib/social-queue";
import type { ShareInput, ShareResult } from "../_lib/social/types";

interface Env extends SocialEnv {
  CRON_SECRET: string;
  NEXT_PUBLIC_SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

const SITE = "https://casalamariazonacolonial.com";
const MAX_SHARES_PER_RUN = 6; // each call is sub-second; this is just a guardrail

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Cache-Control": "no-store", "Content-Type": "application/json" },
  });

interface ShareRow {
  id: string;
  blog_post_id: string;
  platform: SocialPlatform;
  status: string;
}

interface PostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  og_image: string | null;
  published: boolean;
  title_i18n: Record<string, string> | null;
  excerpt_i18n: Record<string, string> | null;
}

/** Compose a caption suited to each platform. */
function buildCaption(post: PostRow, platform: SocialPlatform, url: string): string {
  const excerpt = post.excerpt_i18n?.es ?? post.excerpt ?? "";
  const title = post.title_i18n?.es ?? post.title ?? "";
  switch (platform) {
    case "facebook":
      // FB shows the link card automatically; keep caption short, lead with hook.
      return `${title}\n\n${excerpt}`.slice(0, 600);
    case "instagram":
      // IG caption max 2200; URL not clickable. Tell people where to find it.
      return `${title}\n\n${excerpt}\n\n➜ ${url}\n\n#santodomingo #zonacolonial #casalamaria #republicadominicana`;
    case "linkedin":
      return `${title}\n\n${excerpt}\n\nLee más: ${url}`;
  }
}

async function processShare(
  env: Env,
  sb: ReturnType<typeof createClient>,
  row: ShareRow,
): Promise<{ id: string; platform: SocialPlatform; ok: boolean; error?: string }> {
  // Load + sanity-check the post
  const { data: post, error: postErr } = await sb
    .from("blog_posts")
    .select(
      "id, slug, title, excerpt, cover_image, og_image, published, title_i18n, excerpt_i18n",
    )
    .eq("id", row.blog_post_id)
    .maybeSingle();

  if (postErr || !post) {
    await markFailed(sb, row.id, "post not found");
    return { id: row.id, platform: row.platform, ok: false, error: "post not found" };
  }
  const p = post as PostRow;
  if (!p.published) {
    // Don't share unpublished posts — skip silently and mark cancelled.
    await sb
      .from("blog_social_shares")
      .update({ status: "cancelled", error: "post no longer published", attempted_at: new Date().toISOString() })
      .eq("id", row.id);
    return { id: row.id, platform: row.platform, ok: false, error: "post unpublished" };
  }

  const url = `${SITE}/es/blog/${p.slug}`;
  const imageUrl = p.cover_image ?? p.og_image ?? "";
  const caption = buildCaption(p, row.platform, url);
  const input: ShareInput = {
    postUrl: url,
    caption,
    imageUrl,
    title: p.title_i18n?.es ?? p.title,
  };

  let result: ShareResult;
  switch (row.platform) {
    case "facebook":
      result = await postToFacebook(env.FB_PAGE_ID!, env.FB_PAGE_ACCESS_TOKEN!, input);
      break;
    case "instagram":
      result = await postToInstagram(env.IG_USER_ID!, env.IG_ACCESS_TOKEN!, input);
      break;
    case "linkedin":
      result = await postToLinkedIn(env.LINKEDIN_ORG_URN!, env.LINKEDIN_ACCESS_TOKEN!, input);
      break;
  }

  if (result.ok) {
    await sb
      .from("blog_social_shares")
      .update({
        status: "posted",
        external_id: result.externalId ?? null,
        external_url: result.externalUrl ?? null,
        posted_at: new Date().toISOString(),
        attempted_at: new Date().toISOString(),
        error: null,
      })
      .eq("id", row.id);
    return { id: row.id, platform: row.platform, ok: true };
  } else {
    await markFailed(sb, row.id, result.error ?? "unknown error");
    return { id: row.id, platform: row.platform, ok: false, error: result.error };
  }
}

async function markFailed(sb: ReturnType<typeof createClient>, id: string, error: string) {
  await sb
    .from("blog_social_shares")
    .update({
      status: "failed",
      error,
      attempted_at: new Date().toISOString(),
    })
    .eq("id", id);
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;

  const auth = context.request.headers.get("Authorization") ?? "";
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return json({ error: "Unauthorized" }, 401);
  }
  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    return json({ error: "Supabase not configured" }, 500);
  }

  const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const active = enabledPlatforms(env);
  if (active.length === 0) {
    return json({ enabled_platforms: [], processed: [], note: "No platform credentials configured" });
  }

  const { data: pending } = await sb
    .from("blog_social_shares")
    .select("id, blog_post_id, platform, status")
    .eq("status", "pending")
    .in("platform", active)
    .order("attempted_at", { ascending: true })
    .limit(MAX_SHARES_PER_RUN);

  const rows = (pending ?? []) as ShareRow[];
  const processed: Array<{ id: string; platform: SocialPlatform; ok: boolean; error?: string }> = [];
  for (const row of rows) {
    processed.push(await processShare(env, sb, row));
  }
  return json({
    enabled_platforms: active,
    pending_total: rows.length,
    processed,
  });
};

export const onRequestGet: PagesFunction<Env> = (context) => onRequestPost(context);
