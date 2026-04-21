"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PROPERTY, AMENITIES, AMENITIES_EN, HOUSE_RULES, HOUSE_RULES_EN, POLICIES, POLICIES_EN, LONG_STAY_DISCOUNTS, BOOKED_DATES } from "@/lib/data";
import { StripeCheckout } from "@/components/StripeCheckout";
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
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [bookingResult, setBookingResult] = useState<{
    nights: number;
    nightsTotal: number;
    serviceFee: number;
    total: number;
    discount: number;
  } | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const calculatePrice = () => {
    if (!checkIn || !checkOut) return null;
    const ci = new Date(checkIn);
    const co = new Date(checkOut);
    const nights = Math.round(
      (co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (nights < PROPERTY.minStay) return null;

    // Check for conflicts
    let hasConflict = false;
    for (let d = new Date(ci); d < co; d.setDate(d.getDate() + 1)) {
      if (BOOKED_DATES.includes(d.toISOString().split("T")[0])) {
        hasConflict = true;
        break;
      }
    }
    if (hasConflict) return { hasConflict: true } as any;

    let discount = 0;
    if (nights >= 28) discount = 0.2;
    else if (nights >= 14) discount = 0.15;
    else if (nights >= 7) discount = 0.1;

    const discountedPrice = PROPERTY.pricePerNight * (1 - discount);
    const nightsTotal = discountedPrice * nights;
    const serviceFee = Math.round(nightsTotal * PROPERTY.serviceFeePercent * 100) / 100;
    const total = nightsTotal + PROPERTY.cleaningFee + serviceFee;

    return { nights, nightsTotal, serviceFee, total, discount };
  };

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    const result = calculatePrice();
    if (!checkIn || !checkOut) {
      return;
    }
    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (nights < PROPERTY.minStay) {
      return;
    }
    if (result && "hasConflict" in result) {
      return;
    }
    if (result) {
      setBookingResult(result);
      setShowBreakdown(true);
      setPaymentOpen(true);
    }
  };

  const result = calculatePrice();

  return (
    <section id="propiedad" className="px-6 md:px-12 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-10 md:gap-12">
        {/* Left Content */}
        <div className="md:col-span-2 space-y-12">
          <ScrollReveal>
            <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
              {isEN ? "About the Property" : "Sobre la Propiedad"}
            </p>
            <h2 className="font-serif text-2xl md:text-[30px] tracking-tight mb-6">
              {isEN ? <>A piece of history <em className="italic">with a modern soul</em></> : <>Un rincón de historia <em className="italic">con alma moderna</em></>}
            </h2>
            <div className="space-y-4 text-warm-muted text-sm leading-relaxed font-light">
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
                  ? "From your door, you walk directly to the Alcazar de Colón, the Cathedral Primate of America, the National Pantheon, and dozens of restaurants, cafés, and art galleries. Playa Güibia beach is just a 10-minute walk."
                  : "Desde tu puerta, caminas directamente al Alcázar de Colón, la Catedral Primada de América, el Panteón Nacional y decenas de restaurantes, cafés y galerías de arte. La Playa Güibia está a solo 10 minutos a pie."}
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

        {/* Right: Booking Widget */}
        <div id="reserva" className="md:col-span-1">
          <div className="md:sticky md:top-[100px]">
            <div className="bg-card rounded-2xl border border-warm-border p-6 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.03)]">
              <div className="flex items-baseline justify-between mb-5">
                <div>
                  <span className="text-2xl font-semibold">
                    ${PROPERTY.pricePerNight}
                  </span>
                  <span className="text-sm text-secondary"> / {isEN ? "night" : "noche"}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 fill-amber-star text-amber-star" />
                  <span className="font-medium">{PROPERTY.rating}</span>
                  <span className="text-secondary">
                    ({PROPERTY.reviewCount})
                  </span>
                </div>
              </div>

              <form onSubmit={handleCheckAvailability} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium text-secondary mb-1">
                      Check-in
                    </Label>
                    <Input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => {
                        setCheckIn(e.target.value);
                        setShowBreakdown(false);
                      }}
                      className="bg-card border-warm-border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-secondary mb-1">
                      Check-out
                    </Label>
                    <Input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => {
                        setCheckOut(e.target.value);
                        setShowBreakdown(false);
                      }}
                      className="bg-card border-warm-border rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs font-medium text-secondary mb-1">
                    {isEN ? "Guests" : "Huéspedes"}
                  </Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="bg-card border-warm-border rounded-lg text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{isEN ? "1 guest" : "1 huésped"}</SelectItem>
                      <SelectItem value="2">{isEN ? "2 guests" : "2 huéspedes"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {showBreakdown && result && !("hasConflict" in result) && (
                  <div className="border-t border-warm-border pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">
                        ${PROPERTY.pricePerNight} × {result.nights} {isEN ? "nights" : "noches"}
                        {result.discount > 0 &&
                          ` (${Math.round(result.discount * 100)}% ${isEN ? "disc." : "desc."})`}
                      </span>
                      <span className="font-medium">
                        ${result.nightsTotal.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">
                        {isEN ? "Cleaning fee" : "Tarifa de limpieza"}
                      </span>
                      <span className="font-medium">
                        ${PROPERTY.cleaningFee}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">
                        {isEN ? "Service fee (8%)" : "Tarifa de servicio (8%)"}
                      </span>
                      <span className="font-medium">
                        ${result.serviceFee.toFixed(0)}
                      </span>
                    </div>
                    <div className="gradient-divider my-2" />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>${result.total.toFixed(0)}</span>
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg py-3.5 font-medium text-sm"
                >
                  {isEN ? "Check Availability" : "Ver Disponibilidad"}
                </Button>
              </form>

              <p className="text-center text-xs text-secondary mt-3">
                {isEN ? "You won't be charged yet" : "No se te cobrará nada aún"}
              </p>
            </div>

            {/* Long stay discount */}
            <div className="mt-4 bg-surface rounded-xl border border-warm-border p-4 space-y-2">
              <p className="text-xs font-medium text-secondary mb-2">
                {isEN ? "Long-stay discounts" : "Descuentos por estancia"}
              </p>
              {LONG_STAY_DISCOUNTS.map((d) => (
                <div
                  key={d.minNights}
                  className="flex justify-between text-sm"
                >
                  <span>{d.minNights}+ {isEN ? "nights" : "noches"}</span>
                  <span className="font-medium text-green-accent">
                    {d.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {bookingResult && (
        <StripeCheckout
          open={paymentOpen}
          onOpenChange={setPaymentOpen}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
          booking={bookingResult}
          locale={locale}
        />
      )}
    </section>
  );
}

function Star({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
