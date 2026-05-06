// Centralised metadata builder for pages with bilingual ES/EN routes.
// Ensures every page ships with: unique title + description + canonical +
// hreflang alternates + complete OpenGraph + Twitter Card + robots.

import type { Metadata } from "next";

export const SITE = "https://casalamariazonacolonial.com";
export const SITE_NAME = "Casa La Maria";
export const DEFAULT_OG_IMAGE =
  "https://res.cloudinary.com/dspogotur/image/upload/v1776606232/casa_la_maria_santo_domingo_zona_colonial_eqyd8j.webp";

interface BuildMetadataInput {
  locale: "es" | "en";
  /** Path under each locale, e.g. "apartamentos" / "apartments". */
  pathEs: string;
  pathEn: string;
  titleEs: string;
  titleEn: string;
  descEs: string;
  descEn: string;
  /** Override OG image (defaults to homepage hero). */
  image?: string;
  /** Override og:type (default "website"). */
  ogType?: "website" | "article";
  /** Mark as noindex (admin etc). */
  noindex?: boolean;
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const isEN = input.locale === "en";
  const pathEs = input.pathEs.startsWith("/") ? input.pathEs : `/${input.pathEs}`;
  const pathEn = input.pathEn.startsWith("/") ? input.pathEn : `/${input.pathEn}`;
  const canonicalEs = `${SITE}/es${pathEs === "/" ? "" : pathEs}`;
  const canonicalEn = `${SITE}/en${pathEn === "/" ? "" : pathEn}`;
  const canonical = isEN ? canonicalEn : canonicalEs;
  const title = isEN ? input.titleEn : input.titleEs;
  const description = isEN ? input.descEn : input.descEs;
  const image = input.image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { es: canonicalEs, en: canonicalEn },
    },
    openGraph: {
      type: input.ogType ?? "website",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: isEN ? "en_US" : "es_DO",
      alternateLocale: isEN ? "es_DO" : "en_US",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: input.noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
