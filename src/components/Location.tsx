"use client";

import { useState } from "react";
import { Navigation, Landmark, Church, Building, TreePalm, Plane, ShoppingBag, Wine, MapPin } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { NEARBY_PLACES } from "@/lib/data";
import { useLocale } from "next-intl";

const PLACE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  landmark: Landmark, church: Church, building: Building,
  "palm-tree": TreePalm, plane: Plane, "shopping-bag": ShoppingBag, wine: Wine,
};

const MAPS_EMBED =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3783.5!2d-69.88640158707528!3d18.469990300133684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf895291e5116d%3A0xb5b4afd0ff018b6d!2sCasa%20La%20Maria!5e0!3m2!1ses!2sdo!4v1776751500000!5m2!1ses!2sdo";

const MAPS_NAV =
  "https://www.google.com/maps/dir/?api=1&destination=18.469990300133684,-69.88640158707528&travelmode=driving";

export function Location() {
  const locale = useLocale();
  const isEN = locale === "en";
  // Map facade: render a static placeholder until the user clicks. Saves
  // ~500 KB of Google Maps JS on initial load and improves Lighthouse +
  // Time to First Interaction. The iframe lazy-loads only when needed.
  const [mapLoaded, setMapLoaded] = useState(false);
  return (
    <section id="ubicacion" className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
              {isEN ? "Location" : "Ubicación"}
            </p>
            <h2 className="font-serif text-2xl md:text-[30px] tracking-tight">
              {isEN ? <>In the heart of <em className="italic">history</em></> : <>En el corazón de la <em className="italic">historia</em></>}
            </h2>
            <p className="text-sm text-warm-muted font-light mt-3 max-w-md mx-auto">
              {isEN
                ? "Callejón Regina, Zona Colonial — steps away from the most important monuments of Santo Domingo"
                : "Callejón Regina, Zona Colonial — a pasos de los monumentos más importantes de Santo Domingo"}
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border border-warm-border h-[400px] relative">
                {mapLoaded ? (
                  <iframe
                    src={MAPS_EMBED}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={isEN ? "Casa La Maria location on Google Maps" : "Ubicación de Casa La Maria en Google Maps"}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setMapLoaded(true)}
                    aria-label={isEN ? "Load interactive Google Maps" : "Cargar mapa interactivo de Google Maps"}
                    className="group absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-emerald-100 via-stone-100 to-amber-50 dark:from-emerald-950/40 dark:via-stone-900 dark:to-amber-950/40 hover:opacity-90 transition cursor-pointer"
                  >
                    {/* Schematic street-pattern background — pure SVG, no
                        external request, gives a hint-of-map feel */}
                    <svg
                      className="absolute inset-0 w-full h-full opacity-30 dark:opacity-20"
                      xmlns="http://www.w3.org/2000/svg"
                      preserveAspectRatio="xMidYMid slice"
                      viewBox="0 0 400 400"
                      aria-hidden
                    >
                      <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      <path d="M0,180 Q150,200 220,160 T400,140" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
                      <path d="M120,0 L130,400" stroke="currentColor" strokeWidth="2.5" fill="none" opacity="0.45" />
                      <path d="M260,0 L255,400" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.35" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center px-6">
                      <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <p className="font-serif text-lg text-foreground">
                        Casa La Maria
                      </p>
                      <p className="text-xs text-muted-foreground max-w-xs">
                        {isEN
                          ? "Callejón Regina, Zona Colonial · click to load interactive map"
                          : "Callejón Regina, Zona Colonial · clic para cargar el mapa interactivo"}
                      </p>
                    </div>
                  </button>
                )}
              </div>
              <a
                href={MAPS_NAV}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 px-6 rounded-xl transition-colors text-sm"
              >
                <Navigation className="w-4 h-4" />
                {isEN ? "Navigate me with Google Maps" : "Navegar con Google Maps"}
              </a>
            </div>
            <div className="space-y-3">
              <h3 className="font-serif text-lg mb-4">{isEN ? "Nearby" : "Cerca de ti"}</h3>
              {NEARBY_PLACES.map((place) => {
                const IconComp = PLACE_ICONS[place.icon];
                return (
                  <div key={place.name} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-warm-border">
                    {IconComp && <IconComp className="w-4 h-4 text-primary flex-shrink-0" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{place.name}</p>
                    </div>
                    <span className="text-xs text-secondary">{place.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
