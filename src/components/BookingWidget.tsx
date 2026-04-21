"use client";

import {
  Wifi,
  Snowflake,
  CookingPot,
  Tv,
  Coffee,
  Shirt,
  Lock,
  Sun,
  Waves,
  Car,
  Bed,
  Wind,
  Utensils,

  ShieldCheck,
  Clock,
  Ban,
  CigaretteOff,
  Dog,
  VolumeX,
  CalendarX,
  CreditCard,
  Shield,
  FileText,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PROPERTY, AMENITIES, AMENITIES_EN, HOUSE_RULES, HOUSE_RULES_EN, POLICIES, POLICIES_EN } from "@/lib/data";
import { useLocale } from "next-intl";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  wifi: Wifi,
  snowflake: Snowflake,
  "cooking-pot": CookingPot,
  tv: Tv,
  coffee: Coffee,
  shirt: Shirt,
  lock: Lock,
  sun: Sun,
  waves: Waves,
  car: Car,
  bed: Bed,
  wind: Wind,
  utensils: Utensils,
  iron: Shirt,
  "shield-check": ShieldCheck,
  clock: Clock,
  ban: Ban,
  "cigarette-off": CigaretteOff,
  dog: Dog,
  "volume-x": VolumeX,
  "calendar-x": CalendarX,
  "credit-card": CreditCard,
  shield: Shield,
  "file-text": FileText,
};

export function BookingWidget() {
  const locale = useLocale();
  const isEN = locale === "en";
  const amenities = isEN ? AMENITIES_EN : AMENITIES;
  const houseRules = isEN ? HOUSE_RULES_EN : HOUSE_RULES;
  const policies = isEN ? POLICIES_EN : POLICIES;

  return (
    <section id="propiedad" className="px-6 md:px-12 py-16 md:py-32">
      <div className="max-w-[900px] mx-auto space-y-16">
        {/* About the property */}
        <ScrollReveal>
          <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-4">
            {isEN ? "About the Property" : "Sobre la Propiedad"}
          </p>
          <h2 className="font-serif text-3xl md:text-[42px] tracking-tight mb-8 leading-tight">
            {isEN ? <>A piece of history <em className="italic">with a modern soul</em></> : <>Un rincón de historia <em className="italic">con alma moderna</em></>}
          </h2>
          <div className="space-y-5 text-warm-muted text-base leading-relaxed font-light max-w-[720px]">
            <p>{isEN
              ? "Casa La Maria is a boutique apartment located in a restored 16th-century building on the iconic Calle Las Damas, the oldest street in the Americas. Our space blends the authenticity of coral stone walls with a contemporary interior design of clean lines."
              : PROPERTY.description}</p>
            <p>
              {isEN
                ? `The ${PROPERTY.size}m² apartment is designed for couples or solo travelers seeking an intimate cultural experience in the heart of the Colonial District, a UNESCO World Heritage Site. Every detail has been carefully chosen: from Egyptian cotton bedding to works by local Dominican artists.`
                : `El apartamento de ${PROPERTY.size}m² está diseñado para parejas o viajeros solos que buscan una experiencia íntima y cultural en el corazón del Distrito Colonial, declarado Patrimonio de la Humanidad por la UNESCO. Cada detalle ha sido cuidadosamente seleccionado: desde la ropa de cama de algodón egipcio hasta las obras de arte de artistas dominicanos locales.`}
            </p>
            <p>
              {isEN
                ? "From your door, you walk directly to the Alcazar de Colón, the Cathedral Primate of America, the National Pantheon, and dozens of restaurants, cafés, and art galleries. Playa Güibia beach is just a 25-minute walk."
                : "Desde tu puerta, caminas directamente al Alcázar de Colón, la Catedral Primada de América, el Panteón Nacional y decenas de restaurantes, cafés y galerías de arte. La Playa Güibia está a solo 25 minutos a pie."}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <Tabs defaultValue="amenities">
              <TabsList className="flex gap-2 mb-6 bg-transparent h-auto p-0">
                <TabsTrigger
                  value="amenities"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5 py-2.5 text-[13px] font-medium rounded-md border border-transparent data-[state=inactive]:border-warm-border data-[state=inactive]:text-secondary data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:border-primary"
                >
                  {isEN ? "Amenities" : "Servicios"}
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5 py-2.5 text-[13px] font-medium rounded-md border border-transparent data-[state=inactive]:border-warm-border data-[state=inactive]:text-secondary data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:border-primary"
                >
                  {isEN ? "Rules" : "Normas"}
                </TabsTrigger>
                <TabsTrigger
                  value="policies"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-5 py-2.5 text-[13px] font-medium rounded-md border border-transparent data-[state=inactive]:border-warm-border data-[state=inactive]:text-secondary data-[state=inactive]:hover:text-primary data-[state=inactive]:hover:border-primary"
                >
                  {isEN ? "Policies" : "Políticas"}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="amenities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => {
                    const IconComp = ICON_MAP[amenity.icon];
                    return (
                      <div
                        key={amenity.name}
                        className="bg-card border border-warm-border rounded-xl p-5 flex items-center gap-3.5 transition-all hover:border-primary hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
                      >
                        {IconComp && (
                          <IconComp className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                        <span className="text-sm">{amenity.name}</span>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="rules">
                <div className="space-y-4">
                  {houseRules.map((rule) => {
                    const IconComp = ICON_MAP[rule.icon];
                    return (
                      <div
                        key={rule.title}
                        className="flex items-start gap-3 p-4 bg-card border border-warm-border rounded-lg"
                      >
                        {IconComp && (
                          <IconComp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{rule.title}</p>
                          <p className="text-xs text-secondary mt-1">
                            {rule.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="policies">
                <div className="space-y-4">
                  {policies.map((policy) => {
                    const IconComp = ICON_MAP[policy.icon];
                    return (
                      <div
                        key={policy.title}
                        className="flex items-start gap-3 p-4 bg-card border border-warm-border rounded-lg"
                      >
                        {IconComp && (
                          <IconComp className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{policy.title}</p>
                          <p className="text-xs text-secondary mt-1">
                            {policy.subtitle}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          </ScrollReveal>
      </div>
    </section>
  );
}
