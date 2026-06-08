// Dynamic blog renderer. Pulls rows from Supabase at build time (static
// export). Slug collisions with hand-coded post folders are impossible
// because HAND_CODED_SLUGS is filtered out in generateStaticParams and
// Next.js prefers explicit folder routes regardless.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SITE, SITE_NAME } from "@/lib/seo";
import {
  getAllPublishedPosts,
  getPostBySlug,
  getPublishedDbSlugs,
  HAND_CODED_SLUGS,
  toLocalised,
} from "@/lib/blog-posts";

type Props = { params: Promise<{ locale: string; slug: string }> };

// generateStaticParams returns the cartesian product of (locale × DB slug).
// Hand-coded folders are excluded so we never duplicate routes. When there
// are no DB posts, return a sentinel that the page renders as notFound() —
// Next.js requires at least one entry under `output: export`.
const EMPTY_SENTINEL = "__no-posts__";

export async function generateStaticParams() {
  const slugs = await getPublishedDbSlugs();
  const effective = slugs.length > 0 ? slugs : [EMPTY_SENTINEL];
  return effective.flatMap((slug) =>
    ["es", "en"].map((locale) => ({ locale, slug })),
  );
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  // Hand-coded post pages own their own metadata; if a hand-coded slug ever
  // slipped through, do not synthesize over it.
  if (HAND_CODED_SLUGS.has(slug) || slug === EMPTY_SENTINEL) {
    return { robots: { index: false, follow: false } };
  }
  const row = await getPostBySlug(slug);
  if (!row) return { robots: { index: false, follow: false } };

  const isEN = locale === "en";
  const post = toLocalised(row, isEN ? "en" : "es");
  const canonicalEs = `${SITE}/es/blog/${slug}`;
  const canonicalEn = `${SITE}/en/blog/${slug}`;
  const canonical = isEN ? canonicalEn : canonicalEs;

  return {
    title: post.title,
    description: post.metaDescription,
    keywords: post.metaKeywords ?? undefined,
    alternates: {
      canonical,
      languages: {
        es: canonicalEs,
        en: canonicalEn,
        "x-default": canonicalEs,
      },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.metaDescription,
      url: canonical,
      siteName: SITE_NAME,
      locale: isEN ? "en_US" : "es_DO",
      alternateLocale: isEN ? "es_DO" : "en_US",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      images: [{ url: post.ogImage, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.metaDescription,
      images: [post.ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (HAND_CODED_SLUGS.has(slug) || slug === EMPTY_SENTINEL) notFound();

  const row = await getPostBySlug(slug);
  if (!row) notFound();
  const isEN = locale === "en";
  const post = toLocalised(row, isEN ? "en" : "es");

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString(isEN ? "en-US" : "es-DO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return iso;
    }
  };

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: [post.ogImage],
    author: {
      "@type": "Organization",
      name: post.author,
      url: SITE,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE,
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    url: `${SITE}/${locale}/blog/${slug}`,
    mainEntityOfPage: `${SITE}/${locale}/blog/${slug}`,
    inLanguage: locale,
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      {post.schemaBlocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}

      <Navbar />

      <article>
        <header className="pt-28 pb-10 px-6 md:px-12">
          <div className="max-w-[820px] mx-auto">
            <ScrollReveal>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-10"
              >
                <ArrowLeft className="w-4 h-4" />
                {isEN ? "Back to Blog" : "Volver al Blog"}
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-medium tracking-wider uppercase text-secondary bg-muted px-2.5 py-1 rounded-full border border-warm-border">
                  {post.category}
                </span>
                <span className="text-xs text-secondary flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTimeMin} min{" "}
                  {isEN ? "read" : "lectura"}
                </span>
                <span className="text-xs text-secondary flex items-center gap-1">
                  <CalendarDays className="w-3 h-3" />
                  {formatDate(post.publishedAt)}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-[46px] md:leading-[1.15] tracking-tight mb-5">
                {post.title}
              </h1>

              <p className="text-warm-muted font-light leading-relaxed text-lg md:text-xl max-w-[720px]">
                {post.excerpt}
              </p>
            </ScrollReveal>
          </div>
        </header>

        <div className="w-full">
          <img
            src={post.coverImage}
            alt={post.title}
            width={2400}
            height={1500}
            className="w-full h-auto block"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        <section className="px-6 md:px-12 py-16">
          <div className="max-w-[760px] mx-auto">
            <ScrollReveal>
              <div className="prose prose-neutral max-w-none font-light leading-relaxed
                prose-headings:font-serif prose-headings:tracking-tight
                prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-warm-muted prose-p:text-base prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-primary prose-strong:font-medium
                prose-img:rounded-xl prose-img:my-8
                prose-ul:text-warm-muted prose-li:my-1">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="mt-12 pt-8 border-t border-warm-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-secondary">
                  {isEN ? "Written by" : "Escrito por"}{" "}
                  <span className="font-medium text-primary">{post.author}</span>
                </p>
                <p className="text-xs text-secondary">
                  {isEN ? "Last updated:" : "Última actualización:"}{" "}
                  <time dateTime={post.updatedAt}>
                    {formatDate(post.updatedAt)}
                  </time>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="px-6 md:px-12 pb-20">
          <div className="max-w-[760px] mx-auto">
            <ScrollReveal>
              <div className="bg-card border border-warm-border rounded-2xl p-10 md:p-12 text-center">
                <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-4">
                  {isEN ? "Stay in the Colonial Zone" : "Alójate en la Zona Colonial"}
                </p>
                <h2 className="font-serif text-2xl md:text-[32px] tracking-tight mb-4">
                  {isEN
                    ? "Book Casa La Maria for your Santo Domingo trip"
                    : "Reserva Casa La Maria para tu viaje a Santo Domingo"}
                </h2>
                <p className="text-warm-muted font-light leading-relaxed max-w-[520px] mx-auto mb-8">
                  {isEN
                    ? "Boutique apartments on Parmenio Troncoso 4 in the heart of the Colonial Zone."
                    : "Apartamentos boutique en Parmenio Troncoso 4 en el corazón de la Zona Colonial."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/apartamentos`}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-8 py-3 rounded-lg font-medium text-sm"
                  >
                    {isEN ? "View apartments" : "Ver apartamentos"}
                  </Link>
                  <Link
                    href={`/${locale}/contacto`}
                    className="inline-flex items-center justify-center gap-2 border border-warm-border hover:bg-muted transition-colors px-8 py-3 rounded-lg font-medium text-sm"
                  >
                    {isEN ? "Inquire" : "Consultar"}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
