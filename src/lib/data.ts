export const PROPERTY = {
  name: "Casa La Maria",
  slug: "casa-la-maria",
  description:
    "Casa La Maria es un apartamento boutique ubicado en una edificación restaurada del siglo XVI en la emblemática Calle Las Damas, la calle más antigua de América. Nuestro espacio combina la autenticidad de los muros de piedra coralina con un diseño interior contemporáneo de líneas limpias.",
  shortDescription:
    "Un refugio boutique de un dormitorio en el corazón de la primera ciudad de América. Donde la historia colonial se encuentra con el confort moderno.",
  address: "Calle Las Damas, Zona Colonial, Santo Domingo 10210",
  city: "Santo Domingo",
  country: "República Dominicana",
  lat: 18.4725,
  lng: -69.8819,
  maxGuests: 2,
  bedrooms: 1,
  bathrooms: 1,
  size: 55,
  pricePerNight: 89,
  cleaningFee: 35,
  serviceFeePercent: 0.08,
  minStay: 1,
  maxStay: 30,
  checkIn: "15:00",
  checkOut: "11:00",
  rating: 4.9,
  reviewCount: 47,
};

export const PROPERTY_EN = {
  description:
    "Casa La Maria is a boutique apartment located in a restored 16th-century building on the iconic Calle Las Damas, the oldest street in the Americas. Our space blends the authenticity of coral stone walls with a contemporary interior design of clean lines.",
  shortDescription:
    "A one-bedroom boutique retreat in the heart of the first city of the Americas. Where colonial history meets modern comfort.",
};

export const AMENITIES = [
  { name: "WiFi de alta velocidad", icon: "wifi" },
  { name: "Aire acondicionado", icon: "snowflake" },
  { name: "Cocina completa", icon: "cooking-pot" },
  { name: 'Smart TV 55"', icon: "tv" },
  { name: "Cafetera Nespresso", icon: "coffee" },
  { name: "Lavadora/secadora", icon: "shirt" },
  { name: "Cerradura inteligente", icon: "lock" },
  { name: "Terraza privada", icon: "sun" },
  { name: "Piscina compartida", icon: "waves" },
  { name: "Parqueo cercano", icon: "car" },
  { name: "Ropa de cama premium", icon: "bed" },
  { name: "Secador de pelo", icon: "wind" },
  { name: "Utensilios de cocina", icon: "utensils" },
  { name: "Plancha y tabla", icon: "shirt" },
  { name: "Detector de humo", icon: "shield-check" },
];

export const HOUSE_RULES = [
  {
    title: "Check-in: 3:00 PM — Check-out: 11:00 AM",
    subtitle: "Early check-in / late check-out sujeto a disponibilidad",
    icon: "clock",
  },
  {
    title: "No se permiten fiestas ni eventos",
    subtitle: "El espacio es para descanso y tranquilidad",
    icon: "ban",
  },
  {
    title: "Prohibido fumar",
    subtitle: "En todo el interior del apartamento",
    icon: "cigarette-off",
  },
  {
    title: "No se permiten mascotas",
    subtitle: "Por alergias de otros huéspedes",
    icon: "dog",
  },
  {
    title: "Silencio después de las 10:00 PM",
    subtitle: "Respeto por los vecinos del edificio histórico",
    icon: "volume-x",
  },
];

export const POLICIES = [
  {
    title: "Cancelación gratuita (7 días)",
    subtitle:
      "Reembolso completo si cancelas con al menos 7 días de anticipación. Después: 50% del total.",
    icon: "calendar-x",
  },
  {
    title: "Pago seguro con Stripe / PayPal",
    subtitle: "Tu pago está protegido. No almacenamos datos de tarjeta.",
    icon: "credit-card",
  },
  {
    title: "Depósito reembolsable: $100 USD",
    subtitle:
      "Se retiene temporalmente y se libera 48h después del check-out si no hay daños.",
    icon: "shield",
  },
  {
    title: "Estancia mínima: 2 noches",
    subtitle:
      "Estancia máxima: 30 noches. Descuentos disponibles desde 7 noches.",
    icon: "file-text",
  },
];

