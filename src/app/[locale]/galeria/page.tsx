import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { GaleriaClient } from "./GaleriaClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/galeria",
    pathEn: "/gallery",
    titleEs: "Galería · Casa La Maria — Zona Colonial Santo Domingo",
    titleEn: "Gallery · Casa La Maria — Colonial Zone Santo Domingo",
    descEs:
      "Fotos de los apartamentos boutique de Casa La Maria en el Callejón Regina, Zona Colonial. Interiores, balcones, cocinas y vistas al Distrito Colonial.",
    descEn:
      "Photos of the Casa La Maria boutique apartments on Callejón Regina, Colonial Zone. Interiors, balconies, kitchens and views over the Colonial District.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <GaleriaClient />;
}
