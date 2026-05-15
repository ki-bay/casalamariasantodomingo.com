"use client";

import { Star, Users, BedDouble, ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PROPERTY, PROPERTY_EN } from "@/lib/data";
import { useLocale } from "next-intl";
import Image from "next/image";

export function Hero() {
  const locale = useLocale();
  const isEN = locale === "en";
  const handleScrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      const offset = 100;
      const pos = el.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: "smooth" });
    }
  };

  return (
    <header className="relative min-h-[90vh] pt-32 pb-20 px-6 md:px-12 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* LCP image — the source is 903×1623 portrait. c_limit prevents
            upscaling beyond that; q_auto:eco trades a small visual hit for
            ~30 % byte savings; f_auto serves AVIF / WebP to supporting
            browsers. On a Moto G Power (412 px) this 800-px image is
            ~2× retina, plenty sharp. */}
        <Image
          src="https://res.cloudinary.com/dspogotur/image/upload/c_limit,w_800,q_auto:eco,f_auto/v1776606232/casa_la_maria_santo_domingo_zona_colonial_eqyd8j.webp"
          alt="Casa La Maria Santo Domingo Zona Colonial"
          fill
          className="object-cover"
          priority
          fetchPriority="high"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>
      <div className="max-w-[1200px] mx-auto flex items-center md:justify-end relative z-10">
        <ScrollReveal className="md:max-w-[560px]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-accent rounded-full animate-pulse" />
            <span className="text-black/90 text-xs font-medium tracking-wide">
              ZONA COLONIAL · SANTO DOMINGO
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[60px] text-black leading-[1.1] tracking-tight mb-6">
            Casa La <em className="italic text-black/80">Maria</em>
          </h1>
          <p className="text-white/70 text-base md:text-lg font-light leading-relaxed mb-8 max-w-md">
            {isEN ? PROPERTY_EN.shortDescription : PROPERTY.shortDescription}
          </p>
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <Button
              onClick={() => handleScrollTo("#reserva")}
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-7 py-3.5 font-medium text-sm shadow-lg inline-flex items-center gap-2"
            >
              {isEN ? "Book Now" : "Reservar Ahora"} <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => handleScrollTo("#propiedad")}
              variant="outline"
              className="text-white px-5 py-3.5 rounded-full font-medium text-sm border-white/40 bg-black/20 hover:bg-black/30 inline-flex items-center gap-2"
            >
              <Play className="w-4 h-4" /> {isEN ? "Read More" : "Leer Más"}
            </Button>
          </div>
          <div className="flex items-center gap-6 text-white/60 text-xs">
            <div className="flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-amber-star text-amber-star" />
              <span className="text-white font-medium">{PROPERTY.rating}</span>
              <span>({PROPERTY.reviewCount} {isEN ? "reviews" : "reseñas"})</span>
            </div>
            <div className="w-px h-3 bg-white/30" />
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>{isEN ? `Up to ${PROPERTY.maxGuests} guests` : `Hasta ${PROPERTY.maxGuests} huéspedes`}</span>
            </div>
            <div className="w-px h-3 bg-white/30" />
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-3.5 h-3.5" />
              <span>{PROPERTY.bedrooms} {isEN ? "bedroom" : "dormitorio"}</span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </header>
  );
}
