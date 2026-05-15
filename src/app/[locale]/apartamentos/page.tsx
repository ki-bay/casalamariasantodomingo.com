import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ApartmentCard } from "@/components/ApartmentCard";
import { supabase } from "@/lib/supabase";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "seo" });
  return buildMetadata({
    locale: locale === "en" ? "en" : "es",
    pathEs: "/apartamentos",
    pathEn: "/apartments",
    titleEs: t("apartments_title"),
    titleEn: t("apartments_title"),
    descEs: t("apartments_desc"),
    descEn: t("apartments_desc"),
  });
}

async function getApartments() {
  const { data } = await supabase
    .from('apartments')
    .select('*')
    .eq('available', true)
    .order('sort_order');
  return data || [];
}

export default async function ApartamentosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "apartments" });
  const apartments = await getApartments();
  const isEN = locale === 'en';

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero section */}
      <section className="pt-36 pb-16 px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-4 block">
            Parmenio Troncoso 4 · Zona Colonial
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Apartments grid */}
      <section className="pb-20 px-6 md:px-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt) => (
              <ApartmentCard key={apt.id} apartment={apt} locale={locale} />
            ))}
          </div>

          {apartments.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">{isEN ? "No apartments available at this time." : "No hay apartamentos disponibles en este momento."}</p>
            </div>
          )}
        </div>
      </section>

      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ApartmentComplex",
            "name": "Casa La Maria",
            "description": isEN
              ? "Five boutique apartments on Parmenio Troncoso 4, Colonial Zone, Santo Domingo"
              : "Cinco apartamentos boutique en Parmenio Troncoso 4, Zona Colonial, Santo Domingo",
            "url": "https://casalamariazonacolonial.com",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Parmenio Troncoso 4",
              "addressLocality": "Santo Domingo",
              "addressRegion": "Distrito Nacional",
              "postalCode": "10210",
              "addressCountry": "DO"
            },
            "geo": { "@type": "GeoCoordinates", "latitude": 18.4696, "longitude": -69.8869 },
            "numberOfRooms": apartments.length,
            "amenityFeature": [
              { "@type": "LocationFeatureSpecification", "name": "WiFi", "value": true },
              { "@type": "LocationFeatureSpecification", "name": "Air conditioning", "value": true },
              { "@type": "LocationFeatureSpecification", "name": "Kitchen", "value": true },
            ]
          })
        }}
      />

      <Footer />
    </main>
  );
}
