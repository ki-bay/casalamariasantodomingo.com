// Facebook Page post via the Graph API.
//
// Endpoint: POST https://graph.facebook.com/v23.0/{page-id}/feed
//   ?message={caption}
//   &link={postUrl}
//   &access_token={page-access-token}
//
// Requires a Page Access Token (long-lived, never-expiring is best). Get
// one via Meta Business Suite → System Users → Generate Token, scope
// pages_manage_posts + pages_read_engagement.

import type { ShareInput, ShareResult } from "./types";

const GRAPH_VERSION = "v23.0";

export async function postToFacebook(
  pageId: string,
  pageAccessToken: string,
  input: ShareInput,
): Promise<ShareResult> {
  try {
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(pageId)}/feed`;
    const body = new URLSearchParams({
      message: input.caption,
      link: input.postUrl,
      access_token: pageAccessToken,
    });
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const json = (await res.json()) as { id?: string; error?: { message?: string } };
    if (!res.ok || !json.id) {
      return {
        ok: false,
        error: json.error?.message ?? `HTTP ${res.status}`,
      };
    }
    // Page post IDs are formatted `{page_id}_{post_id}` — the public URL is
    // /{page_id}/posts/{post_id}
    const parts = json.id.split("_");
    const postId = parts[1] ?? json.id;
    return {
      ok: true,
      externalId: json.id,
      externalUrl: `https://www.facebook.com/${encodeURIComponent(pageId)}/posts/${encodeURIComponent(postId)}`,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
