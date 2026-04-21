"use client";

import { Navigation, Landmark, Church, Building, TreePalm, Plane, ShoppingBag, Wine } from "lucide-react";
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
                ? "Parmenio Troncoso 4, Zona Colonial — steps away from the most important monuments of Santo Domingo"
                : "Parmenio Troncoso 4, Zona Colonial — a pasos de los monumentos más importantes de Santo Domingo"}
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 flex flex-col gap-3">
              <div className="rounded-xl overflow-hidden border border-warm-border h-[400px]">
                <iframe
                  src={MAPS_EMBED}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Casa La Maria en Google Maps"
                />
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
