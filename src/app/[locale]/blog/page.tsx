import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { BlogListClient } from "./BlogListClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/blog",
    pathEn: "/blog",
    titleEs: "Blog · Casa La Maria — Guías de la Zona Colonial Santo Domingo",
    titleEn: "Blog · Casa La Maria — Colonial Zone Santo Domingo Guides",
    descEs:
      "Guías de decisión y locales sobre la Zona Colonial: dónde quedarse, hoteles vs Airbnb, qué hacer cerca de Calle Las Damas y experiencias en Santo Domingo.",
    descEn:
      "Local and decision guides for the Colonial Zone: where to stay, hotels vs Airbnb, things to do near Calle Las Damas and Santo Domingo experiences.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <BlogListClient />;
}
