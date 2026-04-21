import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";
import { setRequestLocale } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft, MapPin, Clock, Utensils, ShieldCheck, ExternalLink } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEN = locale === "en";
  return {
    title: isEN
      ? "Santo Domingo Colonial Zone: What to See + Itinerary + Map (2026 Guide)"
      : "Zona Colonial Santo Domingo: Qué Ver + Itinerario + Mapa (Guía 2026)",
    description: isEN
      ? "Complete guide to Santo Domingo's Colonial Zone: top attractions, 1-day and 2-day itineraries, map, restaurants, safety tips and tours. UNESCO World Heritage Site."
      : "Guía completa de la Zona Colonial Santo Domingo: qué ver, itinerario de 1 y 2 días, mapa, precios, restaurantes, seguridad y tours. Patrimonio UNESCO.",
    alternates: {
      canonical: "https://casalamariazonacolonial.com/es/blog/zona-colonial-santo-domingo",
      languages: {
        es: "https://casalamariazonacolonial.com/es/blog/zona-colonial-santo-domingo",
        en: "https://casalamariazonacolonial.com/en/blog/zona-colonial-santo-domingo",
        "x-default": "https://casalamariazonacolonial.com/es/blog/zona-colonial-santo-domingo",
      },
    },
    openGraph: {
      title: isEN
        ? "Santo Domingo Colonial Zone: What to See + Itinerary + Map (2026)"
        : "Zona Colonial Santo Domingo: Qué Ver + Itinerario + Mapa (2026)",
      description: isEN
        ? "Complete guide: top attractions, itineraries, map, restaurants and tips."
        : "Guía completa: lugares, itinerario, mapa, restaurantes y consejos.",
      images: [
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp",
      ],
      type: "article",
      publishedTime: "2026-04-21",
      modifiedTime: "2026-04-21",
    },
  };
}

const BLOG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Zona Colonial Santo Domingo: Qué Ver + Itinerario + Mapa (Guía 2026)",
  description:
    "Guía completa de la Zona Colonial Santo Domingo: qué ver, itinerario de 1 y 2 días, mapa, restaurantes, seguridad y tours.",
  image:
    "https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp",
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
  datePublished: "2026-04-21",
  dateModified: "2026-04-21",
  url: "https://casalamariazonacolonial.com/es/blog/zona-colonial-santo-domingo",
  mainEntityOfPage:
    "https://casalamariazonacolonial.com/es/blog/zona-colonial-santo-domingo",
  inLanguage: ["es", "en"],
  about: {
    "@type": "Place",
    name: "Zona Colonial",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Santo Domingo",
      addressCountry: "DO",
    },
  },
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Cuánto cuesta visitar la Zona Colonial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Caminar por la Zona Colonial es completamente gratis. Los museos tienen entrada entre $2 y $10 USD. La Fortaleza Ozama cuesta $1.50 USD y el Alcázar de Colón unos $3 USD.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Colonial Zone safe?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, the Colonial Zone is one of the safest tourist areas in Santo Domingo. It has a heavy police and tourist police presence and is well-lit and active at night.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto tiempo necesito para visitar la Zona Colonial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "1 día es suficiente para ver los principales atractivos. 2 días es ideal para explorar con calma museos, restaurantes y vida nocturna.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best time to visit the Colonial Zone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Morning (8am–11am) or late afternoon (4pm–7pm) to avoid midday heat. The area comes alive at night with restaurants and live music.",
      },
    },
    {
      "@type": "Question",
      name: "¿Vale la pena visitar la Zona Colonial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, absolutamente. Es Patrimonio de la Humanidad UNESCO desde 1990 y el asentamiento europeo más antiguo del continente americano.",
      },
    },
    {
      "@type": "Question",
      name: "How to get to the Colonial Zone from Punta Cana?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "By car or taxi about 2.5 hours along the Autopista del Este. Organized day tours are also widely available from Punta Cana resorts.",
      },
    },
  ],
};

