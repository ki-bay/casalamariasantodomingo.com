import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type Props = { params: Promise<{ locale: string }> };

const SLUG = "where-to-stay-near-calle-las-damas";
const COVER = "https://res.cloudinary.com/dspogotur/image/upload/v1776784036/Casa_la_Maria_zona_colonial.webp";
const PUBLISHED = "2026-05-05";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEN = locale === "en";
  const SITE = "https://casalamariazonacolonial.com";
  const canonical = isEN ? `${SITE}/en/blog/${SLUG}` : `${SITE}/es/blog/${SLUG}`;
  return {
    title: isEN
      ? "Where to Stay Near Calle Las Damas (Santo Domingo, 2026)"
      : "Dónde Quedarse Cerca de Calle Las Damas (Santo Domingo, 2026)",
    description: isEN
      ? "5-minute-walk radius from Calle Las Damas — the oldest paved street in the Americas. Hotels, boutique apartments and the best-rated stays for visitors who want to wake up in the heart of the Colonial Zone."
      : "Radio de 5 minutos a pie desde Calle Las Damas — la calle pavimentada más antigua de América. Hoteles, apartamentos boutique y las mejores opciones para despertar en el corazón de la Zona Colonial.",
    alternates: {
      canonical,
      languages: { es: `${SITE}/es/blog/${SLUG}`, en: `${SITE}/en/blog/${SLUG}` },
    },
    openGraph: {
      type: "article",
      title: isEN ? "Where to Stay Near Calle Las Damas" : "Dónde Quedarse Cerca de Calle Las Damas",
      description: isEN
        ? "5-minute-walk radius guide for travellers who want the historic core."
        : "Guía del radio de 5 minutos a pie para viajeros que quieren el casco histórico.",
      url: canonical,
      siteName: "Casa La Maria",
      locale: isEN ? "en_US" : "es_DO",
      publishedTime: PUBLISHED,
      images: [{ url: COVER, alt: isEN ? "Calle Las Damas — Santo Domingo Colonial Zone" : "Calle Las Damas — Zona Colonial Santo Domingo" }],
    },
    twitter: { card: "summary_large_image", images: [COVER] },
    robots: { index: true, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isEN = locale === "en";
  const back = isEN ? "/en/blog" : "/es/blog";
  const aptHref = isEN ? "/en/apartments" : "/es/apartamentos";
  const whyDirect = isEN ? "/en/why-book-direct" : "/es/por-que-reservar-directo";

  return (
    <main className="min-h-screen bg-background text-foreground relative z-10">
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 md:px-8 pt-32 pb-20">
        <Link href={back} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> {isEN ? "All articles" : "Todos los artículos"}
        </Link>

        <div className="text-xs font-semibold tracking-[0.2em] uppercase text-accent mb-3">
          {isEN ? "Local guide" : "Guía local"}
        </div>
        <h1 className="font-serif text-3xl md:text-[42px] leading-tight tracking-tight mb-5">
          {isEN ? "Where to stay near Calle Las Damas" : "Dónde quedarse cerca de Calle Las Damas"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isEN ? "Updated May 2026 · 6 min read" : "Actualizado mayo 2026 · 6 min lectura"}
        </p>

        <div className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-10">
          <Image src={COVER} alt={isEN ? "Calle Las Damas in the Colonial Zone of Santo Domingo" : "Calle Las Damas en la Zona Colonial de Santo Domingo"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none">
          {isEN ? (
            <>
              <p className="text-lg leading-relaxed">
                Calle Las Damas — the oldest paved street in the Americas,
                built in 1502 — is the most photographed corner of Santo
                Domingo for a reason. Stay within a 5-minute walk and you'll
                be inside three quarters of the city's UNESCO sites without
                ever opening a map app.
              </p>

              <h2>Why this radius matters</h2>
              <p>
                Once you're more than 10 minutes from Calle Las Damas, the
                Colonial Zone vibe thins out. Stay too far north and you're
                near the Zona Colonial fringe, where parking and chain
                businesses creep in. Stay too far south and you cross the
                Malecón into a different neighbourhood. The 5-minute radius
                from Calle Las Damas is the sweet spot.
              </p>

              <h2>What's inside the radius (5-min walk)</h2>
              <ul>
                <li><strong>Catedral Primada de América</strong> — the first cathedral built in the Americas (1540)</li>
                <li><strong>Parque Colón</strong> — the central plaza, statue of Columbus, café terraces</li>
                <li><strong>Alcázar de Colón</strong> — Diego Columbus's residence, now a museum</li>
                <li><strong>Plaza España</strong> — restaurant terraces facing the river</li>
                <li><strong>Panteón Nacional</strong> — Dominican heroes' mausoleum, daily honor guard</li>
                <li><strong>Museo de las Casas Reales</strong> — colonial-era courthouse turned museum</li>
                <li><strong>Fortaleza Ozama</strong> — 1502 fortress at the southern end of Las Damas</li>
              </ul>
              <p>
                Restaurants in this radius worth queueing for: La Cucaracha,
                El Conde Restaurant, Mesón D'Bari, Pat'e Palo, Café Bellini.
              </p>

              <h2>Stay options inside the radius</h2>
              <p><strong>Boutique hotels:</strong> Hodelpa Nicolas de Ovando (5-star, in a 16th-century governor's house), Casas del XVI (luxury collection of restored colonial homes), Hotel Doña Elvira.</p>
              <p><strong>Direct-booking boutique apartments:</strong> Casa La Maria — five units on Parmenio Troncoso 4, 5 min from Calle Las Damas, kitchen + balcony + AC + WiFi, from $89 USD/night.</p>
              <p><strong>Airbnb:</strong> Several listings in the radius, but expect to pay 14–18% in platform fees on top of the room rate.</p>

              <h2>Walking-distance reference points (from Calle Las Damas)</h2>
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed">
                Calle Las Damas — la calle pavimentada más antigua de América,
                construida en 1502 — es la esquina más fotografiada de Santo
                Domingo por algo. Hospédate en un radio de 5 minutos a pie y
                estarás dentro de tres cuartas partes de los sitios UNESCO
                de la ciudad sin abrir un mapa.
              </p>

              <h2>Por qué importa este radio</h2>
              <p>
                Pasados los 10 minutos a pie desde Calle Las Damas, el
                ambiente de la Zona Colonial se diluye. Muy al norte ya
                estás en los límites donde aparecen parqueos y cadenas. Muy
                al sur cruzas el Malecón y entras en otro barrio. El radio
                de 5 minutos desde Calle Las Damas es el punto dulce.
              </p>

              <h2>Qué hay dentro del radio (5 min a pie)</h2>
              <ul>
                <li><strong>Catedral Primada de América</strong> — la primera catedral construida en las Américas (1540)</li>
                <li><strong>Parque Colón</strong> — la plaza central, estatua de Colón, terrazas de café</li>
                <li><strong>Alcázar de Colón</strong> — la residencia de Diego Colón, ahora museo</li>
                <li><strong>Plaza España</strong> — terrazas de restaurantes mirando al río</li>
                <li><strong>Panteón Nacional</strong> — mausoleo de los héroes dominicanos, guardia de honor diaria</li>
                <li><strong>Museo de las Casas Reales</strong> — antigua corte colonial reconvertida en museo</li>
                <li><strong>Fortaleza Ozama</strong> — fortaleza de 1502 al final sur de Las Damas</li>
              </ul>
              <p>
                Restaurantes del radio que vale la pena hacer fila: La
                Cucaracha, El Conde Restaurant, Mesón D'Bari, Pat'e Palo,
                Café Bellini.
              </p>

              <h2>Opciones de hospedaje dentro del radio</h2>
              <p><strong>Hoteles boutique:</strong> Hodelpa Nicolas de Ovando (5 estrellas, en una casa de gobernador del siglo XVI), Casas del XVI (colección de lujo de casas coloniales restauradas), Hotel Doña Elvira.</p>
              <p><strong>Apartamentos boutique de reserva directa:</strong> Casa La Maria — cinco unidades en Parmenio Troncoso 4, a 5 min de Calle Las Damas, cocina + balcón + AC + WiFi, desde $89 USD/noche.</p>
              <p><strong>Airbnb:</strong> Varias opciones en el radio, pero esperas pagar 14–18% en comisión de plataforma sobre la tarifa de la habitación.</p>

              <h2>Distancias caminando (desde Calle Las Damas)</h2>
            </>
          )}

          <div className="not-prose my-6 rounded-2xl border border-border overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="text-left py-3 px-4">{isEN ? "Place" : "Lugar"}</th>
                  <th className="text-right py-3 px-4">{isEN ? "Walking time" : "Tiempo a pie"}</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {[
                  ["Casa La Maria (Parmenio Troncoso 4)", "5 min"],
                  [isEN ? "Catedral Primada de América" : "Catedral Primada de América", "3 min"],
                  ["Parque Colón", "3 min"],
                  ["Alcázar de Colón", "2 min"],
                  ["Plaza España", "1 min"],
                  ["Fortaleza Ozama", "5 min"],
                  [isEN ? "Panteón Nacional" : "Panteón Nacional", "4 min"],
                  ["Plaza Bellini", "6 min"],
                  [isEN ? "Malecón (riverfront)" : "Malecón", "10 min"],
                  [isEN ? "Playa Güibia" : "Playa Güibia", isEN ? "25 min walk / 5 min taxi" : "25 min a pie / 5 min taxi"],
                ].map(([place, time], i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-3 px-4 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      <span>{place}</span>
                    </td>
                    <td className="py-3 px-4 text-right text-foreground/90">{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEN ? (
            <>
              <h2>One-day plan from this address</h2>
              <ol>
                <li><strong>9:00</strong> — Coffee at Café Bellini (Plaza Bellini)</li>
                <li><strong>9:45</strong> — Walk Calle Las Damas south to Fortaleza Ozama. Buy ticket, climb the tower.</li>
                <li><strong>11:00</strong> — Catedral Primada (entrance ~$5 USD, audio guide included)</li>
                <li><strong>12:30</strong> — Lunch at Mesón D'Bari (rice, beans, plantains — Dominican classics)</li>
                <li><strong>14:00</strong> — Alcázar de Colón + Plaza España terrace</li>
                <li><strong>16:00</strong> — Browse boutiques on Calle El Conde</li>
                <li><strong>18:30</strong> — Sunset cocktail at Pat'e Palo (American Bar — opened 1505)</li>
                <li><strong>20:00</strong> — Dinner at La Cucaracha or El Conde Restaurant</li>
              </ol>
              <p>
                Total walking distance for the whole day: under 4 km. Zero
                taxis required. That's the point of staying inside the radius.
              </p>
            </>
          ) : (
            <>
              <h2>Plan de un día desde esta dirección</h2>
              <ol>
                <li><strong>9:00</strong> — Café en Café Bellini (Plaza Bellini)</li>
                <li><strong>9:45</strong> — Calle Las Damas hacia el sur hasta Fortaleza Ozama. Compra el ticket, sube a la torre.</li>
                <li><strong>11:00</strong> — Catedral Primada (entrada ~$5 USD, audioguía incluida)</li>
                <li><strong>12:30</strong> — Almuerzo en Mesón D'Bari (arroz, habichuelas, plátano — clásicos dominicanos)</li>
                <li><strong>14:00</strong> — Alcázar de Colón + terraza Plaza España</li>
                <li><strong>16:00</strong> — Boutiques en la Calle El Conde</li>
                <li><strong>18:30</strong> — Cóctel al atardecer en Pat'e Palo (American Bar — abrió en 1505)</li>
                <li><strong>20:00</strong> — Cena en La Cucaracha o El Conde Restaurant</li>
              </ol>
              <p>
                Distancia total caminada en todo el día: menos de 4 km.
                Cero taxis. Ese es el punto de quedarte dentro del radio.
              </p>
            </>
          )}
        </div>

        <div className="not-prose mt-12 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/20 p-8 text-center">
          <h3 className="font-serif text-xl mb-3">
            {isEN ? "Stay 5 min from Calle Las Damas" : "Hospédate a 5 min de Calle Las Damas"}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {isEN ? "Casa La Maria — five boutique apartments on Parmenio Troncoso 4, from $89 USD/night, no platform fees." : "Casa La Maria — cinco apartamentos boutique en Parmenio Troncoso 4, desde $89 USD/noche, sin comisiones de plataforma."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href={aptHref} className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90">
              {isEN ? "See apartments" : "Ver apartamentos"} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href={whyDirect} className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
              {isEN ? "Why book direct" : "Por qué reservar directo"}
            </Link>
          </div>
        </div>
      </article>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BlogPosting",
                "@id": `https://casalamariazonacolonial.com/${locale}/blog/${SLUG}#article`,
                headline: isEN
                  ? "Where to Stay Near Calle Las Damas (Santo Domingo, 2026)"
                  : "Dónde Quedarse Cerca de Calle Las Damas (Santo Domingo, 2026)",
                description: isEN
                  ? "5-minute-walk radius guide from Calle Las Damas — hotels, apartments, walking distances and a 1-day plan."
                  : "Guía del radio de 5 minutos a pie desde Calle Las Damas — hoteles, apartamentos, distancias y plan de 1 día.",
                image: [COVER],
                datePublished: PUBLISHED,
                dateModified: PUBLISHED,
                author: { "@type": "Organization", name: "Casa La Maria", url: "https://casalamariazonacolonial.com" },
                publisher: { "@id": "https://casalamariazonacolonial.com/#business" },
                mainEntityOfPage: `https://casalamariazonacolonial.com/${locale}/blog/${SLUG}`,
                inLanguage: isEN ? "en" : "es",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: isEN ? "Home" : "Inicio", item: `https://casalamariazonacolonial.com/${locale}` },
                  { "@type": "ListItem", position: 2, name: "Blog", item: `https://casalamariazonacolonial.com/${locale}/blog` },
                  { "@type": "ListItem", position: 3, name: isEN ? "Where to stay near Calle Las Damas" : "Dónde quedarse cerca de Calle Las Damas", item: `https://casalamariazonacolonial.com/${locale}/blog/${SLUG}` },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
