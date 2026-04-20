export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ApartmentComplex",
        "@id": "https://casalamariazonacolonial.com/#organization",
        name: "Casa La Maria",
        description:
          "Cinco apartamentos boutique en la Zona Colonial de Santo Domingo, República Dominicana. Diseño minimalista, historia colonial viva.",
        url: "https://casalamariazonacolonial.com",
        telephone: "+1-829-000-0000",
        email: "info@casalamariazonacolonial.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Callejón Regina, Parmenio Troncoso",
          addressLocality: "Santo Domingo",
          addressRegion: "Distrito Nacional",
          postalCode: "10210",
          addressCountry: "DO",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 18.4725,
          longitude: -69.8819,
        },
        priceRange: "DOP 5,603 - DOP 7,680",
        starRating: {
          "@type": "Rating",
          ratingValue: "4.9",
        },
        checkinTime: "15:00",
        checkoutTime: "11:00",
      },
      {
        "@type": "ApartmentComplex",
        "@id": "https://casalamariazonacolonial.com/#complex",
        name: "Casa La Maria — Zona Colonial",
        description:
          "5 apartamentos boutique de diseño minimalista en el corazón histórico de Santo Domingo. Opciones de 1 y 2 dormitorios disponibles.",
        numberOfAccommodationUnits: 5,
        url: "https://casalamariazonacolonial.com/apartamentos",
      },
      {
        "@type": "Offer",
        "@id": "https://casalamariazonacolonial.com/#offer",
        name: "Alquiler por noche — Casa La Maria",
        offeredBy: { "@id": "https://casalamariazonacolonial.com/#organization" },
        price: "5603",
        priceCurrency: "DOP",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
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
              text: "Check-in a partir de las 3:00 PM y check-out antes de las 11:00 AM. Early check-in o late check-out sujetos a disponibilidad.",
            },
          },
          {
            "@type": "Question",
            name: "¿Hay estacionamiento disponible?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No tenemos estacionamiento propio, pero hay parqueos públicos a 2 minutos caminando con tarifas desde $5 USD por día.",
            },
          },
          {
            "@type": "Question",
            name: "¿Está cerca de la playa?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "La Playa Güibia está a 10 minutos caminando. También puedes tomar un taxi a Boca Chica en 30 minutos.",
            },
          },
        ],
      },
      {
        "@type": "AggregateRating",
        itemReviewed: { "@id": "https://casalamariazonacolonial.com/#complex" },
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "47",
        reviewCount: "47",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
