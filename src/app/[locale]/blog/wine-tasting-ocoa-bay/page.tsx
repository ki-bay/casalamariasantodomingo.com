import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Wine,
  Grape,
  Utensils,
  Phone,
  Mail,
  CalendarDays,
  ExternalLink,
  Car,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

const BOOKING_URL = "https://ocoabay.com/wine-tour-tasting/";
const RESERVATION_URL = "https://ocoabay.com/reservation/";

// ──────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEN = locale === "en";
  return {
    title: isEN
      ? "Ocoa Bay Wine Tasting: Dominican Republic's Must-Do Vineyard Experience (2026)"
      : "Cata de Vinos en Ocoa Bay: La Experiencia de Viñedo Imprescindible en República Dominicana (2026)",
    description: isEN
      ? "Complete 2026 guide to the OcoaBay wine tour & tasting — the only sustainable vineyard in the Caribbean. Try KiBay (mango–passion fruit blend), tour the vines, dine farm-to-table. Book online from $65 USD."
      : "Guía 2026 completa del tour y cata de vinos de OcoaBay — el único viñedo sostenible del Caribe. Prueba KiBay (mango y maracuyá), recorre los viñedos y disfruta de cocina farm-to-table. Reserva online desde $65 USD.",
    keywords: isEN
      ? "Ocoa Bay wine tasting, wine tour Dominican Republic, KiBay wine, vineyard Dominican Republic, things to do near Santo Domingo, day trip from Santo Domingo, Caribbean vineyard, Dominican wine, OcoaWines, Azua wine tour"
      : "cata de vinos Ocoa Bay, tour de vinos República Dominicana, vino KiBay, viñedo República Dominicana, qué hacer cerca de Santo Domingo, excursión desde Santo Domingo, viñedo caribeño, vinos dominicanos, OcoaWines, tour vino Azua",
    alternates: {
      canonical: "https://casalamariazonacolonial.com/es/blog/wine-tasting-ocoa-bay",
      languages: {
        es: "https://casalamariazonacolonial.com/es/blog/wine-tasting-ocoa-bay",
        en: "https://casalamariazonacolonial.com/en/blog/wine-tasting-ocoa-bay",
        "x-default": "https://casalamariazonacolonial.com/es/blog/wine-tasting-ocoa-bay",
      },
    },
    openGraph: {
      title: isEN
        ? "Ocoa Bay Wine Tasting: The Must-Do Vineyard Experience in the DR"
        : "Cata de Vinos en Ocoa Bay: Experiencia Imprescindible en RD",
      description: isEN
        ? "The only Caribbean vineyard. Wine tour, KiBay tasting, farm-to-table — book online."
        : "El único viñedo del Caribe. Tour, cata de KiBay y gastronomía orgánica — reserva online.",
      url: "https://casalamariazonacolonial.com/es/blog/wine-tasting-ocoa-bay",
      siteName: "Casa La Maria Zona Colonial",
      images: [
        {
          url: "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-01.webp",
          width: 1200,
          height: 630,
          alt: isEN
            ? "OcoaBay vineyards and tasting — Dominican Republic"
            : "Viñedos y cata en OcoaBay — República Dominicana",
        },
      ],
      type: "article",
      publishedTime: "2026-04-29",
      modifiedTime: "2026-04-29",
      locale: isEN ? "en_US" : "es_DO",
    },
    twitter: {
      card: "summary_large_image",
      title: isEN
        ? "Ocoa Bay Wine Tasting — Must-Do Vineyard in the DR"
        : "Cata en Ocoa Bay — Viñedo Imprescindible en RD",
      description: isEN
        ? "Caribbean vineyard, KiBay wine, farm-to-table. Book the tour."
        : "Viñedo caribeño, vino KiBay y cocina orgánica. Reserva el tour.",
      images: ["https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-01.webp"],
    },
  };
}

// ──────────────────────────────────────────────────────────
// JSON-LD: BlogPosting
// ──────────────────────────────────────────────────────────
const BLOG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline:
    "Ocoa Bay Wine Tasting: Dominican Republic's Must-Do Vineyard Experience (2026)",
  description:
    "Complete guide to the OcoaBay wine tour & tasting — the only sustainable vineyard in the Caribbean. Wine tour, KiBay tasting, farm-to-table cuisine and online booking.",
  image: [
    "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-01.webp",
    "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-02.webp",
    "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-03.webp",
    "https://ocoabay.com/wp-content/uploads/2025/06/full-experiences.jpg",
    "https://ocoabay.com/wp-content/uploads/2025/06/gastronomy.webp",
    "https://ocoabay.com/wp-content/uploads/2025/06/Beach-img.webp",
  ],
  author: {
    "@type": "Organization",
    name: "Casa La Maria Zona Colonial",
    url: "https://casalamariazonacolonial.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Casa La Maria Zona Colonial",
    url: "https://casalamariazonacolonial.com",
  },
  datePublished: "2026-04-29",
  dateModified: "2026-04-29",
  url: "https://casalamariazonacolonial.com/es/blog/wine-tasting-ocoa-bay",
  mainEntityOfPage:
    "https://casalamariazonacolonial.com/es/blog/wine-tasting-ocoa-bay",
  inLanguage: ["es", "en"],
  about: [
    {
      "@type": "TouristAttraction",
      name: "OcoaBay Vineyard",
      url: "https://ocoabay.com",
      address: {
        "@type": "PostalAddress",
        streetAddress:
          "Bahía de Ocoa, Carretera Hatillo Palmar de Ocoa Km 6/12, Hatillo",
        addressLocality: "Azua",
        postalCode: "71003",
        addressCountry: "DO",
      },
    },
  ],
};

