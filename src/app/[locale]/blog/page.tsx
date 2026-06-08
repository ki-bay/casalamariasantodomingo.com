import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { BLOG_POSTS } from "@/lib/data";
import { getAllPublishedPosts, HAND_CODED_SLUGS, toLocalised } from "@/lib/blog-posts";
import { BlogListClient, type BlogListItem } from "./BlogListClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/blog",
    pathEn: "/blog",
    titleEs: "Blog · Casa La Maria — Guías de la Zona Colonial Santo Domingo",
    titleEn: "Blog · Casa La Maria — Colonial Zone Santo Domingo Guides",
    descEs:
      "Guías de decisión y locales sobre la Zona Colonial: dónde quedarse, hoteles vs Airbnb, qué hacer cerca de Calle Las Damas y experiencias en Santo Domingo.",
    descEn:
      "Local and decision guides for the Colonial Zone: where to stay, hotels vs Airbnb, things to do near Calle Las Damas and Santo Domingo experiences.",
  });
}

function formatDate(iso: string, isEN: boolean) {
  try {
    return new Date(iso).toLocaleDateString(isEN ? "en-US" : "es-DO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";

  // DB posts first (filter out anything that collides with a hand-coded folder
  // — safety net; getPublishedDbSlugs already excludes those slugs).
  const dbRows = await getAllPublishedPosts();
  const dbPosts: BlogListItem[] = dbRows
    .filter((r) => !HAND_CODED_SLUGS.has(r.slug))
    .map((r) => {
      const p = toLocalised(r, isEN ? "en" : "es");
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        coverImage: p.coverImage,
        category: p.category,
        readTime: `${p.readTimeMin} min`,
        date: formatDate(p.publishedAt, isEN),
      };
    });

  const handCoded: BlogListItem[] = BLOG_POSTS.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    category: p.category,
    readTime: p.readTime,
    date: p.date,
  }));

  // Newest first: DB posts (published_at DESC) on top, then the hand-coded set.
  const posts = [...dbPosts, ...handCoded];

  return <BlogListClient posts={posts} />;
}
