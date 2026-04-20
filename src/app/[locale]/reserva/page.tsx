"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { PROPERTY, LONG_STAY_DISCOUNTS } from "@/lib/data";
import { StripeCheckout } from "@/components/StripeCheckout";
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
import { CalendarDays, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";

export default function ReservaPage() {
  const locale = useLocale();
  const isEN = locale === "en";

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
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
    const nights = Math.round(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (nights < 1) return null;

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

  const result = calculatePrice();

  const handleNext = () => {
    if (step === 1) {
      if (!checkIn || !checkOut) {
        toast.error(isEN ? "Please select check-in and check-out dates" : "Selecciona las fechas de check-in y check-out");
        return;
      }
      const nights = Math.round(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (nights < 1) {
        toast.error(isEN ? "Check-out must be after check-in" : "La fecha de check-out debe ser posterior al check-in");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (result) {
        setBookingResult(result);
        setPaymentOpen(true);
      }
    }
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-28 pb-16 px-6 md:px-12 flex-1">
        <div className="max-w-[800px] mx-auto">
          <ScrollReveal>
            <div className="text-center mb-10">
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Book" : "Reserva"}
              </p>
              <h1 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">
                {isEN ? <>Book your <em className="italic">stay</em></> : <>Reserva tu <em className="italic">estancia</em></>}
              </h1>
            </div>
          </ScrollReveal>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            {[
              { num: 1, label: isEN ? "Dates" : "Fechas" },
              { num: 2, label: isEN ? "Details" : "Detalles" },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s.num ? "bg-primary text-white" : "bg-warm-border text-secondary"
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span className={`text-sm font-medium ${step >= s.num ? "text-primary" : "text-secondary"}`}>
                  {s.label}
                </span>
                {s.num < 2 && <div className="w-12 h-px bg-warm-border mx-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Dates */}
          {step === 1 && (
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-warm-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-xl">{isEN ? "Select your dates" : "Selecciona tus fechas"}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-xs font-medium text-secondary mb-1.5">Check-in</Label>
                    <Input
                      type="date"
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="bg-white border-warm-border rounded-lg"
                    />
                    <p className="text-xs text-secondary mt-1">3:00 PM</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-secondary mb-1.5">Check-out</Label>
                    <Input
                      type="date"
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="bg-white border-warm-border rounded-lg"
                    />
                    <p className="text-xs text-secondary mt-1">11:00 AM</p>
                  </div>
                </div>

                <div className="mb-6">
                  <Label className="text-xs font-medium text-secondary mb-1.5">
                    {isEN ? "Guests" : "Huéspedes"}
                  </Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="bg-white border-warm-border rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{isEN ? "1 guest" : "1 huésped"}</SelectItem>
                      <SelectItem value="2">{isEN ? "2 guests" : "2 huéspedes"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {result && (
                  <div className="bg-surface rounded-xl p-5 space-y-2 border border-warm-border mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">
                        ${PROPERTY.pricePerNight} × {result.nights} {isEN ? result.nights === 1 ? "night" : "nights" : result.nights === 1 ? "noche" : "noches"}
                        {result.discount > 0 && ` (${Math.round(result.discount * 100)}% ${isEN ? "disc." : "desc."})`}
                      </span>
                      <span className="font-medium">${result.nightsTotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">{isEN ? "Cleaning fee" : "Tarifa de limpieza"}</span>
                      <span className="font-medium">${PROPERTY.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">{isEN ? "Service fee (8%)" : "Tarifa de servicio (8%)"}</span>
                      <span className="font-medium">${result.serviceFee.toFixed(0)}</span>
                    </div>
                    <div className="gradient-divider my-2" />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>${result.total.toFixed(0)}</span>
                    </div>
                  </div>
                )}

                <div className="bg-surface rounded-xl border border-warm-border p-4 space-y-2 mb-6">
                  <p className="text-xs font-medium text-secondary mb-2">
                    {isEN ? "Long-stay discounts" : "Descuentos por estancia"}
                  </p>
                  {LONG_STAY_DISCOUNTS.map((d) => (
                    <div key={d.minNights} className="flex justify-between text-sm">
                      <span>{d.minNights}+ {isEN ? "nights" : "noches"}</span>
                      <span className="font-medium text-green-accent">{d.label}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg py-3.5 font-medium"
                >
                  {isEN ? "Continue" : "Continuar"}
                </Button>
              </div>
            </ScrollReveal>
          )}

          {/* Step 2: Details & Payment */}
          {step === 2 && (
            <ScrollReveal>
              <div className="bg-white rounded-2xl border border-warm-border p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="font-serif text-xl">
                    {isEN ? "Complete your booking" : "Completa tu reserva"}
                  </h2>
                </div>

                {result && (
                  <div className="bg-surface rounded-xl p-5 space-y-2 border border-warm-border mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">
                        ${PROPERTY.pricePerNight} × {result.nights} {isEN ? result.nights === 1 ? "night" : "nights" : result.nights === 1 ? "noche" : "noches"}
                      </span>
                      <span className="font-medium">${result.nightsTotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">{isEN ? "Cleaning" : "Limpieza"}</span>
                      <span className="font-medium">${PROPERTY.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-warm-muted">{isEN ? "Service (8%)" : "Servicio (8%)"}</span>
                      <span className="font-medium">${result.serviceFee.toFixed(0)}</span>
                    </div>
                    <div className="gradient-divider my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${result.total.toFixed(0)}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setStep(1)} className="border-warm-border">
                    {isEN ? "Back" : "Atrás"}
                  </Button>
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-lg py-3.5 font-medium"
                  >
                    {isEN ? "Proceed to Payment" : "Proceder al Pago"}
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      </div>
      <Footer />

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
    </main>
  );
}