// ──────────────────────────────────────────────────────────
// JSON-LD: FAQPage
// ──────────────────────────────────────────────────────────
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where is OcoaBay located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OcoaBay is on the south coast of the Dominican Republic, in Hatillo, Azua, about 2 hours by car from Santo Domingo (Zona Colonial). The full address is Bahía de Ocoa, Carretera Hatillo Palmar de Ocoa Km 6/12, Hatillo, Azua 71003.",
      },
    },
    {
      "@type": "Question",
      name: "How much does the OcoaBay wine tour cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Wine Tour Experience costs USD $65 per person plus taxes (18% VAT + 10% service). The OcoaBay Full Experience (tour, tasting, 3-course menu and pool access) costs USD $145 per person plus taxes.",
      },
    },
    {
      "@type": "Question",
      name: "What days is OcoaBay open for visits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OcoaBay is open every Saturday and Sunday for tours and tastings. It is closed on weekdays except for public holidays. Reservations must be booked in advance.",
      },
    },
    {
      "@type": "Question",
      name: "What is KiBay wine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "KiBay is OcoaBay's signature tropical wine — a unique blend made with mango and passion fruit (maracuyá), produced in the only Caribbean vineyard. It is the highlight of the tasting experience.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the wine tour last?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Wine Tour and Tasting lasts approximately 90 minutes. The Full Experience extends throughout the day with pool and clubhouse access from 11:00 AM to 6:30 PM.",
      },
    },
    {
      "@type": "Question",
      name: "Is OcoaBay a good day trip from Santo Domingo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — it is one of the best day trips from Santo Domingo. The drive is around 2 hours each way. Visitors staying in the Colonial Zone (Casa La Maria) can leave in the morning and return by evening.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to book in advance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. OcoaBay operates by reservation only. Book online at https://ocoabay.com/wine-tour-tasting/ or contact +1 (849) 876-6563 / info@OcoaBay.com.",
      },
    },
    {
      "@type": "Question",
      name: "What grape varieties are grown at OcoaBay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OcoaBay grows French Colombard, Tempranillo, and Muscat de Hamburg, all cultivated sustainably without pesticides — uniquely adapted to the Caribbean dry forest climate.",
      },
    },
  ],
};

// ──────────────────────────────────────────────────────────
// Content data
// ──────────────────────────────────────────────────────────
const PILLARS_EN = [
  {
    icon: "Grape" as const,
    title: "Award-winning organic wines",
    desc: "OcoaBay grows French Colombard, Tempranillo, and Muscat de Hamburg sustainably — no pesticides. Try KiBay, the signature mango–passion fruit blend that put Dominican wine on the map.",
  },
  {
    icon: "Wine" as const,
    title: "Private guided tastings",
    desc: "Electric-cart tour of the vineyards, the winery, and the store with a sommelier-led tasting paired with wood-fired focaccia, artisan cheeses, local jams, and pure OcoaBay honey.",
  },
  {
    icon: "Utensils" as const,
    title: "Farm-to-table cuisine",
    desc: "Fresh fish from Ocoa Bay, focaccia from the wood-fired oven, goat from the farm, honey from the dry-forest bees. The clubhouse overlooks an infinity pool with bay views.",
  },
];

const PILLARS_ES = [
  {
    icon: "Grape" as const,
    title: "Vinos orgánicos premiados",
    desc: "OcoaBay cultiva uvas French Colombard, Tempranillo y Muscat de Hamburg de forma sostenible y sin pesticidas. Prueba KiBay, el blend insignia de mango y maracuyá que puso al vino dominicano en el mapa.",
  },
  {
    icon: "Wine" as const,
    title: "Catas privadas guiadas",
    desc: "Recorrido en carrito eléctrico por los viñedos, la bodega y la tienda con cata guiada por sommelier, maridada con focaccia al horno de leña, quesos artesanales, mermeladas locales y miel pura de OcoaBay.",
  },
  {
    icon: "Utensils" as const,
    title: "Cocina farm-to-table",
    desc: "Pescado fresco de la Bahía de Ocoa, focaccia al horno de leña, cabrito de la finca, miel de las abejas del bosque seco. El clubhouse mira hacia una piscina infinita con vistas a la bahía.",
  },
];

