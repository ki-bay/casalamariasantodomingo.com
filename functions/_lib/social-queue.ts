// Auto-queue logic shared by admin endpoints. When a blog post flips from
// unpublished → published, we insert one pending row into
// blog_social_shares for each platform that has its credentials
// configured. The social-share-worker cron picks them up.
//
// Platforms with no credentials aren't queued; admin sees no row for them.
// This keeps the UI honest about what's actually enabled.

import type { SupabaseClient } from "@supabase/supabase-js";

export type SocialPlatform = "facebook" | "instagram" | "linkedin";

export interface SocialEnv {
  FB_PAGE_ACCESS_TOKEN?: string;
  FB_PAGE_ID?: string;
  IG_USER_ID?: string;
  IG_ACCESS_TOKEN?: string;
  LINKEDIN_ACCESS_TOKEN?: string;
  LINKEDIN_ORG_URN?: string;
}

/** Which platforms have both the token and the destination ID configured. */
export function enabledPlatforms(env: SocialEnv): SocialPlatform[] {
  const out: SocialPlatform[] = [];
  if (env.FB_PAGE_ACCESS_TOKEN && env.FB_PAGE_ID) out.push("facebook");
  if (env.IG_ACCESS_TOKEN && env.IG_USER_ID) out.push("instagram");
  if (env.LINKEDIN_ACCESS_TOKEN && env.LINKEDIN_ORG_URN) out.push("linkedin");
  return out;
}

/**
 * Insert a pending share row for each enabled platform that doesn't
 * already have one for this post. Safe to call multiple times — won't
 * create duplicates.
 */
export async function queueSharesForPost(
  sb: SupabaseClient,
  blogPostId: string,
  env: SocialEnv,
): Promise<{ queued: SocialPlatform[]; skipped: SocialPlatform[] }> {
  const platforms = enabledPlatforms(env);
  if (platforms.length === 0) return { queued: [], skipped: [] };

  const { data: existing } = await sb
    .from("blog_social_shares")
    .select("platform")
    .eq("blog_post_id", blogPostId);

  const already = new Set((existing ?? []).map((r) => r.platform as SocialPlatform));
  const toQueue = platforms.filter((p) => !already.has(p));
  if (toQueue.length === 0) return { queued: [], skipped: platforms };

  const rows = toQueue.map((platform) => ({
    blog_post_id: blogPostId,
    platform,
    status: "pending",
  }));

  await sb.from("blog_social_shares").insert(rows);
  return { queued: toQueue, skipped: [...already] };
}
