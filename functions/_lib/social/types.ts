// Shared types for the social-share adapters.

export interface ShareInput {
  /** Public URL of the blog post (Spanish canonical). */
  postUrl: string;
  /** Short caption — usually the post's excerpt + URL. Pre-trimmed. */
  caption: string;
  /** Absolute URL of the cover image. */
  imageUrl: string;
  /** Post title — useful as link preview override or alt text. */
  title: string;
}

export interface ShareResult {
  ok: boolean;
  /** Platform-side ID, e.g. Facebook post ID. */
  externalId?: string;
  /** Canonical URL on the platform. */
  externalUrl?: string;
  /** Human-readable error if !ok. */
  error?: string;
}
