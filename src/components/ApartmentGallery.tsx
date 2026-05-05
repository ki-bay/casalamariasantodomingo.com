"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  url: string;
  alt_es: string;
  alt_en: string;
};

interface Props {
  images: GalleryImage[];
  locale: string;
}

export function ApartmentGallery({ images, locale }: Props) {
  const isEN = locale === "en";
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const isOpen = openIdx !== null;

  const close = useCallback(() => setOpenIdx(null), []);
  const prev = useCallback(() => {
    setOpenIdx((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);
  const next = useCallback(() => {
    setOpenIdx((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, close, prev, next]);

  if (!images || images.length === 0) return null;

  return (
    <>
      {/* Grid of medium-size thumbnails */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={`${img.url}-${i}`}
            type="button"
            onClick={() => setOpenIdx(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label={isEN ? `Open photo ${i + 1}` : `Abrir foto ${i + 1}`}
          >
            <Image
              src={img.url}
              alt={isEN ? img.alt_en : img.alt_es}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading={i < 3 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      {/* Lightbox: full image, no crop, full-screen on mobile */}
      {isOpen && openIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            aria-label={isEN ? "Close" : "Cerrar"}
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label={isEN ? "Previous" : "Anterior"}
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                aria-label={isEN ? "Next" : "Siguiente"}
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}

          {/* Image — object-contain preserves aspect ratio (no crop) */}
          <div
            className="relative w-full h-full md:w-[90vw] md:h-[90vh] flex items-center justify-center p-2 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIdx].url}
              alt={isEN ? images[openIdx].alt_en : images[openIdx].alt_es}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-medium">
            {openIdx + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
