"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollReveal } from "@/components/ScrollReveal";
import { useLocale } from "next-intl";
import Image from "next/image";

const TERRACE_IMAGES = [
  "https://res.cloudinary.com/dspogotur/image/upload/v1776751144/babula_shots-12_ncfyou.webp",
  "https://res.cloudinary.com/dspogotur/image/upload/v1776751143/babula_shots-8_2_uzxkes.webp",
  "https://res.cloudinary.com/dspogotur/image/upload/v1776751142/babula_shots-8_zb3a43.webp",
  "https://res.cloudinary.com/dspogotur/image/upload/v1776751142/babula_shots-5_utlkdy.webp",
];

export function Gallery() {
  const locale = useLocale();
  const isEN = locale === "en";
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((prev) =>
      prev !== null
        ? (prev - 1 + TERRACE_IMAGES.length) % TERRACE_IMAGES.length
        : null
    );
  const next = () =>
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % TERRACE_IMAGES.length : null
    );

  return (
    <>
      <section id="galeria" className="px-6 md:px-12 py-16 md:py-24">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-10">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Terraza" : "Terraza"}
              </p>
              <h2 className="font-serif text-2xl md:text-[30px] tracking-tight">
                {isEN ? <>A breath of fresh <em className="italic">air</em></> : <>Un respiro de <em className="italic">brisa</em></>}
              </h2>
              <p className="text-sm text-muted-foreground font-light mt-4 max-w-lg mx-auto leading-relaxed">
                {isEN
                  ? "Step up to the terrace and let the Caribbean breeze wash over you — sea views, soft wind, and the perfect spot to lose yourself in a good book."
                  : "Sube a la terraza y déjate envolver por la brisa caribeña — vistas al mar, viento suave y el lugar ideal para perderte en un buen libro."}
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            {/* 2-col × 2-row grid, no gap, full-width */}
            <div className="grid grid-cols-2">
              {[
                { src: "https://res.cloudinary.com/dspogotur/image/upload/v1776751144/babula_shots-12_ncfyou.webp",  alt: isEN ? "Terrace view" : "Vista terraza" },
                { src: "https://res.cloudinary.com/dspogotur/image/upload/v1776751143/babula_shots-8_2_uzxkes.webp", alt: isEN ? "Terrace" : "Terraza" },
                { src: "https://res.cloudinary.com/dspogotur/image/upload/v1776751142/babula_shots-8_zb3a43.webp",   alt: isEN ? "Terrace space" : "Espacio terraza" },
                { src: "https://res.cloudinary.com/dspogotur/image/upload/v1776751142/babula_shots-5_utlkdy.webp",   alt: isEN ? "Terrace lounge" : "Terraza lounge" },
              ].map((img, i) => (
                <div
                  key={i}
                  className="relative aspect-square overflow-hidden cursor-pointer group"
                  onClick={() => openLightbox(i)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="50vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && closeLightbox()}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] bg-black/95 border-none p-0 overflow-hidden [&>button]:hidden">
          <DialogTitle className="sr-only">Visor de galería</DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center h-[90vh]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                onClick={closeLightbox}
              >
                <X className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white/60 hover:text-white z-10"
                onClick={prev}
              >
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white/60 hover:text-white z-10"
                onClick={next}
              >
                <ChevronRight className="w-10 h-10" />
              </Button>
              <Image
                src={TERRACE_IMAGES[lightboxIndex]}
                alt={`Terraza ${lightboxIndex + 1}`}
                width={1200}
                height={900}
                className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {lightboxIndex + 1} / {TERRACE_IMAGES.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
