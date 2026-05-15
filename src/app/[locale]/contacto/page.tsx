import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";
import { ContactoClient } from "./ContactoClient";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/contacto",
    pathEn: "/contact",
    titleEs: "Contacto · Casa La Maria — Zona Colonial Santo Domingo",
    titleEn: "Contact · Casa La Maria — Colonial Zone Santo Domingo",
    descEs:
      "Contáctanos por email, teléfono o WhatsApp. Respondemos en menos de 12 horas. Casa La Maria, Parmenio Troncoso 4, Zona Colonial — +1 (829) 406-7269.",
    descEn:
      "Reach us by email, phone or WhatsApp. We reply within 12 hours. Casa La Maria, Parmenio Troncoso 4, Colonial Zone — +1 (829) 406-7269.",
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactoClient />;
}
