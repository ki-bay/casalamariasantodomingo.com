// LinkedIn organization post via the UGC Posts API.
//
// Endpoint: POST https://api.linkedin.com/v2/ugcPosts
// Auth: Bearer access token from a LinkedIn Marketing Developer Platform
// app, with scopes: w_organization_social + r_organization_admin.
//
// LINKEDIN_ORG_URN is `urn:li:organization:{id}` for a company page, or
// `urn:li:person:{id}` for a personal profile. Posts to either work the
// same; the URN distinguishes who's posting.

import type { ShareInput, ShareResult } from "./types";

export async function postToLinkedIn(
  orgUrn: string,
  accessToken: string,
  input: ShareInput,
): Promise<ShareResult> {
  try {
    const body = {
      author: orgUrn,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: { text: input.caption },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              originalUrl: input.postUrl,
              title: { text: input.title },
              description: { text: input.caption.slice(0, 200) },
            },
          ],
        },
      },
      visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" },
    };
    const res = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `LinkedIn HTTP ${res.status}: ${text.slice(0, 300)}` };
    }
    // The post URN is returned in the `x-restli-id` header (preferred) or
    // in the response body's `id` field. We surface the URN as externalId
    // and build a feed URL the admin can open to verify.
    const postUrn = res.headers.get("x-restli-id") ?? "";
    return {
      ok: true,
      externalId: postUrn,
      externalUrl: postUrn
        ? `https://www.linkedin.com/feed/update/${encodeURIComponent(postUrn)}`
        : undefined,
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