const ATTRACTIONS_ES = [
  {
    name: "Catedral Primada de América",
    desc: "La primera catedral construida en el continente americano (1540). Frente al Parque Colón, su fachada de piedra coralina y su interior gótico-plateresco son únicos.",
    tip: "Entrada gratuita. Abre lunes a sábado 9 AM – 4 PM.",
  },
  {
    name: "Alcázar de Colón",
    desc: "El palacio renacentista del virrey Diego Colón, hijo del Almirante. Conserva mobiliario auténtico del siglo XVI y vistas privilegiadas a la Plaza de España.",
    tip: "Entrada ~$3 USD. Cerrado lunes.",
  },
  {
    name: "Fortaleza Ozama",
    desc: "La fortaleza militar más antigua de América (1503). Desde su Torre del Homenaje hay vistas panorámicas al río Ozama y la ciudad.",
    tip: "Entrada ~$1.50 USD. Ideal a primera hora de la mañana.",
  },
  {
    name: "Ruinas de San Francisco",
    desc: "El primer convento franciscano del Nuevo Mundo, hoy convertido en un espectacular auditorio al aire libre donde se celebran conciertos.",
    tip: "Acceso libre. Eventos nocturnos con frecuencia.",
  },
  {
    name: "Panteón Nacional",
    desc: "Antigua iglesia jesuita convertida en mausoleo de los próceres dominicanos. Su cúpula pintada y el altar de mármol son obras maestras.",
    tip: "Entrada gratuita. Guardia de honor en la puerta.",
  },
  {
    name: "Calle El Conde",
    desc: "La arteria peatonal más animada, repleta de tiendas de artesanía, heladerías y cafés. Ideal para comprar recuerdos y probar jugos tropicales.",
    tip: "Mejor por la mañana para evitar el calor.",
  },
  {
    name: "Plaza de España",
    desc: "La plaza principal de la zona con vistas al río Ozama y restaurantes de terraza. Aquí se celebran festivales y mercados de arte.",
    tip: "Perfecta al atardecer para cenar al aire libre.",
  },
  {
    name: "Museo de las Casas Reales",
    desc: "Documenta cinco siglos de historia colonial dominicana con una colección de armas, mapas y objetos del período hispánico.",
    tip: "Entrada ~$2 USD. Cerrado lunes.",
  },
];

const ATTRACTIONS_EN = [
  {
    name: "Cathedral of Santa María la Menor",
    desc: "The first cathedral built in the Americas (1540). Facing Parque Colón, its coral-stone facade and Gothic-Plateresque interior are both remarkable.",
    tip: "Free entry. Open Mon–Sat 9 AM – 4 PM.",
  },
  {
    name: "Alcázar de Colón",
    desc: "The Renaissance palace of Viceroy Diego Columbus, Admiral's son. Features authentic 16th-century furniture and commanding views over Plaza de España.",
    tip: "Entry ~$3 USD. Closed Mondays.",
  },
  {
    name: "Fortaleza Ozama",
    desc: "The oldest European military fortress in the Americas (1503). Climb the Tower of Homage for panoramic views over the Ozama River.",
    tip: "Entry ~$1.50 USD. Best visited early morning.",
  },
  {
    name: "Ruins of San Francisco",
    desc: "The first Franciscan convent in the New World. Today, the hauntingly beautiful ruins serve as an open-air amphitheater for concerts.",
    tip: "Free access. Evening events held frequently.",
  },
  {
    name: "National Pantheon",
    desc: "A former Jesuit church converted into the mausoleum of Dominican heroes. The painted dome and marble altar are masterpieces.",
    tip: "Free entry. Honor guard at the entrance.",
  },
  {
    name: "Calle El Conde",
    desc: "The main pedestrian street, lined with craft shops, ice cream parlors and cafés. Ideal for souvenirs and tropical juices.",
    tip: "Best in the morning before the heat peaks.",
  },
  {
    name: "Plaza de España",
    desc: "The main square beside the Ozama River with terrace restaurants and regular art markets and festivals.",
    tip: "Perfect at sunset for alfresco dining.",
  },
  {
    name: "Museum of the Royal Houses",
    desc: "Five centuries of Dominican colonial history told through a collection of weapons, maps, and objects of the Hispanic period.",
    tip: "Entry ~$2 USD. Closed Mondays.",
  },
];

const FAQS_ES = [
  {
    q: "¿Cuánto cuesta visitar la Zona Colonial?",
    a: "Caminar es completamente gratis. Los museos cuestan entre $1.50 y $10 USD. Muchas iglesias y plazas no tienen costo de entrada.",
  },
  {
    q: "¿Es segura la Zona Colonial?",
    a: "Sí, es una de las zonas turísticas más seguras de Santo Domingo, con fuerte presencia policial y turística. Toma las precauciones habituales: no mostrar objetos de valor y preferir taxis recomendados de noche.",
  },
  {
    q: "¿Cuánto tiempo necesito?",
    a: "1 día es suficiente para cubrir los principales atractivos. Con 2 días puedes explorar museos, gastronomía y vida nocturna sin prisas.",
  },
  {
    q: "¿Cuál es el mejor momento para visitar?",
    a: "Por la mañana (8–11 h) o al final de la tarde (16–19 h) para evitar el calor del mediodía. La zona cobra vida por la noche con música en vivo y terrazas.",
  },
  {
    q: "¿Vale la pena visitar la Zona Colonial?",
    a: "Absolutamente. Es Patrimonio de la Humanidad UNESCO desde 1990 y el asentamiento europeo más antiguo del continente americano. Un lugar único en el Caribe.",
  },
  {
    q: "¿Cómo llegar desde Punta Cana?",
    a: "En coche o taxi, aproximadamente 2 h 30 min por la Autopista del Este. También hay tours organizados de día completo disponibles desde los resorts.",
  },
];

