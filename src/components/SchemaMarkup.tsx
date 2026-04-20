export function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LodgingBusiness",
        "@id": "https://casalamariard.com/#organization",
        name: "Casa La Maria",
        description:
          "Apartamento boutique de 1 dormitorio en la Zona Colonial de Santo Domingo, República Dominicana",
        url: "https://casalamariard.com",
        telephone: "+1-829-000-0000",
        email: "info@casalamariard.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Calle Las Damas, Zona Colonial",
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
        priceRange: "$75 - $120",
        starRating: {
          "@type": "Rating",
          ratingValue: "4.9",
        },
        checkinTime: "15:00",
        checkoutTime: "11:00",
      },
      {
        "@type": "Apartment",
        "@id": "https://casalamariard.com/#apartment",
        name: "Casa La Maria — One Bedroom",
        description:
          "Apartamento boutique de 1 dormitorio con diseño colonial moderno en el corazón de la Zona Colonial de Santo Domingo",
        numberOfBedrooms: 1,
        numberOfBathroomsTotal: 1,
        floorSize: {
          "@type": "QuantitativeValue",
          value: 55,
          unitCode: "MTK",
        },
      },
      {
        "@type": "Offer",
        "@id": "https://casalamariard.com/#offer",
        name: "Alquiler por noche — Casa La Maria",
        offeredBy: { "@id": "https://casalamariard.com/#organization" },
        price: "89.00",
        priceCurrency: "USD",
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
        itemReviewed: { "@id": "https://casalamariard.com/#apartment" },
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
