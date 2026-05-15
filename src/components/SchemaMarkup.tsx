// Global JSON-LD @graph injected on every page (via [locale]/layout.tsx).
// Models the property as a LodgingBusiness/Hotel with the full intent-layer
// signal set Google needs to surface us for query types like "where to stay
// near Calle Las Damas", "boutique hotels Santo Domingo Colonial Zone",
// "apartments near Parque Colón".
//
// Per-page graph (Apartment + Offers + BreadcrumbList + BlogPosting) is
// injected on the corresponding route, not here.

import { supabase } from "@/lib/supabase";

const SITE = "https://casalamariazonacolonial.com";
const BUSINESS_ID = `${SITE}/#business`;
const DOP_PER_USD = 60;

type ApartmentRow = {
  slug: string;
  name_es: string;
  name_en: string;
  bedrooms: number | null;
  bathrooms: number | null;
  size_m2: number | null;
  max_guests: number | null;
  price_1guest_dop: number | null;
  price_2guest_dop: number | null;
  price_4guest_dop: number | null;
  images: Array<{ url: string; alt_es?: string; alt_en?: string }> | null;
  lodgify_property_id: string;
};

function dopToUsd(dop: number | null | undefined): number | null {
  if (dop == null) return null;
  return Math.round(Number(dop) / DOP_PER_USD);
}

function apartmentEntities(apartments: ApartmentRow[], isEN: boolean) {
  return apartments.map((apt) => {
    const url = isEN
      ? `${SITE}/en/apartments/${apt.slug}`
      : `${SITE}/es/apartamentos/${apt.slug}`;
    const name = isEN ? apt.name_en : apt.name_es;
    const usd1 = dopToUsd(apt.price_1guest_dop);
    const usd2 = dopToUsd(apt.price_2guest_dop);
    const usd4 = dopToUsd(apt.price_4guest_dop);
    const images = (apt.images ?? []).map((i) => i.url).filter(Boolean);

    const offers = [
      usd1 != null && {
        "@type": "Offer",
        name: isEN ? "1 guest rate" : "Tarifa para 1 huésped",
        priceCurrency: "USD",
        price: usd1,
        eligibleQuantity: { "@type": "QuantitativeValue", value: 1, unitText: "person" },
        availability: "https://schema.org/InStock",
        url,
      },
      usd2 != null && {
        "@type": "Offer",
        name: isEN ? "2 guest rate" : "Tarifa para 2 huéspedes",
        priceCurrency: "USD",
        price: usd2,
        eligibleQuantity: { "@type": "QuantitativeValue", value: 2, unitText: "person" },
        availability: "https://schema.org/InStock",
        url,
      },
      usd4 != null && {
        "@type": "Offer",
        name: isEN ? "4 guest rate" : "Tarifa para 4 huéspedes",
        priceCurrency: "USD",
        price: usd4,
        eligibleQuantity: { "@type": "QuantitativeValue", value: 4, unitText: "person" },
        availability: "https://schema.org/InStock",
        url,
      },
    ].filter(Boolean);

    return {
      "@type": "Apartment",
      "@id": `${url}#apartment`,
      name,
      url,
      image: images,
      ...(apt.size_m2 != null && {
        floorSize: {
          "@type": "QuantitativeValue",
          value: apt.size_m2,
          unitCode: "MTK", // square meter
        },
      }),
      numberOfBedrooms: apt.bedrooms ?? undefined,
      numberOfRooms: apt.bedrooms ?? undefined,
      numberOfBathroomsTotal: apt.bathrooms ?? undefined,
      occupancy: {
        "@type": "QuantitativeValue",
        maxValue: apt.max_guests ?? 4,
        minValue: 1,
      },
      containedInPlace: { "@id": BUSINESS_ID },
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
        { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
        { "@type": "LocationFeatureSpecification", name: "Equipped kitchen", value: true },
        { "@type": "LocationFeatureSpecification", name: "Private balcony", value: true },
        { "@type": "LocationFeatureSpecification", name: "Smart TV", value: true },
        { "@type": "LocationFeatureSpecification", name: "Digital safe", value: true },
        { "@type": "LocationFeatureSpecification", name: "Premium bed linens", value: true },
      ],
      ...(usd1 != null && usd4 != null && {
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          lowPrice: usd1,
          highPrice: usd4,
          offerCount: offers.length,
          offers,
        },
      }),
    };
  });
}

