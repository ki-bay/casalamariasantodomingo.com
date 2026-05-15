import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type Props = { params: Promise<{ locale: string }> };

const SLUG = "zona-colonial-vs-piantini";
const COVER = "https://res.cloudinary.com/dspogotur/image/upload/v1776784038/Casa_la_Maria_zona_colonial_santo_domingo_hotel.webp";
const PUBLISHED = "2026-05-05";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEN = locale === "en";
  const SITE = "https://casalamariazonacolonial.com";
  const canonical = isEN ? `${SITE}/en/blog/${SLUG}` : `${SITE}/es/blog/${SLUG}`;
  return {
    title: isEN
      ? "Zona Colonial vs Piantini: Where to Stay in Santo Domingo (2026)"
      : "Zona Colonial vs Piantini: Dónde Quedarse en Santo Domingo (2026)",
    description: isEN
      ? "Side-by-side guide for tourists choosing a neighbourhood in Santo Domingo: Colonial Zone (history, walkability, UNESCO) vs Piantini (modern, malls, business). Pros, cons and a decision tree."
      : "Guía comparativa para turistas eligiendo barrio en Santo Domingo: Zona Colonial (historia, peatonal, UNESCO) vs Piantini (moderno, malls, negocios). Pros, contras y árbol de decisión.",
    alternates: {
      canonical,
      languages: {
        es: `${SITE}/es/blog/${SLUG}`,
        en: `${SITE}/en/blog/${SLUG}`,
      },
    },
    openGraph: {
      type: "article",
      title: isEN
        ? "Zona Colonial vs Piantini: Where to Stay in Santo Domingo"
        : "Zona Colonial vs Piantini: Dónde Quedarse en Santo Domingo",
      description: isEN
        ? "Pros, cons and a decision tree for picking your neighbourhood."
        : "Pros, contras y árbol de decisión para elegir barrio.",
      url: canonical,
      siteName: "Casa La Maria",
      locale: isEN ? "en_US" : "es_DO",
      publishedTime: PUBLISHED,
      images: [{ url: COVER, alt: isEN ? "Santo Domingo Colonial Zone aerial" : "Vista aérea Zona Colonial Santo Domingo" }],
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
          {isEN ? "Decision guide" : "Guía de decisión"}
        </div>
        <h1 className="font-serif text-3xl md:text-[42px] leading-tight tracking-tight mb-5">
          {isEN
            ? "Zona Colonial vs Piantini: where to stay in Santo Domingo"
            : "Zona Colonial vs Piantini: dónde quedarse en Santo Domingo"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isEN ? "Updated May 2026 · 8 min read" : "Actualizado mayo 2026 · 8 min lectura"}
        </p>

        <div className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-10">
          <Image src={COVER} alt={isEN ? "Santo Domingo Colonial Zone — UNESCO World Heritage Site" : "Zona Colonial Santo Domingo — Patrimonio UNESCO"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none">
          {isEN ? (
            <>
              <p className="text-lg leading-relaxed">
                Two neighbourhoods. Two completely different experiences. If
                you're booking a trip to Santo Domingo, this is the most
                important decision you'll make — and most travel guides skip it.
                Here's the honest comparison.
              </p>

              <h2>The short answer</h2>
              <ul>
                <li><strong>First-time visitor, sightseeing, walkable trip?</strong> → Zona Colonial</li>
                <li><strong>Business trip, modern malls, high-end dining, gym hotels?</strong> → Piantini</li>
                <li><strong>Both?</strong> Zona Colonial wins — Piantini is a 15-min Uber away anyway.</li>
              </ul>

              <h2>Zona Colonial</h2>
              <p>
                The oldest European-built neighbourhood in the Americas. UNESCO
                World Heritage Site. Pedestrian streets, coral-stone facades,
                the Catedral Primada, the Alcázar de Colón, Calle Las Damas.
                Restaurants spill out into plazas, live music drifts from cafés,
                and the entire core is walkable in 20 minutes.
              </p>
              <p><strong>Stay here if you want:</strong></p>
              <ul>
                <li>To wake up 5 minutes from the Catedral Primada</li>
                <li>Streets you can actually walk on (most of the historic core is car-free)</li>
                <li>Restaurants, cafés, art galleries, live music every block</li>
                <li>A neighbourhood with character, not chain-hotel uniformity</li>
              </ul>
              <p><strong>Trade-offs:</strong></p>
              <ul>
                <li>No mall — boutique shopping, not Zara</li>
                <li>Buildings are historic, not high-rise — fewer rooftop pools</li>
                <li>Some streets get loud on weekend evenings (live music venues)</li>
              </ul>

              <h2>Piantini</h2>
              <p>
                Santo Domingo's modern business district. High-rise condos,
                Blue Mall, Ágora Mall, embassies, corporate hotels, fine
                dining. Wide avenues, lots of cars, Uber everywhere. Feels
                like a Latin American Brickell.
              </p>
              <p><strong>Stay here if you want:</strong></p>
              <ul>
                <li>Big shopping malls in walking distance</li>
                <li>Hotel-with-gym-and-pool experience (Hilton, Hyatt, JW Marriott nearby)</li>
                <li>Business meetings — most corporates have offices here</li>
                <li>Less of a "tourist" vibe</li>
              </ul>
              <p><strong>Trade-offs:</strong></p>
              <ul>
                <li>Nothing historic to see — you'll Uber to Zona Colonial anyway</li>
                <li>Less walkable — wide avenues, car-centric</li>
                <li>Generic skyline — could be any modern city</li>
              </ul>

              <h2>Side-by-side</h2>
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed">
                Dos barrios. Dos experiencias completamente distintas. Si
                estás reservando un viaje a Santo Domingo, esta es la decisión
                más importante que tomarás — y la mayoría de guías la saltan.
                Aquí va la comparación honesta.
              </p>

              <h2>La respuesta corta</h2>
              <ul>
                <li><strong>¿Primer viaje, turismo, recorrido a pie?</strong> → Zona Colonial</li>
                <li><strong>¿Viaje de negocios, malls modernos, restaurantes alta gama, hoteles con gym?</strong> → Piantini</li>
                <li><strong>¿Ambas cosas?</strong> Gana Zona Colonial — Piantini queda a 15 min en Uber.</li>
              </ul>

              <h2>Zona Colonial</h2>
              <p>
                El barrio europeo más antiguo de las Américas. Patrimonio de
                la Humanidad UNESCO. Calles peatonales, fachadas de piedra
                coralina, la Catedral Primada, el Alcázar de Colón, Calle Las
                Damas. Los restaurantes salen a las plazas, la música en vivo
                flota desde los cafés, y todo el centro se camina en 20 minutos.
              </p>
              <p><strong>Quédate aquí si quieres:</strong></p>
              <ul>
                <li>Despertarte a 5 minutos de la Catedral Primada</li>
                <li>Calles donde realmente puedes caminar (la mayor parte del casco histórico es peatonal)</li>
                <li>Restaurantes, cafés, galerías de arte, música en vivo en cada cuadra</li>
                <li>Un barrio con carácter, no la uniformidad de una cadena hotelera</li>
              </ul>
              <p><strong>Contras:</strong></p>
              <ul>
                <li>Sin mall — compras boutique, no Zara</li>
                <li>Edificios históricos, no rascacielos — pocas piscinas en azotea</li>
                <li>Algunas calles se animan los fines de semana (locales de música en vivo)</li>
              </ul>

              <h2>Piantini</h2>
              <p>
                El distrito moderno de negocios de Santo Domingo. Torres de
                condominios, Blue Mall, Ágora Mall, embajadas, hoteles
                corporativos, fine dining. Avenidas anchas, mucho carro, Uber
                en todas partes. Se siente como un Brickell latinoamericano.
              </p>
              <p><strong>Quédate aquí si quieres:</strong></p>
              <ul>
                <li>Malls grandes a distancia caminable</li>
                <li>Experiencia de hotel-con-gym-y-piscina (Hilton, Hyatt, JW Marriott cerca)</li>
                <li>Reuniones de negocios — la mayoría de corporativas tienen oficinas aquí</li>
                <li>Menos vibe turístico</li>
              </ul>
              <p><strong>Contras:</strong></p>
              <ul>
                <li>Nada histórico que ver — terminarás yendo en Uber a la Zona Colonial</li>
                <li>Menos peatonal — avenidas anchas, todo en carro</li>
                <li>Skyline genérico — podría ser cualquier ciudad moderna</li>
              </ul>

              <h2>Comparación lado a lado</h2>
            </>
          )}

          <div className="not-prose my-6 rounded-2xl border border-border overflow-hidden bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="text-left py-3 px-4">{isEN ? "Criteria" : "Criterio"}</th>
                  <th className="text-left py-3 px-4">Zona Colonial</th>
                  <th className="text-left py-3 px-4">Piantini</th>
                </tr>
              </thead>
              <tbody className="text-foreground">
                {[
                  [isEN ? "Walkability" : "Caminabilidad", isEN ? "Excellent — pedestrian-only core" : "Excelente — núcleo peatonal", isEN ? "Limited — wide avenues" : "Limitada — avenidas anchas"],
                  [isEN ? "Tourist sights" : "Sitios turísticos", isEN ? "All within 10 min walk" : "Todo a 10 min a pie", isEN ? "None — you'll travel" : "Ninguno — tendrás que viajar"],
                  [isEN ? "Restaurants & cafés" : "Restaurantes y cafés", isEN ? "Hundreds, mostly local" : "Cientos, mayormente locales", isEN ? "Many, mostly chains" : "Muchos, mayormente cadenas"],
                  [isEN ? "Shopping" : "Compras", isEN ? "Boutiques + artisan markets" : "Boutiques + mercados artesanales", isEN ? "Big malls (Blue Mall, Ágora)" : "Malls grandes (Blue Mall, Ágora)"],
                  [isEN ? "Hotels with gym/pool" : "Hoteles con gym/piscina", isEN ? "Limited — boutique focus" : "Limitado — enfoque boutique", isEN ? "Many corporate hotels" : "Muchos hoteles corporativos"],
                  [isEN ? "Apartment rentals" : "Alquiler de apartamentos", isEN ? "Casa La Maria + a few others" : "Casa La Maria + otros pocos", isEN ? "Few short-term options" : "Pocas opciones de corta estancia"],
                  [isEN ? "Nightlife" : "Vida nocturna", isEN ? "Live music, plazas, intimate" : "Música en vivo, plazas, íntimo", isEN ? "Clubs, bars, more polished" : "Clubs, bares, más pulido"],
                  [isEN ? "Safety" : "Seguridad", isEN ? "High — patrolled, busy" : "Alta — patrullada, transitada", isEN ? "High — gated buildings" : "Alta — edificios cerrados"],
                  [isEN ? "Average accommodation cost" : "Costo de alojamiento promedio", isEN ? "$80–150 USD/night" : "$80–150 USD/noche", isEN ? "$120–250 USD/night" : "$120–250 USD/noche"],
                ].map(([k, a, b], i) => (
                  <tr key={i} className="border-t border-border">
                    <td className="py-3 px-4 font-medium">{k}</td>
                    <td className="py-3 px-4 text-foreground/90">{a}</td>
                    <td className="py-3 px-4 text-foreground/90">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {isEN ? (
            <>
              <h2>Verdict</h2>
              <p>
                For 90% of travellers, Zona Colonial is the right choice.
                Walkability + history + character beat malls + a hotel gym.
                If you specifically need a corporate hotel for a meeting,
                Piantini makes sense — but you'll Uber back to Zona Colonial
                for dinner anyway.
              </p>
              <p>
                <strong>Casa La Maria</strong> sits on Calle Parmenio Troncoso, a
                pedestrian alley in the heart of the Colonial Zone — 5 min from
                Calle Las Damas, 6 min from the Catedral Primada, 7 min from
                the Alcázar de Colón. Five boutique apartments, real kitchens,
                direct booking, no platform fees.
              </p>
            </>
          ) : (
            <>
              <h2>Veredicto</h2>
              <p>
                Para el 90% de los viajeros, la Zona Colonial es la decisión
                correcta. Caminabilidad + historia + carácter le ganan a malls
                + hotel con gym. Si específicamente necesitas un hotel
                corporativo para una reunión, Piantini tiene sentido — pero
                terminarás en Uber de regreso a la Zona Colonial para cenar.
              </p>
              <p>
                <strong>Casa La Maria</strong> está en la Calle Parmenio Troncoso, una
                calle peatonal en el corazón de la Zona Colonial — a 5 min de
                Calle Las Damas, 6 min de la Catedral Primada, 7 min del
                Alcázar de Colón. Cinco apartamentos boutique, cocina real,
                reserva directa, sin comisiones de plataforma.
              </p>
            </>
          )}
        </div>

        <div className="not-prose mt-12 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/20 p-8 text-center">
          <h3 className="font-serif text-xl mb-3">
            {isEN ? "Stay in the Colonial Zone" : "Hospédate en la Zona Colonial"}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {isEN ? "Five apartments, from $89 USD/night, book direct and skip the OTA fees." : "Cinco apartamentos, desde $89 USD/noche, reserva directa y evita comisiones."}
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
                  ? "Zona Colonial vs Piantini: Where to Stay in Santo Domingo (2026)"
                  : "Zona Colonial vs Piantini: Dónde Quedarse en Santo Domingo (2026)",
                description: isEN
                  ? "Pros, cons and a decision tree for picking your neighbourhood in Santo Domingo."
                  : "Pros, contras y árbol de decisión para elegir barrio en Santo Domingo.",
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
                  { "@type": "ListItem", position: 3, name: isEN ? "Zona Colonial vs Piantini" : "Zona Colonial vs Piantini", item: `https://casalamariazonacolonial.com/${locale}/blog/${SLUG}` },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
