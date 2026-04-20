export const runtime = 'edge';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BLOG_POSTS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const paragraphs = post.content.split("\n\n");

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <article className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[800px] mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Blog
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-medium tracking-wider uppercase text-secondary bg-surface px-2.5 py-1 rounded-full border border-warm-border">
                {post.category}
              </span>
              <span className="text-xs text-secondary flex items-center gap-1">
                <Clock className="w-3 h-3" /> {post.readTime} lectura
              </span>
              <span className="text-xs text-secondary">· {post.date}</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl tracking-tight leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-warm-muted font-light leading-relaxed text-lg">
              {post.excerpt}
            </p>
          </div>

          <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-10 border border-warm-border">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose prose-lg max-w-none">
            {paragraphs.map((p, i) => {
              if (p.startsWith("## ")) {
                return (
                  <h2
                    key={i}
                    className="font-serif text-2xl mt-10 mb-4 text-primary"
                  >
                    {p.replace("## ", "")}
                  </h2>
                );
              }
              if (p.startsWith("### ")) {
                return (
                  <h3
                    key={i}
                    className="font-serif text-xl mt-8 mb-3 text-primary"
                  >
                    {p.replace("### ", "")}
                  </h3>
                );
              }
              return (
                <p
                  key={i}
                  className="text-warm-muted font-light leading-relaxed mb-4"
                >
                  {p}
                </p>
              );
            })}
          </div>

          <div className="mt-12 pt-8 border-t border-warm-border">
            <p className="text-xs text-secondary">
              Escrito por <span className="font-medium text-primary">Casa La Maria</span>
            </p>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  );
}