const PACKAGES_EN = [
  {
    name: "OcoaBay Full Experience",
    price: "USD $145 p/p",
    feature: "Tour + Tasting + 3-course menu + pool",
    items: [
      "Guided tasting of OcoaWines and organic products",
      "Electric-cart tour of vineyards, winery and store",
      "Welcome toast and 3-course organic farm-to-table menu",
      "Use of pool & Clubhouse from 11:00 AM to 6:30 PM",
      "Tour & tasting duration: 90 minutes",
    ],
    note: "Plus taxes (18% VAT + 10% service). Subject to seasonal availability.",
    featured: true,
  },
  {
    name: "Wine Tour Experience",
    price: "USD $65 p/p",
    feature: "Tour + Tasting (90 min)",
    items: [
      "Guided tasting of OcoaWines and organic products",
      "Electric-cart tour of vineyards, winery and store",
      "Pairing: KiBay, focaccia, cheese, jam and OcoaBay honey",
      "Tour & tasting duration: 90 minutes",
    ],
    note: "Plus taxes (18% VAT + 10% service).",
    featured: false,
  },
  {
    name: "OcoaBay Clubhouse",
    price: "By consumption",
    feature: "À la carte (reservation only)",
    items: [
      "Minimum à la carte menu purchase",
      "Farm-to-table cuisine",
      "Use of pool & Clubhouse from 11:00 AM to 6:30 PM",
      "Reservation required in advance",
    ],
    note: "Pricing based on menu consumption.",
    featured: false,
  },
];

const PACKAGES_ES = [
  {
    name: "OcoaBay Full Experience",
    price: "USD $145 p/p",
    feature: "Tour + Cata + Menú 3 tiempos + piscina",
    items: [
      "Cata guiada de OcoaWines y productos orgánicos del proyecto",
      "Tour en carrito eléctrico por viñedos, bodega y tienda",
      "Brindis de bienvenida y menú orgánico de 3 tiempos",
      "Uso de piscina y Clubhouse de 11:00 AM a 6:30 PM",
      "Duración del tour y cata: 90 minutos",
    ],
    note: "Más impuestos (18% ITBIS + 10% servicio). Sujeto a disponibilidad estacional.",
    featured: true,
  },
  {
    name: "Wine Tour Experience",
    price: "USD $65 p/p",
    feature: "Tour + Cata (90 min)",
    items: [
      "Cata guiada de OcoaWines y productos orgánicos",
      "Tour en carrito eléctrico por viñedos, bodega y tienda",
      "Maridaje: KiBay, focaccia, queso, mermelada y miel de OcoaBay",
      "Duración del tour y cata: 90 minutos",
    ],
    note: "Más impuestos (18% ITBIS + 10% servicio).",
    featured: false,
  },
  {
    name: "OcoaBay Clubhouse",
    price: "Por consumo",
    feature: "À la carte (sólo con reserva)",
    items: [
      "Consumo mínimo del menú à la carte",
      "Cocina farm-to-table",
      "Uso de piscina y Clubhouse de 11:00 AM a 6:30 PM",
      "Reserva previa obligatoria",
    ],
    note: "Tarifa basada en el consumo.",
    featured: false,
  },
];

const FAQS_EN = [
  {
    q: "Where exactly is OcoaBay?",
    a: "OcoaBay sits on the southern Caribbean coast of the Dominican Republic, in Hatillo, Azua — Bahía de Ocoa, Carretera Hatillo Palmar de Ocoa Km 6/12. From Santo Domingo it's about 2 hours by car along the Autovía 6 de Noviembre and Autopista del Sur.",
  },
  {
    q: "When is OcoaBay open?",
    a: "Saturdays and Sundays. It's closed on weekdays except public holidays. All visits are by reservation only — book in advance to guarantee your spot.",
  },
  {
    q: "How much is the wine tour?",
    a: "USD $65 per person plus taxes for the Wine Tour & Tasting (90 minutes). The OcoaBay Full Experience — which adds the 3-course farm-to-table lunch and full pool/clubhouse access from 11 AM to 6:30 PM — is USD $145 per person plus taxes.",
  },
  {
    q: "What is KiBay?",
    a: "KiBay is OcoaBay's signature tropical wine, a fruit-blend made with mango and passion fruit (maracuyá). It's only available here — uniquely Dominican, uniquely Caribbean.",
  },
  {
    q: "Is OcoaBay a good day trip from the Colonial Zone?",
    a: "Absolutely. Many of our guests at Casa La Maria use a Saturday or Sunday for a wine-day at OcoaBay: 8 AM departure from the Colonial Zone, 90-minute tour and tasting, lunch by the pool, sunset over the bay, and back in Santo Domingo by 8 PM.",
  },
  {
    q: "Do I need to book in advance?",
    a: "Yes. Book online at ocoabay.com/wine-tour-tasting/ or call +1 (849) 876-6563. Walk-ins are not accepted.",
  },
  {
    q: "Is the wine actually grown there?",
    a: "Yes. OcoaBay grows French Colombard, Tempranillo, and Muscat de Hamburg in its own vineyards using sustainable, pesticide-free practices — uniquely adapted to the Caribbean climate.",
  },
  {
    q: "What should I wear?",
    a: "Comfortable closed shoes for the vineyard walk, light clothing (it can be warm), swimwear if you're booking the Full Experience for pool access, sunglasses, and SPF.",
  },
];

