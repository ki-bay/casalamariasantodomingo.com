"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { GALLERY_IMAGES, LIGHTBOX_IMAGES } from "@/lib/data";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

const CATEGORIES = [
  "Todos",
  "Sala Principal",
  "Dormitorio",
  "Baño",
  "Cocina",
  "Terraza",
  "Piscina",
];

export default function GaleriaPage() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredImages =
    activeCategory === "Todos"
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.label === activeCategory);

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[1200px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                Galería
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                Espacios que <em className="italic">inspiran</em>
              </h1>
              <p className="text-warm-muted font-light max-w-lg mx-auto">
                Explora cada rincón de Casa La Maria. Haz clic en cualquier
                imagen para ampliarla.
              </p>
            </div>
          </ScrollReveal>

          {/* Category filters */}
          <ScrollReveal>
            <div className="flex gap-2 flex-wrap justify-center mb-10">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-medium rounded-full border transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-white border-primary"
                      : "border-warm-border text-secondary hover:border-primary hover:text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredImages.map((img, index) => (
              <div
                key={img.label}
                className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                  img.isMain ? "md:col-span-2 md:row-span-2" : ""
                }`}
                onClick={() => setLightboxIndex(index)}
              >
                <div
                  className={`${
                    img.isMain ? "aspect-square md:aspect-auto md:h-[500px]" : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes={img.isMain ? "66vw" : "33vw"}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-sm font-medium">{img.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {/* Lightbox */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] bg-black/95 border-none p-0 overflow-hidden [&>button]:hidden">
          <DialogTitle className="sr-only">Visor de galería</DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative flex items-center justify-center h-[90vh]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white/80 hover:text-white z-10"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="w-8 h-8" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 text-white/60 hover:text-white z-10"
                onClick={() =>
                  setLightboxIndex(
                    (prev) =>
                      prev !== null
                        ? (prev - 1 + LIGHTBOX_IMAGES.length) %
                          LIGHTBOX_IMAGES.length
                        : null
                  )
                }
              >
                <ChevronLeft className="w-10 h-10" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 text-white/60 hover:text-white z-10"
                onClick={() =>
                  setLightboxIndex(
                    (prev) =>
                      prev !== null
                        ? (prev + 1) % LIGHTBOX_IMAGES.length
                        : null
                  )
                }
              >
                <ChevronRight className="w-10 h-10" />
              </Button>
              <Image
                src={LIGHTBOX_IMAGES[lightboxIndex]}
                alt={`Imagen ${lightboxIndex + 1}`}
                width={1200}
                height={900}
                className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain"
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {lightboxIndex + 1} / {LIGHTBOX_IMAGES.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
