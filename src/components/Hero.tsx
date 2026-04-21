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
        {/* Mobile: vertical crop */}
        <Image
          src="https://res.cloudinary.com/dspogotur/image/upload/v1776748961/Casa-la-maria-santo-domingo-zona-colonial_vertical_tpzitq.webp"
          alt="Casa La Maria Santo Domingo Zona Colonial"
          fill
          className="object-cover md:hidden"
          priority
        />
        {/* Tablet & desktop: horizontal crop */}
        <Image
          src="https://res.cloudinary.com/dspogotur/image/upload/v1776748962/air-bnb-Casa-la-maria-santo-domingo-zona-colonial-_horizontal_cdtw33.webp"
          alt="Casa La Maria Santo Domingo Zona Colonial"
          fill
          className="object-cover hidden md:block"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2B2B2B]/70 via-[#2B2B2B]/50 to-background" />
      </div>
      <div className="max-w-[1200px] mx-auto flex items-center md:justify-end relative z-10">
        <ScrollReveal className="md:max-w-[560px]">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-accent rounded-full animate-pulse" />
            <span className="text-white/90 text-xs font-medium tracking-wide">
              ZONA COLONIAL · SANTO DOMINGO
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-[60px] text-white leading-[1.1] tracking-tight mb-6">
            Casa La <em className="italic text-white/80">Maria</em>
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