const FAQS_ES = [
  {
    q: "¿Dónde queda OcoaBay exactamente?",
    a: "OcoaBay está en la costa sur caribeña de República Dominicana, en Hatillo, Azua — Bahía de Ocoa, Carretera Hatillo Palmar de Ocoa Km 6/12. Desde Santo Domingo son unas 2 horas en coche por la Autovía 6 de Noviembre y la Autopista del Sur.",
  },
  {
    q: "¿Cuándo está abierto OcoaBay?",
    a: "Sábados y domingos. Cerrado los días laborables excepto feriados nacionales. Todas las visitas son sólo con reserva previa — reserva con antelación para garantizar tu lugar.",
  },
  {
    q: "¿Cuánto cuesta el tour de vinos?",
    a: "USD $65 por persona más impuestos por el Wine Tour & Tasting (90 minutos). El OcoaBay Full Experience — que incluye además el menú orgánico de 3 tiempos y acceso completo a la piscina y clubhouse de 11 AM a 6:30 PM — cuesta USD $145 por persona más impuestos.",
  },
  {
    q: "¿Qué es KiBay?",
    a: "KiBay es el vino tropical insignia de OcoaBay, un blend afrutado de mango y maracuyá. Sólo se encuentra aquí — único en el mundo, único del Caribe.",
  },
  {
    q: "¿Es buena excursión de un día desde la Zona Colonial?",
    a: "Totalmente. Muchos de nuestros huéspedes en Casa La Maria reservan un sábado o domingo para un día de vinos en OcoaBay: salida 8 AM desde la Zona Colonial, tour y cata de 90 min, almuerzo junto a la piscina, atardecer sobre la bahía y regreso a Santo Domingo hacia las 8 PM.",
  },
  {
    q: "¿Necesito reservar con antelación?",
    a: "Sí. Reserva online en ocoabay.com/wine-tour-tasting/ o llama al +1 (849) 876-6563. No se aceptan visitas sin reserva.",
  },
  {
    q: "¿Las uvas se cultivan ahí mismo?",
    a: "Sí. OcoaBay cultiva French Colombard, Tempranillo y Muscat de Hamburg en sus propios viñedos con prácticas sostenibles y sin pesticidas — adaptadas al clima caribeño.",
  },
  {
    q: "¿Qué ropa debo llevar?",
    a: "Calzado cómodo y cerrado para el viñedo, ropa ligera (puede hacer calor), traje de baño si reservas el Full Experience para usar la piscina, gafas de sol y protector solar SPF.",
  },
];

