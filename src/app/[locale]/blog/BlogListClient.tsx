"use client";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import Image from "next/image";
import Link from "next/link";

export type BlogListItem = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: string;
  readTime: string;
  date: string;
};

export function BlogListClient({ posts }: { posts: BlogListItem[] }) {
  const locale = useLocale();
  const isEN = locale === "en";
  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                Blog
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                {isEN ? <>Discover <em className="italic">Santo Domingo</em></> : <>Descubre <em className="italic">Santo Domingo</em></>}
              </h1>
              <p className="text-warm-muted font-light max-w-lg mx-auto">
                {isEN
                  ? "Guides, recommendations and secrets from the Colonial Zone and beyond. Everything you need for your stay at Casa La Maria."
                  : "Guías, recomendaciones y secretos de la Zona Colonial y sus alrededores. Todo lo que necesitas saber para tu estancia en Casa La Maria."}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <ScrollReveal key={post.slug}>
                <Link
                  href={`/${locale}/blog/${post.slug}`}
                  className="group bg-white border border-warm-border rounded-xl overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 block"
                >
                  <div className="overflow-hidden aspect-[16/10]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={600}
                      height={380}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[10px] font-medium tracking-wider uppercase text-secondary bg-surface px-2.5 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-xs text-secondary">
                        {post.readTime} {isEN ? "read" : "lectura"}
                      </span>
                    </div>
                    <h2 className="font-serif text-lg mb-3 leading-snug group-hover:text-primary/80 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-warm-muted font-light leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                    <p className="text-xs text-secondary mt-4">{post.date}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
