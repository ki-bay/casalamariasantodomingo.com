"use client";

import Image from "next/image";
import { useLocale } from "next-intl";
import { ScrollReveal } from "@/components/ScrollReveal";

// To swap the image once it's uploaded to Cloudinary:
//   - Cloudinary route (preferred — f_auto serves WebP/AVIF):
//       https://res.cloudinary.com/dspogotur/image/upload/q_auto,f_auto,w_1400/v.../kibay-bottle.webp
//   - Local fallback during development:
//       /kibay-bottle.webp  (drop the file in public/)
const KIBAY_IMAGE =
  "https://res.cloudinary.com/dspogotur/image/upload/q_auto,f_auto,w_1400/v1/kibay-bottle.webp";

export function KibayFeature() {
  const locale = useLocale();
  const isEN = locale === "en";

  return (
    <section
      aria-labelledby="kibay-title"
      className="relative bg-[#1a1411] text-white overflow-hidden"
    >
      {/* Subtle radial glow behind the bottle to amplify the backlit photo */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 70% 50%, rgba(201,169,110,0.18), transparent 60%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text column */}
          <ScrollReveal>
            <div className="md:pr-4 text-center md:text-left">
              <p className="text-[11px] font-semibold tracking-[0.32em] uppercase text-[#C9A96E] mb-5">
                {isEN ? "Our finest" : "Lo más selecto"}
              </p>
              <h2
                id="kibay-title"
                className="font-serif text-5xl md:text-6xl lg:text-[80px] leading-[0.95] tracking-tight mb-5 text-white"
              >
                Ki<em className="italic text-[#C9A96E] not-italic font-light">BAY</em>
              </h2>
              <p className="font-serif italic text-lg md:text-xl text-white/85 max-w-md mx-auto md:mx-0 leading-relaxed">
                {isEN
                  ? "The art of fermenting mango and passion fruit."
                  : "El arte de fermentar mango y fruta de la pasión."}
              </p>
              <div className="h-px w-16 bg-[#C9A96E]/50 mx-auto md:mx-0 my-7" />
              <p className="text-sm text-white/65 max-w-md mx-auto md:mx-0 leading-relaxed">
                {isEN
                  ? "A Dominican fermented bottle, born from the same valley that grows the country's first Caribbean vineyard. Served on arrival to every guest at Casa La Maria."
                  : "Una botella fermentada dominicana, nacida del mismo valle que cultiva el primer viñedo caribeño del país. Servida a cada huésped a su llegada a Casa La Maria."}
              </p>
            </div>
          </ScrollReveal>

          {/* Image column */}
          <ScrollReveal>
            <div className="relative aspect-[3/4] md:aspect-[4/5] w-full max-w-[460px] mx-auto">
              <Image
                src={KIBAY_IMAGE}
                alt={
                  isEN
                    ? "KiBAY — Dominican fermented mango and passion-fruit bottle, photographed in dramatic backlight"
                    : "KiBAY — Botella fermentada dominicana de mango y fruta de la pasión, fotografiada con luz dramática"
                }
                fill
                sizes="(max-width: 768px) 90vw, 460px"
                className="object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]"
                loading="lazy"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