export async function SchemaMarkup({ locale }: { locale: string }) {
  const isEN = locale === "en";

  const { data } = await supabase
    .from("apartments")
    .select(
      "slug, name_es, name_en, bedrooms, bathrooms, size_m2, max_guests, lodgify_property_id, price_1guest_dop, price_2guest_dop, price_4guest_dop, images",
    )
    .eq("available", true)
    .order("lodgify_property_id");

  const apts = (data ?? []) as ApartmentRow[];
  const aptNodes = apartmentEntities(apts, isEN);

  const lowPrice = Math.min(
    ...aptNodes
      .map((a) => (a.offers as { lowPrice?: number } | undefined)?.lowPrice ?? Infinity)
      .filter((n) => Number.isFinite(n)),
  );
  const highPrice = Math.max(
    ...aptNodes
      .map((a) => (a.offers as { highPrice?: number } | undefined)?.highPrice ?? -Infinity)
      .filter((n) => Number.isFinite(n)),
  );
  const heroImage =
    "https://res.cloudinary.com/dspogotur/image/upload/v1776606232/casa_la_maria_santo_domingo_zona_colonial_eqyd8j.webp";
  const allImages = [heroImage, ...aptNodes.flatMap((a) => (a.image ?? []).slice(0, 1))];

  const business = {
    "@type": ["LodgingBusiness", "Hotel"],
    "@id": BUSINESS_ID,
    name: "Casa La Maria Zona Colonial",
    alternateName: ["Casa La Maria", "Casa La María"],
    description: isEN
      ? "Five boutique apartments in Santo Domingo's Colonial Zone — UNESCO World Heritage Site. Direct booking, no platform fees, lower than OTA rates."
      : "Cinco apartamentos boutique en la Zona Colonial de Santo Domingo — Patrimonio de la Humanidad UNESCO. Reserva directa, sin comisiones, mejor precio que las OTAs.",
    url: SITE,
    telephone: "+1-829-406-7269",
    email: "info@casalamariazonacolonial.com",
    logo: `${SITE}/icon.svg`,
    image: allImages,
    priceRange:
      Number.isFinite(lowPrice) && Number.isFinite(highPrice)
        ? `$${lowPrice}-$${highPrice} USD`
        : "$89-$133 USD",
    starRating: { "@type": "Rating", ratingValue: "4.9", bestRating: "5" },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Parmenio Troncoso 4",
      addressLocality: "Santo Domingo",
      addressRegion: "Distrito Nacional",
      postalCode: "10210",
      addressCountry: "DO",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 18.469990300133684,
      longitude: -69.88640158707528,
    },
    hasMap: "https://maps.google.com/?q=18.469990,-69.886401",
    checkinTime: "15:00",
    checkoutTime: "11:00",
    currenciesAccepted: "USD, DOP",
    paymentAccepted: "Credit Card, Stripe",
    smokingAllowed: false,
    petsAllowed: false,
    sameAs: [
      // Social profiles to be filled in when ready (Instagram, Facebook,
      // Booking.com listing, Airbnb listing). Keeping this here as the
      // canonical place to add them — they boost entity disambiguation.
    ],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Free WiFi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Equipped kitchen", value: true },
      { "@type": "LocationFeatureSpecification", name: "Private balcony", value: true },
      { "@type": "LocationFeatureSpecification", name: "Smart TV", value: true },
      { "@type": "LocationFeatureSpecification", name: "Digital safe", value: true },
      { "@type": "LocationFeatureSpecification", name: "Premium bed linens", value: true },
      { "@type": "LocationFeatureSpecification", name: "Self check-in (smart lock)", value: true },
      { "@type": "LocationFeatureSpecification", name: "Walking distance to UNESCO sites", value: true },
      { "@type": "LocationFeatureSpecification", name: "24/7 host support (WhatsApp)", value: true },
    ],
    // Intent + entity layering for query-to-schema matching
    knowsAbout: [
      "Santo Domingo Colonial Zone",
      "Calle Las Damas — oldest paved street in the Americas",
      "Alcázar de Colón",
      "Catedral Primada de América",
      "Parque Colón",
      "Panteón Nacional",
      "Zona Colonial nightlife",
      "Dominican history and culture",
      "Walking tours in Santo Domingo",
      "Remote work and digital nomad accommodations",
      "Boutique apartment rentals",
      "UNESCO World Heritage sites",
    ],
    areaServed: [
      {
        "@type": "Place",
        name: "Zona Colonial",
        description:
          "Historic district of Santo Domingo, UNESCO World Heritage Site",
        geo: {
          "@type": "GeoCircle",
          geoMidpoint: { "@type": "GeoCoordinates", latitude: 18.4708, longitude: -69.8842 },
          geoRadius: "1000",
        },
      },
      {
        "@type": "Place",
        name: "Calle Las Damas",
        description: "Oldest paved street in the Americas, 5-min walk from Casa La Maria",
      },
      {
        "@type": "Place",
        name: "Parque Colón",
        description: "Historic central plaza with the Catedral Primada de América",
      },
      {
        "@type": "Place",
        name: "Alcázar de Colón",
        description: "Diego Columbus residence and museum, 7-min walk",
      },
      {
        "@type": "Place",
        name: "Distrito Nacional",
        description: "Santo Domingo's central municipality",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: isEN ? "Casa La Maria Apartments" : "Apartamentos Casa La Maria",
      itemListElement: aptNodes.map((apt) => {
        const ag = apt.offers as { lowPrice?: number; highPrice?: number } | undefined;
        return {
          "@type": "Offer",
          itemOffered: { "@id": apt["@id"] },
          name: apt.name,
          url: apt.url,
          priceCurrency: "USD",
          ...(ag?.lowPrice != null && { lowPrice: ag.lowPrice }),
          ...(ag?.highPrice != null && { highPrice: ag.highPrice }),
          availability: "https://schema.org/InStock",
        };
      }),
    },
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${SITE}/#faq`,
    mainEntity: isEN
      ? [
          {
            "@type": "Question",
            name: "Is Casa La Maria better than booking via Airbnb or Booking.com?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — booking direct on casalamariazonacolonial.com avoids the OTA service fee (typically 14–18%) and gives you the same flexibility, the same property, and direct WhatsApp contact with our host before and during your stay.",
            },
          },
          {
            "@type": "Question",
            name: "How close is Casa La Maria to Calle Las Damas and Parque Colón?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Casa La Maria is on Calle Parmenio Troncoso, a quiet street in the heart of the Colonial Zone. Calle Las Damas is a 5-minute walk, Parque Colón and the Catedral Primada are 6 minutes, and the Alcázar de Colón is 7 minutes — all on foot.",
            },
          },
          {
            "@type": "Question",
            name: "Is Zona Colonial safe to stay in?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes — Zona Colonial is one of the safest neighbourhoods in Santo Domingo. The street is pedestrian-only, well-lit, and patrolled. The building has secure entry and each apartment has a digital safe.",
            },
          },
          {
            "@type": "Question",
            name: "What's the cancellation policy?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Free cancellation up to 7 days before check-in. After that, 50% of the total is charged.",
            },
          },
          {
            "@type": "Question",
            name: "What time is check-in and check-out?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Check-in from 3:00 PM, check-out by 11:00 AM. Early check-in or late check-out subject to availability — we accommodate when we can.",
            },
          },
          {
            "@type": "Question",
            name: "Is parking available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We don't have on-site parking, but a public garage is a 2-minute walk away with rates from $5 USD per day.",
            },
          },
          {
            "@type": "Question",
            name: "How far is the beach?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Playa Güibia is a 25-minute walk along the Malecón, or a 5-minute taxi ride. Boca Chica beach is about 30 minutes by car.",
            },
          },
        ]
      : [
          {
            "@type": "Question",
            name: "¿Por qué reservar directo en lugar de Airbnb o Booking.com?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Reservando directo en casalamariazonacolonial.com evitas la comisión de las OTAs (14-18%), tienes la misma flexibilidad, el mismo apartamento, y contacto directo por WhatsApp con tu anfitrión antes y durante tu estancia.",
            },
          },
          {
            "@type": "Question",
            name: "¿A qué distancia está Casa La Maria de Calle Las Damas y Parque Colón?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Casa La Maria está en la Calle Parmenio Troncoso, una calle tranquila en el corazón de la Zona Colonial. Calle Las Damas a 5 minutos a pie, Parque Colón y la Catedral Primada a 6 minutos, y el Alcázar de Colón a 7 minutos.",
            },
          },
          {
            "@type": "Question",
            name: "¿Es seguro hospedarse en la Zona Colonial?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sí — la Zona Colonial es uno de los barrios más seguros de Santo Domingo. La calle es peatonal, bien iluminada y patrullada. El edificio tiene entrada segura y cada apartamento cuenta con caja fuerte digital.",
            },
          },
          {
            "@type": "Question",
            name: "¿Cuál es la política de cancelación?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Cancelación gratuita hasta 7 días antes del check-in. Después de ese plazo, se cobrará el 50% del total de la reserva.",
            },
          },
          {
            "@type": "Question",
            name: "¿A qué hora es el check-in y check-out?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Check-in a partir de las 3:00 PM y check-out antes de las 11:00 AM. Early check-in o late check-out sujetos a disponibilidad — acomodamos cuando podemos.",
            },
          },
          {
            "@type": "Question",
            name: "¿Hay estacionamiento disponible?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No tenemos estacionamiento propio, pero hay un parqueo público a 2 minutos caminando con tarifas desde $5 USD por día.",
            },
          },
          {
            "@type": "Question",
            name: "¿Qué tan cerca está la playa?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "La Playa Güibia está a 25 minutos caminando por el Malecón, o 5 minutos en taxi. Boca Chica está a unos 30 minutos en carro.",
            },
          },
        ],
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [business, ...aptNodes, faq],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