export const GALLERY_IMAGES = [
  {
    src: "https://picsum.photos/seed/clm-sala/800/800.jpg",
    alt: "Sala principal de Casa La Maria",
    label: "Sala Principal",
    isMain: true,
  },
  {
    src: "https://picsum.photos/seed/clm-dormitorio/400/300.jpg",
    alt: "Dormitorio con cama queen",
    label: "Dormitorio",
    isMain: false,
  },
  {
    src: "https://picsum.photos/seed/clm-bano/400/300.jpg",
    alt: "Baño moderno",
    label: "Baño",
    isMain: false,
  },
  {
    src: "https://picsum.photos/seed/clm-cocina/400/300.jpg",
    alt: "Cocina completamente equipada",
    label: "Cocina",
    isMain: false,
  },
  {
    src: "https://picsum.photos/seed/clm-terraza/400/300.jpg",
    alt: "Terraza privada con vistas",
    label: "Terraza",
    isMain: false,
  },
  {
    src: "https://picsum.photos/seed/clm-piscina/400/300.jpg",
    alt: "Piscina compartida",
    label: "Piscina",
    isMain: false,
  },
];

export const LIGHTBOX_IMAGES = [
  "https://picsum.photos/seed/clm-sala/1200/900.jpg",
  "https://picsum.photos/seed/clm-dormitorio/1200/900.jpg",
  "https://picsum.photos/seed/clm-bano/1200/900.jpg",
  "https://picsum.photos/seed/clm-cocina/1200/900.jpg",
  "https://picsum.photos/seed/clm-terraza/1200/900.jpg",
  "https://picsum.photos/seed/clm-piscina/1200/900.jpg",
];

export const NEARBY_PLACES = [
  { name: "Alcázar de Colón", icon: "landmark", time: "2 min" },
  { name: "Catedral Primada", icon: "church", time: "4 min" },
  { name: "Panteón Nacional", icon: "building", time: "3 min" },
  { name: "Playa Güibia", icon: "palm-tree", time: "10 min" },
  { name: "Aeropuerto SDQ", icon: "plane", time: "30 min" },
  { name: "Blue Mall", icon: "shopping-bag", time: "15 min" },
  { name: "Restaurante Lulú", icon: "wine", time: "1 min" },
];

export const RATING_BREAKDOWN = [
  { category: "Limpieza", score: 5.0 },
  { category: "Comunicación", score: 5.0 },
  { category: "Ubicación", score: 4.9 },
  { category: "Calidad/Precio", score: 4.8 },
  { category: "Check-in", score: 5.0 },
];

export const AMENITIES_EN = [
  { name: "High-speed WiFi", icon: "wifi" },
  { name: "Air conditioning", icon: "snowflake" },
  { name: "Full kitchen", icon: "cooking-pot" },
  { name: 'Smart TV 55"', icon: "tv" },
  { name: "Nespresso coffee maker", icon: "coffee" },
  { name: "Washer/dryer", icon: "shirt" },
  { name: "Smart lock", icon: "lock" },
  { name: "Private terrace", icon: "sun" },
  { name: "Shared pool", icon: "waves" },
  { name: "Nearby parking", icon: "car" },
  { name: "Premium bedding", icon: "bed" },
  { name: "Hair dryer", icon: "wind" },
  { name: "Kitchen utensils", icon: "utensils" },
  { name: "Iron & board", icon: "shirt" },
  { name: "Smoke detector", icon: "shield-check" },
];

export const HOUSE_RULES_EN = [
  {
    title: "Check-in: 3:00 PM — Check-out: 11:00 AM",
    subtitle: "Early check-in / late check-out subject to availability",
    icon: "clock",
  },
  {
    title: "No parties or events",
    subtitle: "The space is for rest and tranquility",
    icon: "ban",
  },
  {
    title: "No smoking",
    subtitle: "Throughout the entire interior of the apartment",
    icon: "cigarette-off",
  },
  {
    title: "No pets",
    subtitle: "Due to allergies of other guests",
    icon: "dog",
  },
  {
    title: "Quiet hours after 10:00 PM",
    subtitle: "Respect for neighbors in the historic building",
    icon: "volume-x",
  },
];

