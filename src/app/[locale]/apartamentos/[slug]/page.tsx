import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BedDouble, Bath, Users, Ruler, Wifi, Wind, Tv, UtensilsCrossed, Coffee, Sun, Building2, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { ApartmentPriceBlock } from "@/components/ApartmentPriceBlock";

type Apartment = {
  id: string; slug: string; name_es: string; name_en: string;
  description_es: string; description_en: string;
  bedrooms: number; bathrooms: number; bath_type_es: string; bath_type_en: string;
  size_m2: number; max_guests: number;
  bed_config_es: string; bed_config_en: string;
  has_balcony: boolean; has_terrace: boolean;
  price_standard_dop: number; price_flexible_dop: number;
  amenities: string[]; images: { url: string; alt_es: string; alt_en: string }[];
  lodgify_property_id: string;
};

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-4 h-4" />,
  ac: <Wind className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
  kitchen: <UtensilsCrossed className="w-4 h-4" />,
  coffee_maker: <Coffee className="w-4 h-4" />,
  terrace: <Sun className="w-4 h-4" />,
  balcony: <Building2 className="w-4 h-4" />,
  city_view: <Sun className="w-4 h-4" />,
  private_entrance: <CheckCircle2 className="w-4 h-4" />,
  desk: <CheckCircle2 className="w-4 h-4" />,
  fridge: <CheckCircle2 className="w-4 h-4" />,
  microwave: <CheckCircle2 className="w-4 h-4" />,
  iron: <CheckCircle2 className="w-4 h-4" />,
  hair_dryer: <CheckCircle2 className="w-4 h-4" />,
  washer_dryer: <CheckCircle2 className="w-4 h-4" />,
  outdoor_dining: <CheckCircle2 className="w-4 h-4" />,
  ensuite_bath: <Bath className="w-4 h-4" />,
};

const AMENITY_LABELS: Record<string, { es: string; en: string }> = {
  wifi: { es: "WiFi de alta velocidad", en: "High-speed WiFi" },
  ac: { es: "Aire acondicionado", en: "Air conditioning" },
  tv: { es: "Smart TV", en: "Smart TV" },
  kitchen: { es: "Cocina privada", en: "Private kitchen" },
  coffee_maker: { es: "Cafetera", en: "Coffee maker" },
  terrace: { es: "Terraza privada", en: "Private terrace" },
  balcony: { es: "Balcón privado", en: "Private balcony" },
  city_view: { es: "Vistas a la ciudad", en: "City views" },
  private_entrance: { es: "Acceso privado", en: "Private entrance" },
  desk: { es: "Escritorio", en: "Desk" },
  fridge: { es: "Refrigerador", en: "Refrigerator" },
  microwave: { es: "Microondas", en: "Microwave" },
  iron: { es: "Plancha e tabla", en: "Iron & board" },
  hair_dryer: { es: "Secadora de cabello", en: "Hair dryer" },
  washer_dryer: { es: "Lavadora/secadora", en: "Washer/dryer" },
  outdoor_dining: { es: "Comedor al aire libre", en: "Outdoor dining area" },
  ensuite_bath: { es: "Baño integrado", en: "En-suite bathroom" },
};

async function getApartment(slug: string): Promise<Apartment | null> {
  const { data } = await supabase
    .from('apartments')
    .select('*')
    .eq('slug', slug)
    .eq('available', true)
    .single();
  return data;
}

async function getSimilar(currentSlug: string): Promise<Apartment[]> {
  const { data } = await supabase
    .from('apartments')
    .select('id,slug,name_es,name_en,price_standard_dop,images,bedrooms,size_m2,max_guests')
    .eq('available', true)
    .neq('slug', currentSlug)
    .order('sort_order')
    .limit(3);
  return data || [];
}

