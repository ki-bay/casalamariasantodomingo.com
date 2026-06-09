// Instagram Business post via the Graph API. Two-step: create a media
// container, then publish it.
//
// IG mandates an image (or video). For blog post sharing we use the
// cover image + caption that includes the post URL. IG does not make
// captions clickable, so the URL appears as plain text and we tell
// followers to "tap the link in bio" (a Casa La Maria convention).
//
// Requires an IG Business or Creator account linked to a Facebook Page
// and the same long-lived Page access token as Facebook, plus the
// IG user ID (Graph: /me/accounts → instagram_business_account.id).

import type { ShareInput, ShareResult } from "./types";

const GRAPH_VERSION = "v23.0";

interface CreateMediaResponse {
  id?: string;
  error?: { message?: string };
}
interface PublishResponse {
  id?: string;
  error?: { message?: string };
}

export async function postToInstagram(
  igUserId: string,
  accessToken: string,
  input: ShareInput,
): Promise<ShareResult> {
  try {
    // Step 1: create media container
    const createUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(igUserId)}/media`;
    const createBody = new URLSearchParams({
      image_url: input.imageUrl,
      caption: input.caption,
      access_token: accessToken,
    });
    const createRes = await fetch(createUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: createBody,
    });
    const createJson = (await createRes.json()) as CreateMediaResponse;
    if (!createRes.ok || !createJson.id) {
      return {
        ok: false,
        error: `IG create: ${createJson.error?.message ?? `HTTP ${createRes.status}`}`,
      };
    }
    const containerId = createJson.id;

    // Step 2: publish
    const publishUrl = `https://graph.facebook.com/${GRAPH_VERSION}/${encodeURIComponent(igUserId)}/media_publish`;
    const publishBody = new URLSearchParams({
      creation_id: containerId,
      access_token: accessToken,
    });
    const publishRes = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: publishBody,
    });
    const publishJson = (await publishRes.json()) as PublishResponse;
    if (!publishRes.ok || !publishJson.id) {
      return {
        ok: false,
        error: `IG publish: ${publishJson.error?.message ?? `HTTP ${publishRes.status}`}`,
      };
    }
    return {
      ok: true,
      externalId: publishJson.id,
      // The permalink isn't returned synchronously; we can fetch it after
      // but it's not essential — the admin can find the post in the IG
      // account by ID. Skip the extra round-trip.
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
