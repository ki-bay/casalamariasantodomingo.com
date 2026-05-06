import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Toaster } from "@/components/ui/sonner";
import { SchemaMarkup } from "@/components/SchemaMarkup";
import { ThemeProvider } from "@/components/ThemeProvider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  const isEN = locale === "en";
  const SITE = "https://casalamariazonacolonial.com";
  const HERO_IMAGE =
    "https://res.cloudinary.com/dspogotur/image/upload/v1776606232/casa_la_maria_santo_domingo_zona_colonial_eqyd8j.webp";
  const title = t("home_title");
  const description = t("home_desc");
  const canonical = isEN ? `${SITE}/en` : `${SITE}/es`;
  return {
    metadataBase: new URL(SITE),
    title,
    description,
    alternates: {
      canonical,
      languages: {
        es: `${SITE}/es`,
        en: `${SITE}/en`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: "Casa La Maria",
      locale: isEN ? "en_US" : "es_DO",
      alternateLocale: isEN ? "es_DO" : "en_US",
      images: [{ url: HERO_IMAGE, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [HERO_IMAGE],
    },
    robots: { index: true, follow: true },
    icons: { icon: "/icon.svg" },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "es" | "en")) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider defaultTheme="dark" storageKey="casalamaria-theme">
        <SchemaMarkup locale={locale} />
        <div className="paper-texture" />
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

