"use client";

import { ScrollReveal } from "@/components/ScrollReveal";
import { REVIEWS, RATING_BREAKDOWN, RATING_BREAKDOWN_EN, PROPERTY } from "@/lib/data";
import { useLocale } from "next-intl";

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${cls} ${i <= rating ? "fill-amber-star text-amber-star" : "fill-warm-border text-warm-border"}`}
          viewBox="0 0 24 24"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function Reviews() {
  const locale = useLocale();
  const isEN = locale === "en";
  const ratingBreakdown = isEN ? RATING_BREAKDOWN_EN : RATING_BREAKDOWN;
  return (
    <section id="resenas" className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <ScrollReveal>
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Reviews" : "Reseñas"}
              </p>
              <h2 className="font-serif text-2xl md:text-[30px] tracking-tight">
                {isEN ? <>What our <em className="italic">guests say</em></> : <>Lo que dicen <em className="italic">nuestros huéspedes</em></>}
              </h2>
            </div>
          </ScrollReveal>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <StarRating rating={5} size="md" />
            <span className="text-sm font-medium">{PROPERTY.rating}</span>
            <span className="text-sm text-secondary">
              · {PROPERTY.reviewCount} {isEN ? "reviews" : "reseñas"}
            </span>
          </div>
        </div>

        <ScrollReveal>
          <div className="grid md:grid-cols-[200px_1fr] gap-8 mb-10">
            {/* Rating breakdown */}
            <div className="space-y-2">
              {ratingBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{item.category}</span>
                    <span className="font-medium">{item.score.toFixed(1)}</span>
                  </div>
                  <div className="h-1.5 bg-warm-border rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${(item.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Review cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {REVIEWS.map((review) => (
                <div
                  key={review.name}
                  className="bg-card border border-warm-border rounded-xl p-7 transition-all hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-xs text-secondary">{review.date}</p>
                    </div>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="text-sm text-warm-muted font-light leading-relaxed mt-2">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
