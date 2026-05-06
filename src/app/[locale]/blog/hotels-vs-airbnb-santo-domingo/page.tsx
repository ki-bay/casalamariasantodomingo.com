import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

type Props = { params: Promise<{ locale: string }> };

const SLUG = "hotels-vs-airbnb-santo-domingo";
const COVER = "https://res.cloudinary.com/dspogotur/image/upload/v1776784040/Casa_la_Maria_zona_colonial_santo_domingo.webp";
const PUBLISHED = "2026-05-05";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEN = locale === "en";
  const SITE = "https://casalamariazonacolonial.com";
  const canonical = isEN ? `${SITE}/en/blog/${SLUG}` : `${SITE}/es/blog/${SLUG}`;
  return {
    title: isEN
      ? "Hotels vs Airbnb in Santo Domingo: Which Is Better in 2026?"
      : "Hoteles vs Airbnb en Santo Domingo: ¿Cuál Conviene en 2026?",
    description: isEN
      ? "Honest 2026 comparison: hotels vs Airbnb vs boutique apartments in Santo Domingo. Pros, cons, average prices, and the format that fits each type of traveller."
      : "Comparación honesta 2026: hoteles vs Airbnb vs apartamentos boutique en Santo Domingo. Pros, contras, precios promedio y el formato que conviene a cada tipo de viajero.",
    alternates: {
      canonical,
      languages: { es: `${SITE}/es/blog/${SLUG}`, en: `${SITE}/en/blog/${SLUG}` },
    },
    openGraph: {
      type: "article",
      title: isEN ? "Hotels vs Airbnb in Santo Domingo (2026)" : "Hoteles vs Airbnb en Santo Domingo (2026)",
      description: isEN
        ? "Honest pros, cons and prices for picking your accommodation format."
        : "Pros, contras y precios honestos para elegir formato de alojamiento.",
      url: canonical,
      siteName: "Casa La Maria",
      locale: isEN ? "en_US" : "es_DO",
      publishedTime: PUBLISHED,
      images: [{ url: COVER, alt: isEN ? "Boutique apartment in Santo Domingo" : "Apartamento boutique en Santo Domingo" }],
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
            ? "Hotels vs Airbnb in Santo Domingo: which is better in 2026?"
            : "Hoteles vs Airbnb en Santo Domingo: ¿cuál conviene en 2026?"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          {isEN ? "Updated May 2026 · 7 min read" : "Actualizado mayo 2026 · 7 min lectura"}
        </p>

        <div className="aspect-[16/9] relative rounded-2xl overflow-hidden mb-10">
          <Image src={COVER} alt={isEN ? "Boutique apartment interior — Casa La Maria Colonial Zone" : "Interior apartamento boutique — Casa La Maria Zona Colonial"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
        </div>

        <div className="prose prose-stone dark:prose-invert max-w-none">
          {isEN ? (
            <>
              <p className="text-lg leading-relaxed">
                Hotel or Airbnb in Santo Domingo? It's the wrong question. The
                real choice is between three formats — and one of them is
                quietly winning for travellers who do their homework.
              </p>

              <h2>The three formats</h2>
              <p><strong>1. Traditional hotel.</strong> 24/7 reception, daily housekeeping, gym, pool, a restaurant downstairs. Predictable, low-effort. You pay for amenities you may or may not use.</p>
              <p><strong>2. Airbnb.</strong> A real apartment in a real building. Kitchen, washer, more space, local feel. But: Airbnb's service fee adds 14–18% to the price, hosts vary wildly, and you're at the mercy of the platform if something goes wrong.</p>
              <p><strong>3. Direct-booking boutique apartments.</strong> The same apartment you'd find on Airbnb — but rented direct from the operator, no platform fee, real human contact, and often the same cancellation flexibility.</p>

              <h2>Hotels in Santo Domingo</h2>
              <p><strong>Best for:</strong></p>
              <ul>
                <li>Business trips with expense reports</li>
                <li>One-night stopovers — you want zero friction</li>
                <li>Conferences, where the hotel is the venue</li>
                <li>Travellers who genuinely use the gym/pool/spa</li>
              </ul>
              <p><strong>Trade-offs:</strong></p>
              <ul>
                <li>$140–$300 USD/night for anything decent</li>
                <li>No kitchen — eating out 3 times a day adds up fast</li>
                <li>Generic — every Hilton looks like every other Hilton</li>
              </ul>

              <h2>Airbnb in Santo Domingo</h2>
              <p><strong>Best for:</strong></p>
              <ul>
                <li>Stays of 4+ nights where the kitchen pays for itself</li>
                <li>Groups or families needing more than one bedroom</li>
                <li>Travellers who want to live like a local</li>
              </ul>
              <p><strong>Trade-offs:</strong></p>
              <ul>
                <li>Service fee (~14–18%) and cleaning fee inflate the headline price</li>
                <li>Quality varies — read reviews carefully</li>
                <li>If something breaks, you're chatting with a host, not a 24/7 desk</li>
                <li>"Pay at property" rates often mean less flexibility, not more</li>
              </ul>

              <h2>Direct-booking boutique apartments (the underrated option)</h2>
              <p>
                Operators with their own websites — typically 5 to 20 units in
                a single building — selling direct. Same product as Airbnb
                listings (often the exact same units), without the platform
                fee. Real phone number, real address, real on-site host.
              </p>
              <p><strong>Best for:</strong></p>
              <ul>
                <li>Anyone who'd choose Airbnb, but wants to save 15%</li>
                <li>Stays of 2+ nights in a tourist neighbourhood</li>
                <li>Couples and small groups in the Colonial Zone</li>
              </ul>
              <p><strong>Trade-offs:</strong></p>
              <ul>
                <li>You have to actually find the operator's website (you're reading this on one — Casa La Maria)</li>
                <li>Less reviews than Airbnb listings — verify with Google reviews of the property</li>
              </ul>
            </>
          ) : (
            <>
              <p className="text-lg leading-relaxed">
                ¿Hotel o Airbnb en Santo Domingo? Es la pregunta equivocada.
                La decisión real es entre tres formatos — y uno está ganando
                en silencio para viajeros que hacen la tarea.
              </p>

              <h2>Los tres formatos</h2>
              <p><strong>1. Hotel tradicional.</strong> Recepción 24/7, limpieza diaria, gym, piscina, restaurante en el lobby. Predecible, sin esfuerzo. Pagas por amenidades que tal vez no uses.</p>
              <p><strong>2. Airbnb.</strong> Un apartamento real en un edificio real. Cocina, lavadora, más espacio, sensación de barrio. Pero: la comisión de Airbnb añade 14–18% al precio, los anfitriones varían mucho, y estás a merced de la plataforma si algo sale mal.</p>
              <p><strong>3. Apartamentos boutique de reserva directa.</strong> El mismo apartamento que verías en Airbnb — pero alquilado directo al operador, sin comisión de plataforma, contacto humano real, y normalmente la misma flexibilidad de cancelación.</p>

              <h2>Hoteles en Santo Domingo</h2>
              <p><strong>Mejor para:</strong></p>
              <ul>
                <li>Viajes de negocios con cuenta de gastos</li>
                <li>Una sola noche en escala — quieres cero fricción</li>
                <li>Conferencias donde el hotel es la sede</li>
                <li>Viajeros que de verdad usan el gym/piscina/spa</li>
              </ul>
              <p><strong>Contras:</strong></p>
              <ul>
                <li>$140–$300 USD/noche para algo decente</li>
                <li>Sin cocina — comer fuera 3 veces al día se vuelve caro</li>
                <li>Genéricos — un Hilton se parece a otro Hilton</li>
              </ul>

              <h2>Airbnb en Santo Domingo</h2>
              <p><strong>Mejor para:</strong></p>
              <ul>
                <li>Estancias de 4+ noches donde la cocina ya se paga sola</li>
                <li>Grupos o familias que necesitan más de un dormitorio</li>
                <li>Viajeros que quieren vivir como un local</li>
              </ul>
              <p><strong>Contras:</strong></p>
              <ul>
                <li>Tarifa de servicio (~14–18%) + tarifa de limpieza inflan el precio final</li>
                <li>La calidad varía — lee reviews con cuidado</li>
                <li>Si algo se rompe, hablas con un anfitrión, no con un desk 24/7</li>
                <li>"Paga en el alojamiento" suele significar menos flexibilidad, no más</li>
              </ul>

              <h2>Apartamentos boutique de reserva directa (la opción subestimada)</h2>
              <p>
                Operadores con su propio sitio web — típicamente de 5 a 20
                unidades en un mismo edificio — vendiendo directo. El mismo
                producto que en Airbnb (frecuentemente las mismas unidades)
                sin la comisión de plataforma. Teléfono real, dirección real,
                anfitrión real en sitio.
              </p>
              <p><strong>Mejor para:</strong></p>
              <ul>
                <li>Cualquiera que elegiría Airbnb, pero quiere ahorrar 15%</li>
                <li>Estancias de 2+ noches en un barrio turístico</li>
                <li>Parejas y grupos pequeños en la Zona Colonial</li>
              </ul>
              <p><strong>Contras:</strong></p>
              <ul>
                <li>Tienes que encontrar el sitio del operador (estás leyendo en uno — Casa La Maria)</li>
                <li>Menos reviews que en Airbnb — verifica con reviews de Google del edificio</li>
              </ul>
            </>
          )}

          <h2 className="not-prose font-serif text-2xl mt-12 mb-4">
            {isEN ? "Quick decision tree" : "Árbol de decisión rápido"}
          </h2>
          <div className="not-prose rounded-2xl border border-border bg-card divide-y divide-border">
            {[
              [isEN ? "Stopping over for 1 night, near the airport" : "1 noche de escala, cerca del aeropuerto", isEN ? "Hotel" : "Hotel"],
              [isEN ? "Conference with on-site rooms" : "Conferencia con cuartos en sitio", isEN ? "Hotel" : "Hotel"],
              [isEN ? "Family of 4, 1 week" : "Familia de 4, 1 semana", isEN ? "Direct-booking apartment" : "Apartamento de reserva directa"],
              [isEN ? "Couple, 3 nights, Colonial Zone" : "Pareja, 3 noches, Zona Colonial", isEN ? "Direct-booking apartment" : "Apartamento de reserva directa"],
              [isEN ? "Solo traveller, kitchen + remote work" : "Viajero solo, cocina + trabajo remoto", isEN ? "Direct-booking apartment" : "Apartamento de reserva directa"],
              [isEN ? "Business trip, expense report" : "Viaje de negocios, cuenta de gastos", isEN ? "Hotel" : "Hotel"],
            ].map(([scenario, answer], i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-5 py-3.5 text-sm">
                <span className="text-foreground/90">{scenario}</span>
                <span className="font-medium text-accent text-right">→ {answer}</span>
              </div>
            ))}
          </div>

          {isEN ? (
            <>
              <h2 className="mt-12">Where Casa La Maria fits</h2>
              <p>
                Casa La Maria is a direct-booking operator: five boutique
                apartments in a restored building on Callejón Regina, in the
                heart of the Colonial Zone. Same building you'd find on
                Booking.com or Airbnb — minus the platform fee. Same
                cancellation policy as Airbnb (free up to 7 days before),
                Stripe-secured payments, real WhatsApp host.
              </p>
              <p>
                If your trip pattern matches the "direct-booking apartment"
                column above, this is the option that saves you the most
                money without losing anything.
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-12">Dónde encaja Casa La Maria</h2>
              <p>
                Casa La Maria es un operador de reserva directa: cinco
                apartamentos boutique en un edificio restaurado del Callejón
                Regina, en el corazón de la Zona Colonial. El mismo edificio
                que verías en Booking.com o Airbnb — sin la comisión de
                plataforma. La misma política de cancelación que Airbnb
                (gratis hasta 7 días antes), pagos seguros con Stripe,
                anfitrión real por WhatsApp.
              </p>
              <p>
                Si tu viaje encaja en la columna "Apartamento de reserva
                directa" de arriba, esta es la opción que más dinero te
                ahorra sin perder nada.
              </p>
            </>
          )}
        </div>

        <div className="not-prose mt-12 rounded-2xl bg-gradient-to-br from-accent/15 to-accent/5 border border-accent/20 p-8 text-center">
          <h3 className="font-serif text-xl mb-3">
            {isEN ? "Skip the OTA fees" : "Sáltate la comisión de las OTAs"}
          </h3>
          <p className="text-sm text-muted-foreground mb-5">
            {isEN ? "Same apartment. Same flexibility. Direct booking from $89 USD/night." : "El mismo apartamento. La misma flexibilidad. Reserva directa desde $89 USD/noche."}
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
                  ? "Hotels vs Airbnb in Santo Domingo: Which Is Better in 2026?"
                  : "Hoteles vs Airbnb en Santo Domingo: ¿Cuál Conviene en 2026?",
                description: isEN
                  ? "Honest comparison: hotels vs Airbnb vs boutique apartments in Santo Domingo."
                  : "Comparación honesta: hoteles vs Airbnb vs apartamentos boutique en Santo Domingo.",
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
                  { "@type": "ListItem", position: 3, name: isEN ? "Hotels vs Airbnb in Santo Domingo" : "Hoteles vs Airbnb en Santo Domingo", item: `https://casalamariazonacolonial.com/${locale}/blog/${SLUG}` },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}
