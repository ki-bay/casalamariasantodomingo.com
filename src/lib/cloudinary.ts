// Inserts Cloudinary on-the-fly transformations into an upload URL so we
// don't ship 2.4 MP source images for 400-px-wide thumbnails.
//
// Cloudinary URL anatomy:
//   https://res.cloudinary.com/{cloud}/image/upload/{version}/{public_id}.webp
// Transformations live between /upload/ and the version segment, e.g.:
//   .../image/upload/c_fill,w_800,q_auto,f_auto/v1776751142/file.webp
//
// We use:
//   q_auto  — Cloudinary picks the lowest quality that's visually identical
//   f_auto  — serve AVIF / WebP based on Accept header
//   c_fill  — crop to fit the requested box
//   w_NNN   — width

const UPLOAD_TOKEN = "/image/upload/";

export interface CloudinaryOpts {
  /** Display width in CSS pixels. We multiply by 2 for retina by default. */
  width?: number;
  /** Set false to skip the 2× retina multiplier. */
  retina?: boolean;
  /** "fill" (default) crops to ratio; "fit" preserves whole image. */
  crop?: "fill" | "fit" | "limit";
  /** Pass an explicit ratio for "fill" cropping (e.g. "16:9"). */
  aspectRatio?: string;
}

export function cld(url: string, opts: CloudinaryOpts = {}): string {
  if (!url || !url.includes(UPLOAD_TOKEN)) return url;
  // Don't double-transform — if a transformation slug is already present,
  // assume it was placed deliberately and pass through.
  const after = url.split(UPLOAD_TOKEN)[1] ?? "";
  if (/^[a-z]_[^/]+\//.test(after)) return url;

  const parts: string[] = ["q_auto", "f_auto"];
  if (opts.crop) parts.push(`c_${opts.crop}`);
  else if (opts.width) parts.push("c_fill");
  if (opts.aspectRatio) parts.push(`ar_${opts.aspectRatio}`);
  if (opts.width) {
    const w = opts.retina === false ? opts.width : Math.round(opts.width * 2);
    parts.push(`w_${w}`);
  }
  const transform = parts.join(",");
  return url.replace(UPLOAD_TOKEN, `${UPLOAD_TOKEN}${transform}/`);
}

/**
 * Build a `srcSet` for a Cloudinary URL — useful for responsive `<img>` tags
 * that don't go through next/image.
 */
export function cldSrcSet(url: string, widths: number[]): string {
  return widths.map((w) => `${cld(url, { width: w, retina: false })} ${w}w`).join(", ");
}
