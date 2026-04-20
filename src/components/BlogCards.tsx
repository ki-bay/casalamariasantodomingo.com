"use client";

import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { BLOG_POSTS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export function BlogCards() {
  return (
    <section id="blog" className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <ScrollReveal>
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                Blog
              </p>
              <h2 className="font-serif text-2xl md:text-[30px] tracking-tight">
                Descubre <em className="italic">Santo Domingo</em>
              </h2>
            </div>
          </ScrollReveal>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-medium border border-warm-border rounded-md px-4 py-2.5 hover:border-primary hover:bg-primary hover:text-white transition-all mt-4 md:mt-0 w-fit"
          >
            Ver todos los artículos <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white border border-warm-border rounded-xl overflow-hidden transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
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
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-medium tracking-wider uppercase text-secondary bg-surface px-2.5 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-secondary">
                      {post.readTime} lectura
                    </span>
                  </div>
                  <h3 className="font-serif text-base mb-2 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-warm-muted font-light leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-secondary mt-3">{post.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