export async function generateStaticParams() {
  const { data } = await supabase
    .from('apartments')
    .select('slug')
    .eq('available', true);
  return (data || []).map((apt) => ({ slug: apt.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const apt = await getApartment(slug);
  if (!apt) return { title: "Apartment not found" };
  const isEN = locale === 'en';
  const name = isEN ? apt.name_en : apt.name_es;
  const desc = isEN ? apt.description_en : apt.description_es;
  const img = apt.images?.[0]?.url;
  return {
    title: `${name} — Casa La Maria Zona Colonial`,
    description: desc?.slice(0, 160),
    openGraph: { title: name, description: desc?.slice(0, 160), images: img ? [{ url: img }] : [] }
  };
}

export default async function ApartmentDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);
  const [apt, similar] = await Promise.all([getApartment(slug), getSimilar(slug)]);
  if (!apt) notFound();

  const isEN = locale === 'en';
  const name = isEN ? apt.name_en : apt.name_es;
  const description = isEN ? apt.description_en : apt.description_es;
  const bathType = isEN ? apt.bath_type_en : apt.bath_type_es;
  const bedConfig = isEN ? apt.bed_config_en : apt.bed_config_es;
  const backHref = isEN ? "/en/apartments" : "/es/apartamentos";
  const bookHref = isEN ? `/en/book?apt=${apt.slug}` : `/es/reserva?apt=${apt.slug}`;
  const mainImage = apt.images?.[0];

  return (
    <main className="min-h-screen bg-background text-foreground relative z-10">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href={backHref} className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            {isEN ? "All apartments" : "Todos los apartamentos"}
          </Link>
          <span>/</span>
          <span className="text-foreground">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left: content */}
          <div className="lg:col-span-2">
            {/* Hero image */}
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted mb-8">
              {mainImage ? (
                <Image
                  src={mainImage.url}
                  alt={isEN ? mainImage.alt_en : mainImage.alt_es}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BedDouble className="w-20 h-20 text-muted-foreground/20" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                {apt.has_terrace && (
                  <Badge variant="secondary">{isEN ? "Terrace" : "Terraza"}</Badge>
                )}
              </div>
            </div>

            {/* Title + stats */}
            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">{name}</h1>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <BedDouble className="w-4 h-4 text-accent" />
                {apt.bedrooms} {isEN ? apt.bedrooms === 1 ? "bedroom" : "bedrooms" : apt.bedrooms === 1 ? "dormitorio" : "dormitorios"}
              </span>
              <span className="flex items-center gap-1.5">
                <Bath className="w-4 h-4 text-accent" />
                {bathType}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-accent" />
                {isEN ? `Max. ${apt.max_guests} guests` : `Máx. ${apt.max_guests} huéspedes`}
              </span>
              <span className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-accent" />
                {apt.size_m2} m²
              </span>
            </div>

            {/* Bed config */}
            <div className="mb-6 p-4 bg-muted rounded-xl border border-border">
              <p className="text-sm font-medium text-foreground mb-1">{isEN ? "Bed configuration" : "Configuración de camas"}</p>
              <p className="text-sm text-muted-foreground">{bedConfig}</p>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed mb-10">{description}</p>

            {/* Amenities */}
            <div>
              <h2 className="font-serif text-xl text-foreground mb-4">
                {isEN ? "Included amenities" : "Comodidades incluidas"}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {apt.amenities?.map((key) => (
                  <div key={key} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                    <span className="text-accent shrink-0">{AMENITY_ICONS[key] || <CheckCircle2 className="w-4 h-4" />}</span>
                    {isEN ? AMENITY_LABELS[key]?.en : AMENITY_LABELS[key]?.es}
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="mt-10 p-5 bg-muted/50 rounded-xl border border-border">
              <h2 className="font-serif text-lg text-foreground mb-3">{isEN ? "Cancellation policy" : "Política de cancelación"}</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✕ <strong className="text-foreground">{isEN ? "Non-refundable:" : "No reembolsable:"}</strong> {isEN ? "Unfortunately, this rate is non-refundable. Payment is required before arrival. See our Terms & Conditions for full details." : "Desafortunadamente, esta tarifa no es reembolsable. El pago es obligatorio antes de la llegada. Consulta nuestros Términos y Condiciones para más detalles."}</p>
              </div>
            </div>
          </div>

          {/* Right: price sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <ApartmentPriceBlock apartment={apt} locale={locale} />

              {/* Contact */}
              <div className="mt-4 p-4 bg-muted rounded-xl border border-border text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  {isEN ? "Questions? Write us directly" : "¿Preguntas? Escríbenos directamente"}
                </p>
                <a
                  href="mailto:info@casalamariazonacolonial.com"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  info@casalamariazonacolonial.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Similar apartments */}
        {similar.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border">
            <h2 className="font-serif text-2xl text-foreground mb-6">
              {isEN ? "Other apartments" : "Otros apartamentos"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {similar.map((s) => (
                <Link
                  key={s.id}
                  href={isEN ? `/en/apartments/${s.slug}` : `/es/apartamentos/${s.slug}`}
                  className="group bg-card border border-border rounded-xl p-4 hover:border-accent/40 transition-all"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted mb-3 relative">
                    {s.images?.[0] ? (
                      <Image
                        src={s.images[0].url} alt={isEN ? s.images[0]?.alt_en : s.images[0]?.alt_es}
                        fill className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <BedDouble className="w-8 h-8 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {isEN ? s.name_en : s.name_es}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isEN ? "From" : "Desde"} DOP {s.price_standard_dop?.toLocaleString('es-DO')}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Accommodation",
              "@id": `https://casalamariazonacolonial.com/apartamentos/${apt.slug}`,
              "name": name,
              "description": description,
              "accommodationCategory": "Apartment",
              "numberOfBedrooms": apt.bedrooms,
              "numberOfBathroomsTotal": apt.bathrooms,
              "floorSize": { "@type": "QuantitativeValue", "value": apt.size_m2, "unitCode": "MTK" },
              "occupancy": { "@type": "QuantitativeValue", "maxValue": apt.max_guests },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Callejón Regina",
                "addressLocality": "Santo Domingo",
                "addressRegion": "Distrito Nacional",
                "postalCode": "10210",
                "addressCountry": "DO"
              },
              "image": apt.images?.map(i => i.url),
              "url": `https://casalamariazonacolonial.com/apartamentos/${apt.slug}`,
              "containedInPlace": { "@type": "ApartmentComplex", "name": "Casa La Maria", "url": "https://casalamariazonacolonial.com" },
              "amenityFeature": apt.amenities?.map(a => ({
                "@type": "LocationFeatureSpecification",
                "name": AMENITY_LABELS[a]?.en || a,
                "value": true
              }))
            })
          }}
        />
      </div>

      <Footer />
    </main>
  );
}