export const POLICIES_EN = [
  {
    title: "Free cancellation (7 days)",
    subtitle:
      "Full refund if you cancel at least 7 days in advance. After that: 50% of the total.",
    icon: "calendar-x",
  },
  {
    title: "Secure payment with Stripe / PayPal",
    subtitle: "Your payment is protected. We do not store card data.",
    icon: "credit-card",
  },
  {
    title: "Refundable deposit: $100 USD",
    subtitle:
      "Temporarily held and released 48h after check-out if there is no damage.",
    icon: "shield",
  },
  {
    title: "Minimum stay: 1 night",
    subtitle:
      "Maximum stay: 30 nights. Discounts available from 7 nights.",
    icon: "file-text",
  },
];

export const RATING_BREAKDOWN_EN = [
  { category: "Cleanliness", score: 5.0 },
  { category: "Communication", score: 5.0 },
  { category: "Location", score: 4.9 },
  { category: "Value", score: 4.8 },
  { category: "Check-in", score: 5.0 },
];

export const REVIEWS = [
  {
    name: "María Rodríguez",
    initials: "MR",
    date: "Noviembre 2024",
    rating: 5,
    text: "Un lugar absolutamente encantador. La ubicación es inmejorable, literalmente a pasos del Alcázar de Colón. El apartamento está impecable y la comunicación con el anfitrión fue excelente.",
  },
  {
    name: "James Lewis",
    initials: "JL",
    date: "Octubre 2024",
    rating: 5,
    text: 'Perfect for a romantic getaway. The colonial charm combined with modern amenities made it feel like a five-star boutique hotel. The terrace was our favorite spot for morning coffee.',
  },
  {
    name: "Sophie Gauthier",
    initials: "SG",
    date: "Septiembre 2024",
    rating: 5,
    text: "Magnifique! L'appartement est exactement comme sur les photos. La Zone coloniale est magique le soir. On a adoré la décoration et le lit était très confortable. Merci pour tout!",
  },
  {
    name: "Carlos Méndez",
    initials: "CM",
    date: "Agosto 2024",
    rating: 4,
    text: "Excelente opción en la Zona Colonial. Muy limpio y bien equipado. La cerradura inteligente facilita mucho el check-in. Único detalle: el ruido de la calle temprano en la mañana, pero es parte del encanto.",
  },
];

