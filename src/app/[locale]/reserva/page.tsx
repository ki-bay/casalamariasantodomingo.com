import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ReservaClient } from "./ReservaClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/reserva",
    pathEn: "/book",
    titleEs: "Reservar · Casa La Maria — Zona Colonial Santo Domingo",
    titleEn: "Book · Casa La Maria — Colonial Zone Santo Domingo",
    descEs:
      "Reserva directa de apartamentos boutique en la Zona Colonial. Selecciona fechas, huéspedes (1–4) y paga con tarjeta — sin comisiones de plataforma.",
    descEn:
      "Direct booking for boutique apartments in the Colonial Zone. Pick your dates, guest count (1–4), and pay by card — no platform fees.",
    // Booking flow shouldn't be indexed — it's a conversion endpoint, not
    // canonical content. Apartment detail pages are the indexable URLs.
    noindex: true,
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ReservaClient />;
}
