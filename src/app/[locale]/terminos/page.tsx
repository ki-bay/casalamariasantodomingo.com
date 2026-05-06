import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { TerminosClient } from "./TerminosClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/terminos",
    pathEn: "/terms",
    titleEs: "Términos y Condiciones · Casa La Maria",
    titleEn: "Terms & Conditions · Casa La Maria",
    descEs:
      "Términos y condiciones de reserva, cancelación, pago y políticas de la casa para Casa La Maria, Zona Colonial Santo Domingo.",
    descEn:
      "Booking, cancellation, payment and house policy terms for Casa La Maria, Colonial Zone Santo Domingo.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TerminosClient />;
}