export const BLOG_POSTS = [
  {
    slug: "lugares-imprescindibles-zona-colonial",
    title: "10 lugares imprescindibles en la Zona Colonial de Santo Domingo",
    excerpt:
      "Descubre los monumentos históricos, cafés escondidos y galerías de arte que hacen de la Zona Colonial un destino único en el Caribe.",
    coverImage: "https://picsum.photos/seed/blog-colonial/600/380.jpg",
    category: "Guía",
    readTime: "5 min",
    date: "12 Nov 2024",
    content: `La Zona Colonial de Santo Domingo es un tesoro vivo de la historia americana. Declarada Patrimonio de la Humanidad por la UNESCO en 1990, esta zona alberga las primeras instituciones del Nuevo Mundo.\n\n## 1. Alcázar de Colón\nEl palacio del virrey Diego Colón, hijo del almirante, es una joya arquitectónica que combina estilos gótico y renacentista. Sus salas muestran mobiliario original y obras de arte del siglo XVI.\n\n## 2. Catedral Primada de América\nLa primera catedral construida en el continente americano. Su fachada de piedra coralina y su interior gótico son impresionantes. No te pierdas la capilla de la Inmaculada Concepción.\n\n## 3. Panteón Nacional\nOriginalmente una iglesia jesuita, hoy alberga los restos de los próceres dominicanos. Su altar de mármol y su cúpula son dignos de admiración.\n\n## 4. Calle Las Damas\nLa calle más antigua de América, donde se encuentra Casa La Maria. Pasear por ella es viajar en el tiempo entre edificios coloniales restaurados.\n\n## 5. Museo de las Casas Reales\nEste museo documenta la historia colonial de la isla con una impresionante colección de objetos y mapas antiguos.\n\n## 6. Plaza de España\nUna amplia plaza bordeada de restaurantes y terrazas, perfecta para disfrutar de una cena al aire libre con vista al río Ozama.\n\n## 7. Fortaleza Ozama\nLa fortaleza militar más antigua de América ofrece vistas panorámicas de la ciudad y el río desde su torre del Homenaje.\n\n## 8. Museo del Chocolate\nUna experiencia deliciosa donde puedes aprender sobre la historia del cacao en la isla y degustar chocolate artesanal.\n\n## 9. Parque Colón\nEl corazón de la Zona Colonial, con su estatua de Colón y la catedral de fondo, es el punto de encuentro perfecto.\n\n## 10. Malecón\nEl paseo marítimo de Santo Domingo ofrece las mejores puestas de sol del Caribe, a solo 10 minutos caminando desde Casa La Maria.`,
  },
  {
    slug: "guia-gastronomica-casa-la-maria",
    title: "Guía gastronómica: dónde comer cerca de Casa La Maria",
    excerpt:
      "Desde comida criolla tradicional hasta cocina de autor, te contamos los mejores restaurantes a menos de 5 minutos caminando.",
    coverImage: "https://picsum.photos/seed/blog-comida-sd/600/380.jpg",
    category: "Gastronomía",
    readTime: "7 min",
    date: "28 Oct 2024",
    content: `Santo Domingo es un paraíso gastronómico, y la Zona Colonial concentra algunos de los mejores restaurantes del Caribe. Aquí te presentamos nuestras recomendaciones favoritas, todas a poca distancia de Casa La Maria.\n\n## Comida Criolla Tradicional\n\n### Restaurante Lulú (1 min)\nJusto al salir de Casa La Maria. Especialidades: mangú con los tres golpes, sancocho y mofongo. El ambiente es acogedor y los precios muy razonables.\n\n### La Atarazana (3 min)\nEn una antigua bodega colonial junto al río. Es famoso por su pescado frito con tostones y su ambiente rústico-auténtico.\n\n## Cocina de Autor\n\n### Pat'e Palo (4 min)\nEl primer restaurante europeo de la Zona Colonial. Su menú fusiona técnicas francesas con ingredientes dominicanos. Reserva imprescindible.\n\n### Mesón de Bari (5 min)\nCocina mediterránea con toque caribeño en un patio colonial iluminado con velas. El risotto de camarones es espectacular.\n\n## Café y Repostería\n\n### El Convento (2 min)\nCafetería boutique en un antiguo convento. Café orgánico dominicano y pasteles artesanales. Perfecto para desayunar.`,
  },
  {
    slug: "playa-guibia-secreto-santo-domingo",
    title: "Playa Güibia: el secreto mejor guardado de Santo Domingo",
    excerpt:
      "A solo 10 minutos caminando de Casa La Maria, esta playa urbana ofrece las mejores puestas de sol de la capital dominicana.",
    coverImage: "https://picsum.photos/seed/blog-playa-guibia/600/380.jpg",
    category: "Playas",
    readTime: "4 min",
    date: "15 Oct 2024",
    content: `La Playa Güibia es una joya urbana que muchos turistas desconocen. Ubicada en el Malecón de Santo Domingo, a solo 800 metros de Casa La Maria, esta playa ofrece una experiencia auténtica y relajada.\n\n## Lo que hace especial a Güibia\n\nA diferencia de las playas turísticas, Güibia es donde van los locales. Aquí encontrarás familias disfrutando del atardecer, parejas caminando por el Malecón y surfistas aprovechando las olas del atardecer.\n\n## Mejor momento para ir\n\nEl atardecer es mágico. Llega alrededor de las 5:00 PM, compra una piña fría de los vendedores ambulantes y siéntate en el malecón a disfrutar del espectáculo de colores sobre el Mar Caribe.\n\n## Actividades\n\n- Surf: Las olas son perfectas para principiantes\n- Paddleboard: Se pueden alquilar tablas cerca\n- Voleibol de playa: Partidas espontáneas al atardecer\n- Senderismo: El Malecón se extiende por kilómetros`,
  },
];