const FAQS_EN = [
  {
    q: "How much does it cost to visit the Colonial Zone?",
    a: "Walking is completely free. Museums cost between $1.50 and $10 USD. Many churches and squares have no entrance fee.",
  },
  {
    q: "Is the Colonial Zone safe?",
    a: "Yes, it is one of the safest tourist areas in Santo Domingo, with heavy police and tourist police presence. Take usual precautions: don't display valuables and use recommended taxis at night.",
  },
  {
    q: "How much time do I need?",
    a: "1 day is enough to cover the main highlights. 2 days allows you to explore museums, gastronomy and nightlife at a relaxed pace.",
  },
  {
    q: "What is the best time to visit?",
    a: "Morning (8–11 AM) or late afternoon (4–7 PM) to avoid midday heat. The area comes alive at night with live music and open terraces.",
  },
  {
    q: "Is the Colonial Zone worth visiting?",
    a: "Absolutely. It has been a UNESCO World Heritage Site since 1990 and is the oldest European settlement in the Americas — a unique destination in the Caribbean.",
  },
  {
    q: "How to get there from Punta Cana?",
    a: "By car or taxi, approximately 2.5 hours along the Autopista del Este. Full-day organized tours from Punta Cana resorts are also widely available.",
  },
];

// ──────────────────────────────────────────────────────────
export default async function ZonaColonialPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";

  const attractions = isEN ? ATTRACTIONS_EN : ATTRACTIONS_ES;
  const faqs = isEN ? FAQS_EN : FAQS_ES;

  return (
    <main className="relative z-10 min-h-screen flex flex-col">
      {/* ── JSON-LD Structured Data ── */}
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
                  {isEN ? "Guide" : "Guía"}
                </span>
                <span className="text-xs text-secondary flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 8 min {isEN ? "read" : "lectura"}
                </span>
                <span className="text-xs text-secondary">· {isEN ? "Apr 21, 2026" : "21 Abr 2026"}</span>
              </div>

              <h1 className="font-serif text-3xl md:text-[46px] md:leading-[1.15] tracking-tight mb-5">
                {isEN
                  ? "Santo Domingo Colonial Zone: What to See, Itinerary & Map (2026)"
                  : "Zona Colonial Santo Domingo: Qué Ver, Itinerario y Mapa (2026)"}
              </h1>

              <p className="text-warm-muted font-light leading-relaxed text-lg md:text-xl max-w-[720px]">
                {isEN
                  ? "The oldest European settlement in the Americas — a UNESCO World Heritage Site full of history, architecture, food and life. Your complete guide, written from the inside."
                  : "El primer asentamiento europeo del continente americano. Patrimonio de la Humanidad UNESCO. Historia, arquitectura, gastronomía y vida. Tu guía completa, escrita desde adentro."}
              </p>

              <div className="flex items-center gap-2 mt-6">
                <MapPin className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">
                  {isEN
                    ? "Written by Casa La Maria · Parmenio Troncoso 4, Zona Colonial, Santo Domingo"
                    : "Por Casa La Maria · Parmenio Troncoso 4, Zona Colonial, Santo Domingo"}
                </span>
              </div>
            </ScrollReveal>
          </div>
        </header>

        {/* ── Hero Image 1 — Full Bleed, natural ratio ── */}
        <div className="w-full">
          <img
            src="https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp"
            alt={
              isEN
                ? "Zona Colonial Santo Domingo — historic cobblestone streets"
                : "Zona Colonial Santo Domingo — calles adoquinadas históricas"
            }
            width={2400}
            height={1600}
            className="w-full h-auto block"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* ── Map Section ── */}
        <section className="px-6 md:px-12 py-16" aria-labelledby="map-heading">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Location" : "Ubicación"}
              </p>
              <h2
                id="map-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-2"
              >
                {isEN ? "Map of the Colonial Zone" : "Mapa de la Zona Colonial"}
              </h2>
              <p className="text-warm-muted font-light mb-8">
                {isEN
                  ? "Located in the heart of Santo Domingo, easily walkable from any point within the historic district."
                  : "Ubicada en el corazón de Santo Domingo, completamente transitable a pie desde cualquier punto del centro histórico."}
              </p>
              <div className="rounded-xl overflow-hidden border border-warm-border shadow-sm">
                <iframe
                  title={isEN ? "Map of the Colonial Zone, Santo Domingo" : "Mapa Zona Colonial Santo Domingo"}
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.088!2d-69.8893!3d18.4734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eaf89e50fbd5c87%3A0x8b3da79921071efe!2sZona%20Colonial%2C%20Santo%20Domingo!5e0!3m2!1ses!2sdo!4v1"
                  width="100%"
                  height="420"
                  style={{ border: 0, display: "block" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Top Attractions ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="attractions-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Must-See" : "Imprescindibles"}
              </p>
              <h2
                id="attractions-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-2"
              >
                {isEN
                  ? "Top Attractions in the Colonial Zone"
                  : "Lugares Imperdibles en la Zona Colonial"}
              </h2>
              <p className="text-warm-muted font-light mb-10">
                {isEN
                  ? "Eight centuries-old landmarks you absolutely should not miss."
                  : "Ocho monumentos centenarios que definitivamente no debes perderte."}
              </p>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-6">
              {attractions.map((item, i) => (
                <ScrollReveal key={i}>
                  <div className="bg-card rounded-xl border border-warm-border p-6 h-full">
                    <div className="flex items-start gap-3 mb-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </span>
                      <h3 className="font-serif text-lg leading-snug">{item.name}</h3>
                    </div>
                    <p className="text-warm-muted font-light text-sm leading-relaxed mb-3">
                      {item.desc}
                    </p>
                    <p className="text-xs text-secondary border-t border-warm-border pt-3">
                      💡 {item.tip}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 1-Day Itinerary ── */}
        <section
          className="px-6 md:px-12 py-16"
          aria-labelledby="itinerary-1day-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Itinerary" : "Itinerario"}
              </p>
              <h2
                id="itinerary-1day-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-2"
              >
                {isEN
                  ? "1-Day Itinerary in the Colonial Zone"
                  : "Itinerario de 1 Día en la Zona Colonial"}
              </h2>
              <p className="text-warm-muted font-light mb-10">
                {isEN
                  ? "The perfect way to see the highlights without rushing."
                  : "La manera perfecta de ver lo esencial sin correr."}
              </p>
            </ScrollReveal>

            <div className="space-y-0">
              {(isEN
                ? [
                    {
                      time: "8:00 AM",
                      label: "Morning",
                      title: "Cathedral & Parque Colón",
                      desc: "Start at the Cathedral of Santa María la Menor before the crowds arrive. Walk to Parque Colón and enjoy a traditional Dominican breakfast at a nearby café (mangú con los tres golpes).",
                    },
                    {
                      time: "10:00 AM",
                      label: "Late Morning",
                      title: "Alcázar de Colón",
                      desc: "Visit the Viceroy's palace. Tour the 22 rooms with original 16th-century furniture and admire the views over Plaza de España from the loggia.",
                    },
                    {
                      time: "12:30 PM",
                      label: "Lunch",
                      title: "Jalao or La Atarazana",
                      desc: "Try authentic Dominican cuisine — sancocho, tostones, and fresh tropical juices. Both restaurants are within walking distance.",
                    },
                    {
                      time: "2:00 PM",
                      label: "Afternoon",
                      title: "Fortaleza Ozama & Las Damas",
                      desc: "Climb the Tower of Homage for panoramic river views. Then stroll along Calle Las Damas — the oldest street in the Americas.",
                    },
                    {
                      time: "4:30 PM",
                      label: "Late Afternoon",
                      title: "National Pantheon & El Conde",
                      desc: "Visit the National Pantheon, then explore Calle El Conde for handicrafts, local art and a freshly squeezed juice.",
                    },
                    {
                      time: "7:00 PM",
                      label: "Evening",
                      title: "Dinner at Plaza de España",
                      desc: "Dine at one of the terrace restaurants overlooking the Ozama River. Stay for live merengue or bachata music as the plaza fills with locals.",
                    },
                  ]
                : [
                    {
                      time: "8:00 h",
                      label: "Mañana",
                      title: "Catedral y Parque Colón",
                      desc: "Comienza en la Catedral Primada antes de que lleguen las multitudes. Luego, desayuna en un café cercano: mangú con los tres golpes, el desayuno dominicano por excelencia.",
                    },
                    {
                      time: "10:00 h",
                      label: "Media Mañana",
                      title: "Alcázar de Colón",
                      desc: "Visita el palacio del virrey con sus 22 salas de mobiliario original del siglo XVI y vistas privilegiadas sobre la Plaza de España.",
                    },
                    {
                      time: "12:30 h",
                      label: "Almuerzo",
                      title: "Jalao o La Atarazana",
                      desc: "Prueba la cocina criolla dominicana auténtica: sancocho, tostones, y jugos tropicales naturales. Ambos restaurantes están a poca distancia.",
                    },
                    {
                      time: "14:00 h",
                      label: "Tarde",
                      title: "Fortaleza Ozama y Calle Las Damas",
                      desc: "Sube a la Torre del Homenaje para vistas panorámicas al río. Después pasea por Calle Las Damas, la calle más antigua del continente americano.",
                    },
                    {
                      time: "16:30 h",
                      label: "Tarde Segunda",
                      title: "Panteón Nacional y El Conde",
                      desc: "Visita el Panteón Nacional con su guardia de honor. Luego recorre El Conde en busca de artesanías locales y un jugo fresco.",
                    },
                    {
                      time: "19:00 h",
                      label: "Noche",
                      title: "Cena en Plaza de España",
                      desc: "Cena en las terrazas con vista al río Ozama. Quédate para disfrutar de música en vivo de merengue o bachata mientras la plaza cobra vida.",
                    },
                  ]
              ).map((step, i) => (
                <ScrollReveal key={i}>
                  <div className="flex gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-primary bg-card flex items-center justify-center text-xs font-medium text-primary">
                        {i + 1}
                      </div>
                      {i < 5 && <div className="w-px flex-1 bg-warm-border mt-2" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-1">
                        {step.time} · {step.label}
                      </p>
                      <h3 className="font-serif text-lg mb-2">{step.title}</h3>
                      <p className="text-warm-muted font-light text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2-Day Itinerary ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="itinerary-2day-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Extended Visit" : "Visita Extendida"}
              </p>
              <h2
                id="itinerary-2day-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-10"
              >
                {isEN
                  ? "2-Day Itinerary in the Colonial Zone"
                  : "Itinerario de 2 Días en la Zona Colonial"}
              </h2>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8">
              <ScrollReveal>
                <div className="bg-card rounded-xl border border-warm-border p-6">
                  <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-2">
                    {isEN ? "Day 1" : "Día 1"}
                  </p>
                  <h3 className="font-serif text-xl mb-4">
                    {isEN ? "History & Architecture" : "Historia y Arquitectura"}
                  </h3>
                  <ul className="space-y-3 text-sm text-warm-muted font-light">
                    {(isEN
                      ? [
                          "Cathedral of Santa María la Menor",
                          "Parque Colón & traditional breakfast",
                          "Alcázar de Colón",
                          "Lunch at La Atarazana",
                          "Fortaleza Ozama",
                          "Calle Las Damas & National Pantheon",
                          "Dinner at Plaza de España with live music",
                        ]
                      : [
                          "Catedral Primada de América",
                          "Parque Colón y desayuno criollo",
                          "Alcázar de Colón",
                          "Almuerzo en La Atarazana",
                          "Fortaleza Ozama",
                          "Calle Las Damas y Panteón Nacional",
                          "Cena en Plaza de España con música en vivo",
                        ]
                    ).map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-bold mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div className="bg-card rounded-xl border border-warm-border p-6">
                  <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-2">
                    {isEN ? "Day 2" : "Día 2"}
                  </p>
                  <h3 className="font-serif text-xl mb-4">
                    {isEN ? "Culture & Gastronomy" : "Cultura y Gastronomía"}
                  </h3>
                  <ul className="space-y-3 text-sm text-warm-muted font-light">
                    {(isEN
                      ? [
                          "Museum of the Royal Houses",
                          "Ruins of San Francisco",
                          "Artisan market on Calle El Conde",
                          "Lunch at Pat'e Palo (Dominican-European fusion)",
                          "Malecón boardwalk walk",
                          "Güibia Beach sunset (25 min walk)",
                          "Night out: live bachata in the Colonial Zone",
                        ]
                      : [
                          "Museo de las Casas Reales",
                          "Ruinas de San Francisco",
                          "Mercado artesanal en El Conde",
                          "Almuerzo en Pat'e Palo (fusión dominicano-europeo)",
                          "Paseo por el Malecón",
                          "Atardecer en Playa Güibia (25 min caminando)",
                          "Noche: bachata en vivo en la Zona Colonial",
                        ]
                    ).map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary font-bold mt-0.5">·</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* ── Full Bleed Image 2 — natural ratio ── */}
        <div className="w-full">
          <img
            src="https://res.cloudinary.com/dspogotur/image/upload/v1776784040/Casa_la_Maria_zona_colonial_santo_domingo.webp"
            alt={
              isEN
                ? "Casa La Maria — boutique apartment in the Colonial Zone, Santo Domingo"
                : "Casa La Maria — apartamento boutique en la Zona Colonial de Santo Domingo"
            }
            width={2400}
            height={1600}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* ── Where to Stay — CTA ── */}
        <section
          className="px-6 md:px-12 py-20"
          aria-labelledby="stay-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="bg-card border border-warm-border rounded-2xl p-10 md:p-14 text-center">
                <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-4">
                  {isEN ? "Where to Stay" : "Dónde Alojarse"}
                </p>
                <h2
                  id="stay-heading"
                  className="font-serif text-2xl md:text-[36px] tracking-tight mb-4"
                >
                  {isEN
                    ? "Stay Inside the Colonial Zone"
                    : "Alójate en el Corazón de la Zona Colonial"}
                </h2>
                <p className="text-warm-muted font-light leading-relaxed max-w-[560px] mx-auto mb-8">
                  {isEN
                    ? "Casa La Maria is a boutique apartment on Parmenio Troncoso 4 — a 16th-century restored building steps from every landmark on this list. Wake up in history."
                    : "Casa La Maria es un apartamento boutique en Parmenio Troncoso 4 — un edificio histórico restaurado del siglo XVI a pasos de cada atractivo de esta guía. Despierta en la historia."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href={`/${locale}/contacto`}
                    className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-8 py-3 rounded-lg font-medium text-sm"
                  >
                    {isEN ? "inquire about availability" : "consultar disponibilidad"}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/${locale}#propiedad`}
                    className="inline-flex items-center justify-center gap-2 border border-warm-border hover:bg-muted transition-colors px-8 py-3 rounded-lg font-medium text-sm"
                  >
                    {isEN ? "view the apartment" : "ver el apartamento"}
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Side-by-Side Images (desktop), stacked (mobile) — same ratio ── */}
        <div className="w-full px-6 md:px-12 pb-4">
          <div className="max-w-[900px] mx-auto grid md:grid-cols-2 gap-4">
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://res.cloudinary.com/dspogotur/image/upload/v1776784038/Casa_la_Maria_zona_colonial_santo_domingo_hotel.webp"
                alt={
                  isEN
                    ? "Interior of Casa La Maria boutique apartment — Colonial Zone Santo Domingo"
                    : "Interior del apartamento boutique Casa La Maria — Zona Colonial Santo Domingo"
                }
                className="w-full h-auto block aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
            <div className="overflow-hidden rounded-xl">
              <img
                src="https://res.cloudinary.com/dspogotur/image/upload/v1776784036/Casa_la_Maria_zona_colonial.webp"
                alt={
                  isEN
                    ? "Exterior view — Casa La Maria in the Zona Colonial, Santo Domingo"
                    : "Vista exterior de Casa La Maria en la Zona Colonial, Santo Domingo"
                }
                className="w-full h-auto block aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>

        {/* ── Restaurants ── */}
        <section
          className="px-6 md:px-12 py-16"
          aria-labelledby="food-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <Utensils className="w-5 h-5 text-secondary" />
                <p className="text-xs font-medium tracking-widest uppercase text-secondary">
                  {isEN ? "Food & Drink" : "Gastronomía"}
                </p>
              </div>
              <h2
                id="food-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-2"
              >
                {isEN
                  ? "Best Restaurants in the Colonial Zone"
                  : "Mejores Restaurantes en la Zona Colonial"}
              </h2>
              <p className="text-warm-muted font-light mb-10">
                {isEN
                  ? "All within walking distance of Casa La Maria."
                  : "Todos a poca distancia caminando de Casa La Maria."}
              </p>
            </ScrollReveal>

            <div className="space-y-5">
              {(isEN
                ? [
                    {
                      name: "Jalao",
                      distance: "1 min",
                      type: "Dominican creative cuisine",
                      desc: "The most iconic stop in the Colonial Zone. Traditional Dominican recipes elevated with modern technique. Don't miss the mangú tower and the mamajuana.",
                      price: "$$",
                    },
                    {
                      name: "La Atarazana",
                      distance: "3 min",
                      type: "Seafood & Dominican",
                      desc: "In a beautifully restored colonial warehouse beside the Ozama River. Famous for fried fish with tostones. Rustic and authentic atmosphere.",
                      price: "$$",
                    },
                    {
                      name: "Pat'e Palo",
                      distance: "5 min",
                      type: "Dominican-European Fusion",
                      desc: "The first European restaurant in the Colonial Zone, now a classic. French techniques meet Caribbean ingredients. Reservation recommended on weekends.",
                      price: "$$$",
                    },
                    {
                      name: "El Convento",
                      distance: "2 min",
                      type: "Café & Bakery",
                      desc: "Boutique café inside a former colonial convent. Organic Dominican coffee and handmade pastries. The perfect breakfast spot before your morning tour.",
                      price: "$",
                    },
                    {
                      name: "Mesón de Bari",
                      distance: "5 min",
                      type: "Mediterranean Caribbean",
                      desc: "Candlelit colonial courtyard with Mediterranean-Caribbean cuisine. The shrimp risotto is exceptional. Perfect for a romantic evening dinner.",
                      price: "$$$",
                    },
                  ]
                : [
                    {
                      name: "Jalao",
                      distance: "1 min",
                      type: "Cocina dominicana creativa",
                      desc: "La parada más icónica de la Zona Colonial. Recetas dominicanas tradicionales elevadas con técnica moderna. No te pierdas la torre de mangú y la mamajuana.",
                      price: "$$",
                    },
                    {
                      name: "La Atarazana",
                      distance: "3 min",
                      type: "Mariscos y criolla",
                      desc: "En una bodega colonial restaurada junto al río Ozama. Famoso por su pescado frito con tostones. Ambiente rústico y auténtico.",
                      price: "$$",
                    },
                    {
                      name: "Pat'e Palo",
                      distance: "5 min",
                      type: "Fusión dominicano-europeo",
                      desc: "El primer restaurante europeo de la Zona Colonial, hoy ya un clásico. Técnicas francesas con ingredientes caribeños. Reserva recomendada los fines de semana.",
                      price: "$$$",
                    },
                    {
                      name: "El Convento",
                      distance: "2 min",
                      type: "Café y Repostería",
                      desc: "Cafetería boutique en un antiguo convento colonial. Café orgánico dominicano y pasteles artesanales. El lugar perfecto para desayunar antes del recorrido.",
                      price: "$",
                    },
                    {
                      name: "Mesón de Bari",
                      distance: "5 min",
                      type: "Mediterráneo caribeño",
                      desc: "Patio colonial iluminado con velas y cocina mediterráneo-caribeña. El risotto de camarones es excepcional. Perfecto para una cena romántica.",
                      price: "$$$",
                    },
                  ]
              ).map((r, i) => (
                <ScrollReveal key={i}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 bg-card border border-warm-border rounded-xl p-5">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif text-lg">{r.name}</h3>
                        <span className="text-[10px] font-medium tracking-wider uppercase text-secondary bg-muted px-2 py-0.5 rounded-full">
                          {r.type}
                        </span>
                      </div>
                      <p className="text-warm-muted font-light text-sm leading-relaxed">
                        {r.desc}
                      </p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 text-xs text-secondary flex-shrink-0">
                      <span className="font-medium text-primary">{r.price}</span>
                      <span>{r.distance}</span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Safety & Tips ── */}
        <section
          className="px-6 md:px-12 py-16 bg-muted"
          aria-labelledby="tips-heading"
        >
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-3">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <p className="text-xs font-medium tracking-widest uppercase text-secondary">
                  {isEN ? "Safety & Tips" : "Seguridad y Consejos"}
                </p>
              </div>
              <h2
                id="tips-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-10"
              >
                {isEN
                  ? "Practical Tips for Visiting"
                  : "Consejos Prácticos para tu Visita"}
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
              {(isEN
                ? [
                    {
                      icon: "🕶️",
                      title: "Sun protection",
                      desc: "Apply SPF 50 sunscreen and bring a hat. The Caribbean sun is intense year-round, especially on cobblestone streets.",
                    },
                    {
                      icon: "💧",
                      title: "Hydration",
                      desc: "Carry water or buy coconut water from street vendors. Avoid tap water and opt for sealed bottles.",
                    },
                    {
                      icon: "💵",
                      title: "Cash",
                      desc: "Bring Dominican pesos. Many small establishments don't accept cards. ATMs are available on Calle El Conde.",
                    },
                    {
                      icon: "🏥",
                      title: "Safety",
                      desc: "Zona Colonial is safe for tourists. Don't flash expensive jewelry or cameras. Use licensed taxi apps (Uber, InDriver) at night.",
                    },
                    {
                      icon: "🌡️",
                      title: "Best time",
                      desc: "Visit November–April for cooler, drier weather. July–August is hot but less crowded. Avoid midday between 12–3 PM.",
                    },
                    {
                      icon: "👟",
                      title: "Footwear",
                      desc: "Wear comfortable walking shoes. Cobblestones can be uneven and slippery after rain.",
                    },
                  ]
                : [
                    {
                      icon: "🕶️",
                      title: "Protector solar",
                      desc: "Usa protector solar SPF 50 y trae sombrero. El sol caribeño es intenso todo el año, especialmente en las calles adoquinadas.",
                    },
                    {
                      icon: "💧",
                      title: "Hidratación",
                      desc: "Lleva agua o compra agua de coco en los puestos ambulantes. Evita el agua del grifo y elige siempre botellas selladas.",
                    },
                    {
                      icon: "💵",
                      title: "Efectivo",
                      desc: "Lleva pesos dominicanos. Muchos establecimientos pequeños no aceptan tarjeta. Hay cajeros en Calle El Conde.",
                    },
                    {
                      icon: "🏥",
                      title: "Seguridad",
                      desc: "La Zona Colonial es segura para turistas. No muestres joyas o equipos caros. Usa apps de taxi (Uber, InDriver) de noche.",
                    },
                    {
                      icon: "🌡️",
                      title: "Mejor época",
                      desc: "Visita entre noviembre y abril para clima más fresco y seco. Julio–agosto es caluroso pero menos concurrido. Evita salir entre 12–15 h.",
                    },
                    {
                      icon: "👟",
                      title: "Calzado",
                      desc: "Usa zapatos cómodos para caminar. Los adoquines pueden ser irregulares y resbaladizos después de la lluvia.",
                    },
                  ]
              ).map((tip, i) => (
                <ScrollReveal key={i}>
                  <div className="bg-card rounded-xl border border-warm-border p-5">
                    <p className="text-2xl mb-3">{tip.icon}</p>
                    <h3 className="font-medium mb-2">{tip.title}</h3>
                    <p className="text-warm-muted font-light text-sm leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Getting There ── */}
        <section className="px-6 md:px-12 py-16" aria-labelledby="getting-there-heading">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Getting There" : "Cómo Llegar"}
              </p>
              <h2
                id="getting-there-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-8"
              >
                {isEN
                  ? "How to Get to the Colonial Zone"
                  : "Cómo Llegar a la Zona Colonial"}
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 gap-6">
              {(isEN
                ? [
                    {
                      from: "Las Américas Airport (SDQ)",
                      detail: "30–35 min by taxi or Uber. Approximately $25–35 USD. The most common arrival point for international travelers.",
                    },
                    {
                      from: "Punta Cana",
                      detail: "~2.5 hours by car along the Autopista del Este. Organized full-day tours are also available from all major resorts.",
                    },
                    {
                      from: "Puerto Plata / North Coast",
                      detail: "Approximately 4 hours by car along the Autopista Duarte. Domestic flights to SDQ are also available.",
                    },
                    {
                      from: "Within Santo Domingo",
                      detail: "Use Uber or InDriver (safe and reliable). Avoid unofficial taxis. Public minibuses (conchos) also serve the area.",
                    },
                  ]
                : [
                    {
                      from: "Aeropuerto Las Américas (SDQ)",
                      detail: "30–35 min en taxi o Uber. Aproximadamente $25–35 USD. El punto de llegada más común para viajeros internacionales.",
                    },
                    {
                      from: "Punta Cana",
                      detail: "~2 h 30 min en coche por la Autopista del Este. También hay tours organizados de día completo disponibles desde los resorts.",
                    },
                    {
                      from: "Puerto Plata / Costa Norte",
                      detail: "Aproximadamente 4 horas en coche por la Autopista Duarte. También hay vuelos domésticos disponibles a SDQ.",
                    },
                    {
                      from: "Desde Santo Domingo",
                      detail: "Usa Uber o InDriver (seguros y confiables). Evita taxis no oficiales. Los autobuses públicos (conchos) también circulan por la zona.",
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

        {/* ── Final Full-Bleed Image ── */}
        <div className="w-full">
          <img
            src="https://res.cloudinary.com/dspogotur/image/upload/v1776784036/Casa_la_Maria_zona_colonial.webp"
            alt={
              isEN
                ? "Casa La Maria — colonial architecture in the heart of Santo Domingo"
                : "Casa La Maria — arquitectura colonial en el corazón de Santo Domingo"
            }
            width={2400}
            height={1600}
            className="w-full h-auto block"
            loading="lazy"
          />
        </div>

        {/* ── Related Guides ── */}
        <section className="px-6 md:px-12 py-16 bg-muted" aria-labelledby="related-heading">
          <div className="max-w-[900px] mx-auto">
            <ScrollReveal>
              <p className="text-xs font-medium tracking-widest uppercase text-secondary mb-3">
                {isEN ? "Keep Exploring" : "Sigue Explorando"}
              </p>
              <h2
                id="related-heading"
                className="font-serif text-2xl md:text-3xl tracking-tight mb-8"
              >
                {isEN ? "Related Guides" : "Guías Relacionadas"}
              </h2>
            </ScrollReveal>

            <div className="grid sm:grid-cols-3 gap-5">
              {(isEN
                ? [
                    {
                      href: `/${locale}#terraza`,
                      label: "The Terrace",
                      desc: "Relax on our private rooftop terrace with views over the Colonial Zone.",
                    },
                    {
                      href: `/${locale}#faq`,
                      label: "Guest FAQ",
                      desc: "Answers to the most common questions from guests staying at Casa La Maria.",
                    },
                    {
                      href: `/${locale}/contacto`,
                      label: "Contact Us",
                      desc: "Ask about availability, local tips, or arrange a custom experience.",
                    },
                  ]
                : [
                    {
                      href: `/${locale}#terraza`,
                      label: "La Terraza",
                      desc: "Descansa en nuestra terraza privada con vistas sobre la Zona Colonial.",
                    },
                    {
                      href: `/${locale}#faq`,
                      label: "Preguntas Frecuentes",
                      desc: "Respuestas a las preguntas más comunes de los huéspedes de Casa La Maria.",
                    },
                    {
                      href: `/${locale}/contacto`,
                      label: "Contáctanos",
                      desc: "Pregunta sobre disponibilidad, consejos locales o una experiencia personalizada.",
                    },
                  ]
              ).map((item, i) => (
                <ScrollReveal key={i}>
                  <Link
                    href={item.href}
                    className="block bg-card border border-warm-border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <h3 className="font-serif text-base mb-2 group-hover:text-primary transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-warm-muted font-light text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          className="px-6 md:px-12 py-16"
          aria-labelledby="faq-heading"
        >
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
                  ? "Frequently Asked Questions"
                  : "Preguntas Frecuentes"}
              </h2>
            </ScrollReveal>

            <div className="space-y-5">
              {faqs.map((item, i) => (
                <ScrollReveal key={i}>
                  <div className="border border-warm-border rounded-xl p-6">
                    <h3 className="font-serif text-base md:text-lg mb-3">{item.q}</h3>
                    <p className="text-warm-muted font-light text-sm leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* ── Author / Updated ── */}
            <ScrollReveal>
              <div className="mt-12 pt-8 border-t border-warm-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <p className="text-xs text-secondary">
                  {isEN ? "Written by" : "Escrito por"}{" "}
                  <span className="font-medium text-primary">Casa La Maria Zona Colonial</span>
                </p>
                <p className="text-xs text-secondary">
                  {isEN ? "Last updated:" : "Última actualización:"}{" "}
                  <time dateTime="2026-04-21">
                    {isEN ? "April 21, 2026" : "21 de abril de 2026"}
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
