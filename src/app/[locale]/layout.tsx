import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
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
  const isEn = locale === "en";
  return {
    title: t("home_title"),
    description: t("home_desc"),
    alternates: {
      canonical: isEn ? "https://casalamariazonacolonial.com/en" : "https://casalamariazonacolonial.com/",
      languages: {
        "es": "https://casalamariazonacolonial.com/",
        "en": "https://casalamariazonacolonial.com/en",
      }
    }
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
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider defaultTheme="dark" storageKey="casalamaria-theme">
        <SchemaMarkup />
        <div className="paper-texture" />
        {children}
        <Toaster position="bottom-right" />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

