// Build-time fetcher for the dynamic [locale]/blog/[slug] route.
// New posts (Drive→LLM pipeline or admin-authored) live in Supabase and are
// pulled at build. The 5 hand-coded post folders take precedence at routing
// because Next.js prefers explicit routes — we exclude their slugs here so
// generateStaticParams never collides with them.

import { supabase } from "./supabase";

// Hand-coded posts under src/app/[locale]/blog/<slug>/page.tsx
// Kept in sync manually — these slugs are *reserved* for static folders.
export const HAND_CODED_SLUGS = new Set([
  "wine-tasting-ocoa-bay",
  "zona-colonial-santo-domingo",
  "zona-colonial-vs-piantini",
  "hotels-vs-airbnb-santo-domingo",
  "where-to-stay-near-calle-las-damas",
]);

export interface BlogPostRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  og_image: string | null;
  category: string | null;
  read_time: number | null;
  author: string | null;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  title_i18n: Record<string, string>;
  excerpt_i18n: Record<string, string>;
  content_i18n: Record<string, string>;
  meta_keywords_i18n: Record<string, string>;
  meta_desc_i18n: Record<string, string>;
  schema_blocks: unknown[];
}

export interface LocalisedPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  ogImage: string;
  category: string;
  readTimeMin: number;
  author: string;
  publishedAt: string;
  updatedAt: string;
  metaKeywords: string | null;
  metaDescription: string;
  schemaBlocks: unknown[];
}

const FALLBACK_COVER =
  "https://res.cloudinary.com/dspogotur/image/upload/v1776606232/casa_la_maria_santo_domingo_zona_colonial_eqyd8j.webp";

function pickLocalised(
  flat: string,
  i18n: Record<string, string> | null | undefined,
  locale: "es" | "en",
): string {
  const fromI18n = i18n?.[locale];
  if (fromI18n && fromI18n.trim().length > 0) return fromI18n;
  // Fall back to flat column (which is the ES default).
  return flat;
}

export function toLocalised(row: BlogPostRow, locale: "es" | "en"): LocalisedPost {
  return {
    slug: row.slug,
    title: pickLocalised(row.title, row.title_i18n, locale),
    excerpt: pickLocalised(row.excerpt ?? "", row.excerpt_i18n, locale),
    content: pickLocalised(row.content ?? "", row.content_i18n, locale),
    coverImage: row.cover_image ?? FALLBACK_COVER,
    ogImage: row.og_image ?? row.cover_image ?? FALLBACK_COVER,
    category: row.category ?? (locale === "en" ? "Guides" : "Guías"),
    readTimeMin: row.read_time ?? 5,
    author: row.author ?? "Casa La Maria",
    publishedAt: row.published_at ?? row.created_at,
    updatedAt: row.updated_at,
    metaKeywords: row.meta_keywords_i18n?.[locale] ?? null,
    metaDescription:
      row.meta_desc_i18n?.[locale] ?? pickLocalised(row.excerpt ?? "", row.excerpt_i18n, locale),
    schemaBlocks: Array.isArray(row.schema_blocks) ? row.schema_blocks : [],
  };
}

export async function getPublishedDbSlugs(): Promise<string[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("published", true);
  if (error) {
    console.error("[blog-posts] getPublishedDbSlugs:", error.message);
    return [];
  }
  return (data ?? [])
    .map((r) => r.slug as string)
    .filter((s) => !HAND_CODED_SLUGS.has(s));
}

export async function getPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("[blog-posts] getPostBySlug:", error.message);
    return null;
  }
  return (data as BlogPostRow) ?? null;
}

export async function getAllPublishedPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error) {
    console.error("[blog-posts] getAllPublishedPosts:", error.message);
    return [];
  }
  return (data ?? []) as BlogPostRow[];
}