export const FAQS = [
  {
    question: "¿Cuál es la política de cancelación?",
    answer:
      "Cancelación gratuita hasta 7 días antes del check-in. Después de ese plazo, se cobrará el 50% del total de la reserva. No-show: 100% del total. Las cancelaciones por fuerza mayor se evalúan individualmente.",
  },
  {
    question: "¿A qué hora es el check-in y check-out?",
    answer:
      "Check-in a partir de las 3:00 PM y check-out antes de las 11:00 AM. Ofrecemos early check-in (12:00 PM) y late check-out (1:00 PM) sin costo adicional, sujetos a disponibilidad. Contáctanos para confirmar.",
  },
  {
    question: "¿Hay estacionamiento disponible?",
    answer:
      "No tenemos estacionamiento propio por ser un edificio histórico. Sin embargo, hay 3 parqueos públicos a menos de 2 minutos caminando con tarifas desde $5 USD por día. También puedes coordinar un servicio de valet parking con nosotros ($15 USD/día).",
  },
  {
    question: "¿Está cerca de la playa?",
    answer:
      "¡Sí! La Playa Güibia está a solo 10 minutos caminando (800m). Es una playa urbana con vistas al Mar Caribe y los mejores atardeceres de Santo Domingo. Si prefieres playas de arena blanca, Boca Chica está a 30 minutos en taxi y Juan Dolio a 45 minutos.",
  },
  {
    question: "¿Cómo funciona el acceso al apartamento?",
    answer:
      "Acceso 100% autónomo con cerradura inteligente. Recibirás un código único 24 horas antes de tu llegada por email y WhatsApp. No necesitas coordinar horarios ni esperar a nadie. El código cambia con cada huésped para mayor seguridad.",
  },
];

export const FAQS_EN = [
  {
    question: "What is the cancellation policy?",
    answer:
      "Free cancellation up to 7 days before check-in. After that, 50% of the total booking will be charged. No-show: 100% of the total. Force majeure cancellations are evaluated individually.",
  },
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in from 3:00 PM and check-out before 11:00 AM. We offer early check-in (12:00 PM) and late check-out (1:00 PM) at no extra cost, subject to availability. Contact us to confirm.",
  },
  {
    question: "Is parking available?",
    answer:
      "We don't have our own parking as it's a historic building. However, there are 3 public parking lots within a 2-minute walk with rates starting at $5 USD per day. You can also arrange valet parking with us ($15 USD/day).",
  },
  {
    question: "Is it close to the beach?",
    answer:
      "Yes! Güibia Beach is just a 10-minute walk away (800m). It's an urban beach with views of the Caribbean Sea and the best sunsets in Santo Domingo. If you prefer white sand beaches, Boca Chica is 30 minutes by taxi and Juan Dolio is 45 minutes.",
  },
  {
    question: "How does apartment access work?",
    answer:
      "100% autonomous access with a smart lock. You'll receive a unique code 24 hours before your arrival via email and WhatsApp. No need to coordinate schedules or wait for anyone. The code changes with each guest for added security.",
  },
];

export const LONG_STAY_DISCOUNTS = [
  { minNights: 7, discount: 0.1, label: "10% desc." },
  { minNights: 14, discount: 0.15, label: "15% desc." },
  { minNights: 28, discount: 0.2, label: "20% desc." },
];

// Simulated booked dates
export const BOOKED_DATES = [
  "2025-01-15",
  "2025-01-16",
  "2025-01-17",
  "2025-01-18",
  "2025-01-19",
  "2025-01-20",
  "2025-02-01",
  "2025-02-02",
  "2025-02-03",
  "2025-02-04",
  "2025-02-05",
  "2025-02-14",
  "2025-02-15",
  "2025-02-16",
  "2025-03-01",
  "2025-03-02",
  "2025-03-03",
  "2025-03-04",
  "2025-03-05",
  "2025-03-06",
  "2025-03-07",
];
