"use client";

import {
  Landmark,
  Church,
  Building,
  TreePalm,
  Plane,
  ShoppingBag,
  Wine,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { NEARBY_PLACES } from "@/lib/data";
import { useLocale } from "next-intl";

const PLACE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  landmark: Landmark,
  church: Church,
  building: Building,
  "palm-tree": TreePalm,
  plane: Plane,
  "shopping-bag": ShoppingBag,
  wine: Wine,
};

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
                ? "Calle Las Damas, Zona Colonial — steps away from the most important monuments of Santo Domingo"
                : "Calle Las Damas, Zona Colonial — a pasos de los monumentos más importantes de Santo Domingo"}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="rounded-xl overflow-hidden border border-warm-border h-[400px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.5!2d-69.8819!3d18.4725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89fe4861c0d7%3A0x47c1f2c4c4c3e3e0!2sCalle%20Las%20Damas%2C%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Casa La Maria en Google Maps"
                />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-serif text-lg mb-4">{isEN ? "Nearby" : "Cerca de ti"}</h3>
              {NEARBY_PLACES.map((place) => {
                const IconComp = PLACE_ICONS[place.icon];
                return (
                  <div
                    key={place.name}
                    className="flex items-center gap-3 p-3 bg-card rounded-lg border border-warm-border"
                  >
                    {IconComp && (
                      <IconComp className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
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