// ──────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────
export default async function WineTastingOcoaBayPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";

  const pillars = isEN ? PILLARS_EN : PILLARS_ES;
  const packages = isEN ? PACKAGES_EN : PACKAGES_ES;
  const faqs = isEN ? FAQS_EN : FAQS_ES;

  const PillarIcon = ({ name }: { name: "Wine" | "Grape" | "Utensils" }) => {
    if (name === "Wine") return <Wine className="w-6 h-6" />;
    if (name === "Grape") return <Grape className="w-6 h-6" />;
    return <Utensils className="w-6 h-6" />;
  };

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }}
      />

      <Navbar />

      <article>
        {/* ── Article Header ── */}
        <header className="pt-28 pb-10 px-6 md:px-12">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-10"
              >
                <ArrowLeft className="w-4 h-4" />
                {isEN ? "Back to Blog" : "Volver al Blog"}
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="text-[10px] font-medium tracking-wider uppercase text-secondary bg-muted px-2.5 py-1 rounded-full border border-warm-border">
                  {isEN ? "Experiences" : "Experiencias"}
                </span>
                <span className="text-xs text-secondary flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 7 min {isEN ? "read" : "lectura"}
                </span>
                <span className="text-xs text-secondary">
                  · {isEN ? "Apr 29, 2026" : "29 Abr 2026"}
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-[46px] md:leading-[1.15] tracking-tight mb-5">
                {isEN
                  ? "Ocoa Bay Wine Tasting: The Must-Do Vineyard Experience in the Dominican Republic"
                  : "Cata de Vinos en Ocoa Bay: La Experiencia de Viñedo Imprescindible en RD"}
              </h1>

              <p className="text-warm-muted font-light leading-relaxed text-lg md:text-xl max-w-[720px]">
                {isEN
                  ? "OcoaBay is the only sustainable Caribbean vineyard — a 90-minute drive south of Santo Domingo, where breathtaking bay views, organic wines, and farm-to-table cuisine combine into the Dominican Republic's most unexpected experience. Here is everything you need to know — and how to book online before you go."
                  : "OcoaBay es el único viñedo sostenible del Caribe — a 90 minutos al sur de Santo Domingo, donde se combinan vistas espectaculares de la bahía, vinos orgánicos y cocina farm-to-table en la experiencia más sorprendente de República Dominicana. Aquí tienes todo lo que necesitas saber — y cómo reservar online antes de ir."}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-6">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-medium text-sm"
                >
                  {isEN ? "Book the Wine Tour" : "Reserva el Tour de Vinos"}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-warm-border hover:bg-muted transition-colors px-6 py-3 rounded-lg font-medium text-sm"
                >
                  {isEN ? "Full Reservation Page" : "Página Completa de Reserva"}
                </a>
              </div>

              <div className="flex items-center gap-2 mt-6">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">
                  {isEN
                    ? "Hatillo, Azua, Dominican Republic · 2 h south of the Colonial Zone"
                    : "Hatillo, Azua, República Dominicana · 2 h al sur de la Zona Colonial"}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </header>

        {/* ── Hero Image ── */}
        <div className="w-full">
          <img
            src="https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-01.webp"
            alt={
              isEN
                ? "OcoaBay vineyards overlooking the Caribbean Sea — wine tasting Dominican Republic"
                : "Viñedos de OcoaBay con vista al mar Caribe — cata de vinos en República Dominicana"
            }
            width={2400}
            height={1500}
            className="w-full h-auto block"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* ── Quick facts panel ── */}
        <section className="px-6 md:px-12 py-12">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    icon: <CalendarDays className="w-5 h-5" />,
                    label: isEN ? "Open" : "Abierto",
                    value: isEN ? "Sat & Sun" : "Sáb y Dom",
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    label: isEN ? "Duration" : "Duración",
                    value: "90 min",
                  },
                  {
                    icon: <Wine className="w-5 h-5" />,
                    label: isEN ? "From" : "Desde",
                    value: "USD $65 p/p",
                  },
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    label: isEN ? "From SDQ" : "Desde SDQ",
                    value: isEN ? "~2 h drive" : "~2 h en coche",
                  },
                ].map((f, i) => (
                  <div
                    key={i}
                    className="bg-card border border-warm-border rounded-xl p-5 flex items-start gap-3"
                  >
                    <span className="text-primary mt-0.5">{f.icon}</span>
                    <div>
                      <p className="text-xs font-medium tracking-wider uppercase text-secondary">
                        {f.label}
                      </p>
                      <p className="font-serif text-base">{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Why OcoaBay (3 pillars) ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="why-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Why OcoaBay" : "Por Qué OcoaBay"}
              </p>
              <h2
                id="why-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-2"
              >
                {isEN
                  ? "Award-winning wines. Private tastings. The most exquisite grapes."
                  : "Vinos premiados. Catas privadas. Las uvas más exquisitas."}
              </h2>
              <p className="text-warm-muted font-light mb-10 max-w-[720px]">
                {isEN
                  ? "Come visit and enjoy the true vineyard experience: breathtaking landscapes, wonderful people, and the best wines in the region."
                  : "Ven a visitarnos y vive la verdadera experiencia de viñedo: paisajes impresionantes, gente maravillosa y los mejores vinos de la región."}
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {pillars.map((p, i) => (
                <ScrollReveal key={i}>
                  <div className="bg-card rounded-xl border border-warm-border p-6 h-full">
                    <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
                      <PillarIcon name={p.icon} />
                    </span>
                    <h3 className="font-serif text-lg mb-2">{p.title}</h3>
                    <p className="text-warm-muted font-light text-sm leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Side-by-side images (vineyards) ── */}
        <div className="w-full px-6 md:px-12 py-4">
          <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-02.webp"
                alt={
                  isEN
                    ? "OcoaBay vineyard rows — French Colombard, Tempranillo and Muscat de Hamburg grapes"
                    : "Hileras del viñedo OcoaBay — uvas French Colombard, Tempranillo y Muscat de Hamburg"
                }
                className="w-full h-auto block aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-03.webp"
                alt={
                  isEN
                    ? "OcoaBay tasting room — KiBay tropical wine, focaccia, cheese and honey pairing"
                    : "Sala de cata OcoaBay — vino tropical KiBay, focaccia, queso y miel en maridaje"
                }
                className="w-full h-auto block aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ── Experiences / Packages ── */}
        <section
          className="px-6 md:px-12 py-16"
          aria-labelledby="packages-heading"
        >
          <div className="max-w-[1100px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Reserve" : "Reserva"}
              </p>
              <h2
                id="packages-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-2"
              >
                {isEN
                  ? "Choose Your OcoaBay Experience"
                  : "Elige Tu Experiencia OcoaBay"}
              </h2>
              <p className="text-warm-muted font-light mb-10 max-w-[720px]">
                {isEN
                  ? "Three ways to enjoy the vineyard. Book online before your visit — every option requires advance reservation."
                  : "Tres formas de disfrutar el viñedo. Reserva online antes de tu visita — todas las opciones requieren reserva previa."}
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-3 gap-6">
              {packages.map((pkg, i) => (
                <ScrollReveal key={i}>
                  <div
                    className={`relative h-full rounded-2xl border p-7 flex flex-col ${
                      pkg.featured
                        ? "border-primary bg-card shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                        : "border-warm-border bg-card"
                    }`}
                  >
                    {pkg.featured && (
                      <span className="absolute -top-3 left-7 text-[10px] font-medium tracking-widest uppercase bg-primary text-primary-foreground px-3 py-1 rounded-full">
                        {isEN ? "Most Complete" : "Más Completo"}
                      </span>
                    )}
                    <h3 className="font-serif text-xl mb-1">{pkg.name}</h3>
                    <p className="text-xs text-secondary mb-4">{pkg.feature}</p>
                    <p className="font-serif text-2xl text-primary mb-5">
                      {pkg.price}
                    </p>
                    <ul className="space-y-2 text-sm text-warm-muted font-light mb-6 flex-1">
                      {pkg.items.map((it, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-primary mt-1">·</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] text-secondary mb-5 leading-relaxed">
                      {pkg.note}
                    </p>
                    <a
                      href={BOOKING_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium text-sm transition-opacity ${
                        pkg.featured
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "border border-warm-border hover:bg-muted"
                      }`}
                    >
                      {isEN ? "Book Online" : "Reservar Online"}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Wine Tour deep-dive ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="winetour-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Wine Tour & Tasting" : "Tour y Cata de Vinos"}
              </p>
              <h2
                id="winetour-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-5"
              >
                {isEN
                  ? "Inside the only Caribbean vineyard"
                  : "Dentro del único viñedo del Caribe"}
              </h2>
              <div className="space-y-5 text-warm-muted font-light leading-relaxed">
                <p>
                  {isEN
                    ? "Learn how Caribbean wine is made by experiencing the OcoaBay Wine Tour and Tasting first-hand. After your welcome cocktail, you'll board an electric cart for a guided tour of the vineyards and the winery — fields of French Colombard, Tempranillo, and Muscat de Hamburg vines, all grown sustainably without pesticides, against the backdrop of the Bay of Ocoa."
                    : "Aprende cómo se hace el vino caribeño viviendo en primera persona el Wine Tour y la Cata de OcoaBay. Tras un cóctel de bienvenida, subirás a un carrito eléctrico para un recorrido guiado por los viñedos y la bodega — campos de French Colombard, Tempranillo y Muscat de Hamburg, todos cultivados de manera sostenible y sin pesticidas, con la Bahía de Ocoa como telón de fondo."}
                </p>
                <p>
                  {isEN
                    ? "Once the tour wraps up, the tasting begins. Delight your palate with KiBay — the star bottle, a tropical blend of mango and passion fruit — followed by freshly baked focaccia from the wood-fired oven, a selection of artisan cheeses, locally made jams, and pure OcoaBay honey. The combination is engineered to draw out every layer of the wines."
                    : "Cuando termina el recorrido, comienza la cata. Deléitate con KiBay — la botella estrella, un blend tropical de mango y maracuyá — seguido de focaccia recién horneada en el horno de leña, una selección de quesos artesanales, mermeladas locales y miel pura de OcoaBay. La combinación está diseñada para sacar todas las capas de los vinos."}
                </p>
                <p>
                  {isEN
                    ? "If you've added the Full Experience, the day ends in the clubhouse beside an infinity pool with a sweeping view of the Caribbean Sea, where you'll enjoy a 3-course farm-to-table meal. The whole tour and tasting takes around 90 minutes — the rest of the day is yours."
                    : "Si has añadido el Full Experience, el día termina en el clubhouse junto a una piscina infinita con vista al Mar Caribe, donde disfrutarás de un menú farm-to-table de 3 tiempos. El tour y la cata duran unos 90 minutos — el resto del día es tuyo."}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Full bleed image: full experience ── */}
        <div className="w-full">
          <img
            src="https://ocoabay.com/wp-content/uploads/2025/06/full-experiences.jpg"
            alt={
              isEN
                ? "OcoaBay Full Experience — infinity pool and clubhouse overlooking the Bay of Ocoa"
                : "OcoaBay Full Experience — piscina infinita y clubhouse con vista a la Bahía de Ocoa"
            }
            width={2400}
            height={1500}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* ── BayaOnda ── */}
        <section
          className="px-6 md:px-12 py-16"
          aria-labelledby="bayaonda-heading"
        >
          <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-10 items-center">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Restaurant" : "Restaurante"}
              </p>
              <h2
                id="bayaonda-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-4"
              >
                {isEN
                  ? "BayaOnda — Farm-to-Table on the Bay"
                  : "BayaOnda — Cocina Farm-to-Table sobre la Bahía"}
              </h2>
              <p className="text-warm-muted font-light leading-relaxed mb-3">
                {isEN
                  ? "BayaOnda at OcoaBay serves artisanal dishes built on organic ingredients harvested on site. Fresh fish and shellfish are caught in the Bay of Ocoa by local fishermen. Focaccias and breads come out of the wood-fired oven. Honey is produced by bees from the dry-forest flowers, and goat meat and cheese come from goats raised on the farm."
                  : "BayaOnda en OcoaBay sirve platos artesanales hechos con ingredientes orgánicos cosechados en el lugar. Pescados y mariscos frescos los traen los pescadores locales de la Bahía de Ocoa. Las focaccias y panes salen del horno de leña. La miel la producen las abejas de las flores del bosque seco, y el cabrito y los quesos vienen de cabras criadas en la finca."}
              </p>
              <p className="text-warm-muted font-light leading-relaxed">
                {isEN
                  ? "Modern-rustic architecture, mountain views on one side, the bay at sunset on the other. The perfect place to pair Ocoa wines with the food they were designed for."
                  : "Arquitectura rústica-moderna, montañas a un lado, la bahía al atardecer al otro. El lugar perfecto para maridar los vinos de Ocoa con la comida para la que fueron diseñados."}
              </p>
            </ScrollReveal>
            <ScrollReveal>
              <div className="overflow-hidden rounded-xl">
                <img
                  src="https://ocoabay.com/wp-content/uploads/2025/06/gastronomy.webp"
                  alt={
                    isEN
                      ? "BayaOnda restaurant — farm-to-table cuisine at OcoaBay"
                      : "Restaurante BayaOnda — cocina farm-to-table en OcoaBay"
                  }
                  className="w-full h-auto block aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Beach ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="beach-heading"
        >
          <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-10 items-center">
            <ScrollReveal>
              <div className="overflow-hidden rounded-xl order-2 md:order-1">
                <img
                  src="https://ocoabay.com/wp-content/uploads/2025/06/Beach-img.webp"
                  alt={
                    isEN
                      ? "OcoaBay private beach — turquoise water and coral sand on the south coast"
                      : "Playa privada de OcoaBay — agua turquesa y arena coralina en la costa sur"
                  }
                  className="w-full h-auto block aspect-[4/3] object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollReveal>
            <ScrollReveal>
              <div className="order-1 md:order-2">
                <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                  {isEN ? "Beach" : "Playa"}
                </p>
                <h2
                  id="beach-heading"
                  className="font-serif text-2xl md:text-3xl tracking-tight mb-4"
                >
                  {isEN
                    ? "Six Miles of Virgin Caribbean Beach"
                    : "Seis Millas de Playa Virgen del Caribe"}
                </h2>
                <p className="text-warm-muted font-light leading-relaxed mb-3">
                  {isEN
                    ? "Palmar de Ocoa stretches over six miles of coastline — Playa Caracoles, Playa Palmar de Ocoa, and Beach Biyeya among them. Coral and grey-sand beaches meet crystal-clear turquoise water, ideal for snorkeling and quiet, uncrowded swimming."
                    : "Palmar de Ocoa se extiende por más de seis millas de costa — Playa Caracoles, Playa Palmar de Ocoa y Playa Biyeya, entre otras. Arenas coralinas y grises se encuentran con aguas turquesa cristalinas, ideales para snorkel y baños tranquilos lejos de las multitudes."}
                </p>
                <p className="text-warm-muted font-light leading-relaxed">
                  {isEN
                    ? "Fishing is the way of life here, so you'll always find the freshest catch on your plate. Sunsets over the bay are unforgettable — Playa Caracoles is also where Francisco Caamaño's guerrillas landed in 1973, giving the area genuine national-historic weight."
                    : "La pesca es el modo de vida aquí, así que siempre encontrarás el mejor pescado del día en tu plato. Los atardeceres sobre la bahía son inolvidables — Playa Caracoles, además, es donde desembarcó la guerrilla de Francisco Caamaño en 1973, lo que añade a la zona un peso histórico nacional."}
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── How to get there ── */}
        <section
          className="px-6 md:px-12 py-16"
          aria-labelledby="getting-there-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <Car className="w-5 h-5 text-secondary" />
                <p className="text-xs font-medium tracking-widest uppercase text-secondary">
                  {isEN ? "Getting There" : "Cómo Llegar"}
                </p>
              </div>
              <h2
                id="getting-there-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-8"
              >
                {isEN
                  ? "How to get to OcoaBay from Santo Domingo"
                  : "Cómo llegar a OcoaBay desde Santo Domingo"}
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-6">
              {(isEN
                ? [
                    {
                      from: "From the Colonial Zone (Casa La Maria)",
                      detail:
                        "About 2 hours by car. Take the Autovía 6 de Noviembre west, continue on the Autopista del Sur, then follow signs for Hatillo / Palmar de Ocoa. We can arrange a private driver for our guests.",
                    },
                    {
                      from: "From Las Américas Airport (SDQ)",
                      detail:
                        "Roughly 2 h 30 min by car. Skip the city center via the Circunvalación de Santo Domingo and join the Autopista del Sur.",
                    },
                    {
                      from: "From Punta Cana",
                      detail:
                        "Around 4 h 30 min by car. We recommend overnighting in Santo Domingo first (e.g. Casa La Maria) and continuing the next morning.",
                    },
                    {
                      from: "Private transfer",
                      detail:
                        "Easiest for groups. A round-trip private driver from the Colonial Zone runs roughly USD $180–250 depending on vehicle. Ask at reception.",
                    },
                  ]
                : [
                    {
                      from: "Desde la Zona Colonial (Casa La Maria)",
                      detail:
                        "Unas 2 horas en coche. Toma la Autovía 6 de Noviembre hacia el oeste, continúa por la Autopista del Sur y sigue las indicaciones a Hatillo / Palmar de Ocoa. Podemos coordinar un chofer privado para nuestros huéspedes.",
                    },
                    {
                      from: "Desde el Aeropuerto Las Américas (SDQ)",
                      detail:
                        "Aproximadamente 2 h 30 min en coche. Esquiva el centro por la Circunvalación de Santo Domingo y enlaza con la Autopista del Sur.",
                    },
                    {
                      from: "Desde Punta Cana",
                      detail:
                        "Unas 4 h 30 min en coche. Recomendamos pasar primero una noche en Santo Domingo (por ejemplo en Casa La Maria) y continuar a la mañana siguiente.",
                    },
                    {
                      from: "Transfer privado",
                      detail:
                        "Lo más fácil para grupos. Un chofer privado ida y vuelta desde la Zona Colonial cuesta aproximadamente USD $180–250 según el vehículo. Pregunta en recepción.",
                    },
                  ]
              ).map((item, i) => (
                <ScrollReveal key={i}>
                  <div className="bg-card border border-warm-border rounded-xl p-5">
                    <h3 className="font-serif text-base mb-2">{item.from}</h3>
                    <p className="text-warm-muted font-light text-sm leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Practical info ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="info-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Practical Info" : "Información Práctica"}
              </p>
              <h2
                id="info-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-8"
              >
                {isEN ? "Plan Your Visit" : "Planifica Tu Visita"}
              </h2>
            </ScrollReveal>

            <div className="bg-card rounded-2xl border border-warm-border p-7 md:p-10">
              <div className="grid sm:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-2 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    {isEN ? "Hours" : "Horario"}
                  </p>
                  <p className="text-sm font-light leading-relaxed">
                    {isEN
                      ? "Every Saturday and Sunday. Closed weekdays except public holidays. By reservation only."
                      : "Cada sábado y domingo. Cerrado los días laborables excepto feriados. Sólo con reserva."}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {isEN ? "Address" : "Dirección"}
                  </p>
                  <p className="text-sm font-light leading-relaxed">
                    Bahía de Ocoa, Carretera Hatillo Palmar de Ocoa Km 6/12,
                    Hatillo, Azua 71003, Dominican Republic
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {isEN ? "Phone" : "Teléfono"}
                  </p>
                  <a
                    href="tel:+18498766563"
                    className="text-sm font-light hover:text-primary transition-colors"
                  >
                    +1 (849) 876-6563
                  </a>
                </div>
                <div>
                  <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </p>
                  <a
                    href="mailto:info@ocoabay.com"
                    className="text-sm font-light hover:text-primary transition-colors"
                  >
                    info@OcoaBay.com
                  </a>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-warm-border flex flex-col sm:flex-row gap-3">
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-6 py-3 rounded-lg font-medium text-sm flex-1"
                >
                  {isEN ? "Book the Wine Tour & Tasting" : "Reservar Tour y Cata de Vinos"}
                  <ExternalLink className="w-4 h-4" />
                </a>
                <a
                  href={RESERVATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-warm-border hover:bg-muted transition-colors px-6 py-3 rounded-lg font-medium text-sm flex-1"
                >
                  {isEN ? "All reservation options" : "Todas las opciones de reserva"}
                </a>
              </div>

              <p className="text-[11px] text-secondary mt-5 leading-relaxed">
                {isEN
                  ? "Prices and schedules are managed directly by OcoaBay and may change. The availability of certain wines and products may vary depending on the season."
                  : "Los precios y horarios los gestiona OcoaBay directamente y pueden variar. La disponibilidad de ciertos vinos y productos puede variar según la temporada."}
              </p>
            </div>
          </div>
        </section>

        {/* ── Stay CTA ── */}
        <section className="px-6 md:px-12 py-20">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="bg-card border border-warm-border rounded-2xl p-10 md:p-14 text-center">
                <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-4">
                  {isEN ? "Stay in the Colonial Zone" : "Alójate en la Zona Colonial"}
                </p>
                <h2 className="font-serif text-2xl md:text-[36px] tracking-tight mb-4">
                  {isEN
                    ? "Make OcoaBay a perfect Saturday from Casa La Maria"
                    : "Convierte OcoaBay en el sábado perfecto desde Casa La Maria"}
                </h2>
                <p className="text-warm-muted font-light leading-relaxed max-w-[560px] mx-auto mb-8">
                  {isEN
                    ? "Casa La Maria is a boutique apartment on Parmenio Troncoso 4 in the Colonial Zone — the natural starting point for a wine-day at OcoaBay. We can arrange your driver, your booking, and your perfect itinerary."
                    : "Casa La Maria es un apartamento boutique en Parmenio Troncoso 4 en la Zona Colonial — el punto de partida natural para un día de vinos en OcoaBay. Coordinamos tu chofer, tu reserva y tu itinerario perfecto."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/contacto`}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-8 py-3 rounded-lg font-medium text-sm"
                  >
                    {isEN ? "Inquire about availability" : "Consultar disponibilidad"}
                  </Link>
                  <Link
                    href={`/${locale}#propiedad`}
                    className="inline-flex items-center justify-center gap-2 border border-warm-border hover:bg-muted transition-colors px-8 py-3 rounded-lg font-medium text-sm"
                  >
                    {isEN ? "View the apartment" : "Ver el apartamento"}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Final image ── */}
        <div className="w-full">
          <img
            src="https://ocoabay.com/wp-content/uploads/2025/06/2024-03-25.webp"
            alt={
              isEN
                ? "Sunset over Ocoa Bay — vineyard, mountains and Caribbean Sea"
                : "Atardecer sobre la Bahía de Ocoa — viñedo, montañas y Mar Caribe"
            }
            width={2400}
            height={1500}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* ── FAQ ── */}
        <section className="px-6 md:px-12 py-16" aria-labelledby="faq-heading">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                FAQ
              </p>
              <h2
                id="faq-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-10"
              >
                {isEN
                  ? "Frequently Asked Questions about OcoaBay"
                  : "Preguntas Frecuentes sobre OcoaBay"}
              </h2>
            </ScrollReveal>

            <div className="space-y-5">
              {faqs.map((item, i) => (
                <ScrollReveal key={i}>
                  <div className="border border-warm-border rounded-xl p-6">
                    <h3 className="font-serif text-base md:text-lg mb-3">
                      {item.q}
                    </h3>
                    <p className="text-warm-muted font-light text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal>
              <div className="mt-12 pt-8 border-t border-warm-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-secondary">
                  {isEN ? "Written by" : "Escrito por"}{" "}
                  <span className="font-medium text-primary">
                    Casa La Maria Zona Colonial
                  </span>
                </p>
                <p className="text-xs text-secondary">
                  {isEN ? "Last updated:" : "Última actualización:"}{" "}
                  <time dateTime="2026-04-29">
                    {isEN ? "April 29, 2026" : "29 de abril de 2026"}
                  </time>
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </article>

      <Footer />
    </main>
  );
}
