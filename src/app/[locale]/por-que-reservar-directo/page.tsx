import type { Metadata } from "next";
import Link from "next/link";
import { setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, X, MessageCircle, Shield, ClipboardCheck, Sparkles, Lock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/por-que-reservar-directo",
    pathEn: "/why-book-direct",
    titleEs: "Reserva directa vs Airbnb / Booking — Casa La Maria Zona Colonial",
    titleEn: "Book Direct vs Airbnb / Booking — Casa La Maria Colonial Zone",
    descEs:
      "Reservando directo en casalamariazonacolonial.com ahorras hasta $42 USD por noche, hablas por WhatsApp con tu anfitrión y obtienes el mismo apartamento — sin comisiones de plataforma.",
    descEn:
      "Book direct on casalamariazonacolonial.com — save up to $42 USD/night, WhatsApp your host directly, same apartment, zero platform fees.",
  });
}

export default async function PorQueReservarDirectoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";

  const reasons = isEN
    ? [
        {
          icon: <Sparkles className="w-5 h-5" />,
          title: "Zero platform fees — visibly cheaper",
          body: "OTAs charge a 14–18% service fee on top of the room rate. We don't. The price you see is the price you pay.",
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          title: "Direct WhatsApp with your host",
          body: "No intermediaries. Joab answers within minutes — early check-in, restaurant tips, late-night arrivals, anything.",
        },
        {
          icon: <ClipboardCheck className="w-5 h-5" />,
          title: "Best price guaranteed",
          body: "Find the same dates lower on Airbnb or Booking? We match it and add 5% off. Just send us the screenshot.",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Same flexibility — better terms",
          body: "Free cancellation up to 7 days before check-in (the standard Airbnb policy). After that, we negotiate; an algorithm doesn't.",
        },
        {
          icon: <Lock className="w-5 h-5" />,
          title: "Secure payments via Stripe",
          body: "Your card never touches our servers. Stripe handles the charge directly — same security used by Airbnb itself.",
        },
      ]
    : [
        {
          icon: <Sparkles className="w-5 h-5" />,
          title: "Cero comisiones de plataforma",
          body: "Las OTAs cobran un 14–18% de tarifa de servicio sobre la tarifa de la habitación. Nosotros no. El precio que ves es el precio que pagas.",
        },
        {
          icon: <MessageCircle className="w-5 h-5" />,
          title: "WhatsApp directo con tu anfitrión",
          body: "Sin intermediarios. Joab responde en minutos — early check-in, recomendaciones de restaurantes, llegadas tarde, lo que necesites.",
        },
        {
          icon: <ClipboardCheck className="w-5 h-5" />,
          title: "Mejor precio garantizado",
          body: "¿Encuentras las mismas fechas más baratas en Airbnb o Booking? Igualamos y descontamos 5% adicional. Envíanos el screenshot.",
        },
        {
          icon: <Shield className="w-5 h-5" />,
          title: "Misma flexibilidad — mejor trato",
          body: "Cancelación gratuita hasta 7 días antes del check-in (la política estándar de Airbnb). Después negociamos directamente; no un algoritmo.",
        },
        {
          icon: <Lock className="w-5 h-5" />,
          title: "Pagos seguros vía Stripe",
          body: "Tu tarjeta nunca pasa por nuestros servidores. Stripe procesa el cargo directamente — la misma seguridad que usa Airbnb.",
        },
      ];

  return (
    <main className="min-h-screen bg-background text-foreground relative z-10">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-12 px-6 md:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 block">
            {isEN ? "The smarter way to book" : "La manera inteligente de reservar"}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground tracking-tight mb-6">
            {isEN ? (
              <>
                Save <em className="italic">$42 USD</em> per night by booking direct
              </>
            ) : (
              <>
                Ahorra <em className="italic">$42 USD</em> por noche reservando directo
              </>
            )}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
            {isEN
              ? "Same apartment. Same flexibility. Better price. Direct WhatsApp with your host. No platform fees, ever."
              : "El mismo apartamento. La misma flexibilidad. Mejor precio. WhatsApp directo con tu anfitrión. Sin comisiones, nunca."}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={isEN ? "/en/apartments" : "/es/apartamentos"}>
              {isEN ? "See apartments + tonight's price" : "Ver apartamentos + precio de hoy"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Fee comparison table */}
      <section className="px-6 md:px-12 mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
              {isEN ? "What you actually pay" : "Lo que realmente pagas"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEN
                ? "Sample: 3 nights in the OneBedRoom 1A unit, 2 guests"
                : "Ejemplo: 3 noches en la Unidad 1A (OneBedRoom), 2 huéspedes"}
            </p>
          </div>

          <div className="rounded-2xl border border-border overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-4 md:px-6 font-medium text-muted-foreground">
                    {isEN ? "Cost item" : "Concepto"}
                  </th>
                  <th className="text-right py-4 px-4 md:px-6 font-semibold text-accent">
                    {isEN ? "Direct" : "Directo"}
                  </th>
                  <th className="text-right py-4 px-4 md:px-6 font-medium text-muted-foreground">
                    Airbnb
                  </th>
                  <th className="text-right py-4 px-4 md:px-6 font-medium text-muted-foreground">
                    Booking.com
                  </th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                <tr className="border-b border-border">
                  <td className="py-3.5 px-4 md:px-6">{isEN ? "Nightly rate × 3" : "Tarifa por noche × 3"}</td>
                  <td className="text-right py-3.5 px-4 md:px-6 font-medium">$297</td>
                  <td className="text-right py-3.5 px-4 md:px-6 font-medium">$297</td>
                  <td className="text-right py-3.5 px-4 md:px-6 font-medium">$297</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3.5 px-4 md:px-6">{isEN ? "Service / platform fee" : "Comisión de plataforma"}</td>
                  <td className="text-right py-3.5 px-4 md:px-6 font-medium text-accent">$0</td>
                  <td className="text-right py-3.5 px-4 md:px-6 text-muted-foreground">~$45</td>
                  <td className="text-right py-3.5 px-4 md:px-6 text-muted-foreground">~$48</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="py-3.5 px-4 md:px-6">{isEN ? "Cleaning fee" : "Tarifa de limpieza"}</td>
                  <td className="text-right py-3.5 px-4 md:px-6 font-medium text-accent">$0</td>
                  <td className="text-right py-3.5 px-4 md:px-6 text-muted-foreground">$45</td>
                  <td className="text-right py-3.5 px-4 md:px-6 text-muted-foreground">$45</td>
                </tr>
                <tr className="bg-accent/5">
                  <td className="py-4 px-4 md:px-6 font-semibold">Total</td>
                  <td className="text-right py-4 px-4 md:px-6 font-serif text-xl text-accent font-bold">$297</td>
                  <td className="text-right py-4 px-4 md:px-6 font-medium text-muted-foreground">$387</td>
                  <td className="text-right py-4 px-4 md:px-6 font-medium text-muted-foreground">$390</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 md:px-6 text-xs text-muted-foreground" colSpan={4}>
                    {isEN
                      ? "Booking direct saves $90+ on a 3-night stay. The savings scale with stay length."
                      : "Reservar directo ahorra $90+ en una estancia de 3 noches. El ahorro escala con la duración."}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-xs text-muted-foreground/80 italic text-center mt-3">
            {isEN
              ? "Estimated OTA fees based on public Airbnb / Booking.com pricing for the same dates. Actual amounts vary."
              : "Comisiones de OTAs estimadas según precios públicos de Airbnb / Booking.com para las mismas fechas. Las cantidades reales pueden variar."}
          </p>
        </div>
      </section>

      {/* 5 reasons */}
      <section className="px-6 md:px-12 mb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-10">
            {isEN ? "5 reasons to skip the OTAs" : "5 razones para saltarte las OTAs"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reasons.map((r, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-accent shrink-0">{r.icon}</span>
                  <h3 className="font-serif text-lg text-foreground">{r.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk reversal */}
      <section className="px-6 md:px-12 mb-20">
        <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-muted/30 p-8 md:p-10">
          <h2 className="font-serif text-2xl text-foreground mb-5">
            {isEN ? "Same protections you'd get on Airbnb" : "Las mismas protecciones que en Airbnb"}
          </h2>
          <ul className="space-y-3 text-sm">
            {(isEN
              ? [
                  "Free cancellation up to 7 days before check-in",
                  "Stripe-secured payments — chargebacks supported",
                  "Real address, real building, real on-site host (Joab)",
                  "Same-day refund processed via Stripe if a booking falls through",
                  "Photos on this site are the actual apartments — no surprises",
                ]
              : [
                  "Cancelación gratuita hasta 7 días antes del check-in",
                  "Pagos seguros vía Stripe — soporte para contracargos",
                  "Dirección real, edificio real, anfitrión real en sitio (Joab)",
                  "Reembolso el mismo día procesado vía Stripe si la reserva falla",
                  "Las fotos en este sitio son los apartamentos reales — sin sorpresas",
                ]).map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 md:px-12 mb-24">
        <div className="max-w-2xl mx-auto text-center rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/20 p-10">
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-4">
            {isEN ? "Check tonight's price — no fees" : "Consulta el precio de hoy — sin comisiones"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            {isEN
              ? "Pick your dates, see the real total in seconds. Book in 2 minutes — no account needed."
              : "Elige tus fechas, ve el total real en segundos. Reserva en 2 minutos — sin cuenta."}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href={isEN ? "/en/apartments" : "/es/apartamentos"}>
              {isEN ? "See apartments" : "Ver apartamentos"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />

      {/* Page-specific JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": isEN
                  ? "https://casalamariazonacolonial.com/en/why-book-direct"
                  : "https://casalamariazonacolonial.com/es/por-que-reservar-directo",
                name: isEN
                  ? "Book Direct vs Airbnb — Casa La Maria"
                  : "Reserva Directa vs Airbnb — Casa La Maria",
                description: isEN
                  ? "Book direct on casalamariazonacolonial.com — save up to $42 USD/night, WhatsApp your host directly, same apartment, zero platform fees."
                  : "Reservando directo en casalamariazonacolonial.com ahorras hasta $42 USD por noche, hablas por WhatsApp con tu anfitrión y obtienes el mismo apartamento — sin comisiones.",
                isPartOf: { "@id": "https://casalamariazonacolonial.com/#business" },
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: isEN ? "Home" : "Inicio",
                    item: isEN
                      ? "https://casalamariazonacolonial.com/en"
                      : "https://casalamariazonacolonial.com/es",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: isEN ? "Why book direct" : "Por qué reservar directo",
                    item: isEN
                      ? "https://casalamariazonacolonial.com/en/why-book-direct"
                      : "https://casalamariazonacolonial.com/es/por-que-reservar-directo",
                  },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
