export const PROPERTY = {
  name: "Casa La Maria",
  slug: "casa-la-maria",
  description:
    "Casa La Maria es un apartamento ubicado en una edificación restaurada del siglo XVI en la emblemática Calle Parmenio Troncoso. Nuestro espacio combina la autenticidad de los muros de piedra coralina con un diseño interior contemporáneo de líneas limpias. El apartamento de 55m² está diseñado para parejas o viajeros solos que buscan una experiencia íntima y cultural en el corazón del Distrito Colonial, declarado Patrimonio de la Humanidad por la UNESCO. Cada detalle ha sido cuidadosamente seleccionado: desde la ropa de cama de algodón egipcio hasta las obras de arte de artistas dominicanos locales. Desde tu puerta, caminas directamente al Alcázar de Colón, la Catedral Primada de América, el Panteón Nacional y decenas de restaurantes, cafés y galerías de arte. La Playa Güibia está a solo 25 minutos a pie.",
  shortDescription:
    "Disfruta de un refugio exclusivo de un dormitorio situado en el epicentro de la Ciudad Colonial de Santo Domingo, la primera ciudad fundada en América. Este espacio ha sido diseñado como un santuario donde la majestuosidad de la arquitectura histórica se fusiona en perfecta armonía con el confort contemporáneo más exigente. Aquí, podrás sumergirte en el legado de siglos pasados mientras gozas de todas las comodidades modernas, creando una experiencia de alojamiento inigualable en el corazón del Caribe.",
  address: "Parmenio Troncoso 4, Santo Domingo 10210",
  city: "Santo Domingo",
  country: "República Dominicana",
  lat: 18.469990300133684,
  lng: -69.88640158707528,
  maxGuests: 4,
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
    "Casa La Maria is an apartment located in a restored 16th-century building on the emblematic Calle Parmenio Troncoso. Our space blends the authenticity of coral stone walls with a contemporary interior design of clean lines. The 55m² apartment is designed for couples or solo travelers seeking an intimate and cultural experience in the heart of the Colonial District, declared a UNESCO World Heritage Site. Every detail has been carefully selected: from Egyptian cotton bed linens to works by local Dominican artists. From your door, you walk directly to the Alcázar de Colón, the Catedral Primada de América, the Panteón Nacional and dozens of restaurants, cafés and art galleries. Playa Güibia is just 25 minutes on foot.",
  shortDescription:
    "Enjoy an exclusive one-bedroom retreat nestled in the epicenter of the Colonial City of Santo Domingo, the first city founded in the Americas. This space has been designed as a sanctuary where the majesty of historic architecture blends in perfect harmony with the most refined contemporary comfort. Here, you can immerse yourself in the legacy of centuries past while enjoying all modern amenities, creating an unparalleled lodging experience in the heart of the Caribbean.",
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
    title: "Tarifa no reembolsable",
    subtitle:
      "Desafortunadamente esta tarifa no es reembolsable. El pago es requerido antes de la llegada. Consulta nuestros Términos y Condiciones.",
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
      "Estancia máxima: 30 noches.",
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
  { name: "Playa Güibia", icon: "palm-tree", time: "25 min" },
  { name: "Aeropuerto SDQ", icon: "plane", time: "35 min" },
  { name: "Blue Mall", icon: "shopping-bag", time: "15 min" },
  { name: "Restaurante Jalao", icon: "wine", time: "5 min" },
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
    title: "Non-refundable rate",
    subtitle:
      "Unfortunately this rate is non-refundable. Payment is required before arrival. Please see our Terms & Conditions.",
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
      "Maximum stay: 30 nights.",
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
    slug: "zona-colonial-santo-domingo",
    title: "Zona Colonial Santo Domingo: Qué Ver + Itinerario + Mapa (2026)",
    excerpt:
      "Guía completa con todo lo que necesitas saber: lugares imprescindibles, itinerario de 1 y 2 días, mapa interactivo, restaurantes y consejos de seguridad. Patrimonio UNESCO.",
    coverImage:
      "https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp",
    category: "Guía",
    readTime: "8 min",
    date: "21 Abr 2026",
    content: "",
  },
];

export const FAQS = [
  {
    question: "¿Cuál es la política de cancelación?",
    answer:
      "Todas nuestras reservas son no reembolsables. El pago es requerido antes de la llegada. En caso de fuerza mayor o circunstancias excepcionales, cada caso es evaluado individualmente. Consulta nuestros Términos y Condiciones para más detalles.",
  },
  {
    question: "¿A qué hora es el check-in y check-out?",
    answer:
      "Check-in a partir de las 3:00 PM y check-out antes de las 11:00 AM. Ofrecemos early check-in (12:00 PM) y late check-out (1:00 PM) sin costo adicional, sujetos a disponibilidad. Contáctanos para confirmar.",
  },
  {
    question: "¿Hay estacionamiento disponible?",
    answer:
      "No tenemos estacionamiento propio por ser un edificio histórico. Sin embargo, hay espacios disponibles en la vía pública en la zona. En caso de emergencia, contamos con 2 plazas reservadas sin costo adicional para nuestros huéspedes. Contáctanos para coordinar.",
  },
  {
    question: "¿Está cerca de la playa?",
    answer:
      "¡Sí! La Playa Güibia está a 25 minutos caminando. Es una playa urbana con vistas al Mar Caribe y los mejores atardeceres de Santo Domingo. Si prefieres playas de arena blanca, Boca Chica está a 30 minutos en taxi y Juan Dolio a 45 minutos.",
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
      "All bookings are non-refundable. Payment is required before arrival. In cases of force majeure or exceptional circumstances, each case is evaluated individually. Please see our Terms & Conditions for full details.",
  },
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in from 3:00 PM and check-out before 11:00 AM. We offer early check-in (12:00 PM) and late check-out (1:00 PM) at no extra cost, subject to availability. Contact us to confirm.",
  },
  {
    question: "Is parking available?",
    answer:
      "We don't have our own parking as it's a historic building. However, there is street parking available in the area. In case of emergency, we have 2 reserved spaces at no extra cost for our guests. Contact us to arrange.",
  },
  {
    question: "Is it close to the beach?",
    answer:
      "Yes! Güibia Beach is a 25-minute walk away. It's an urban beach with views of the Caribbean Sea and the best sunsets in Santo Domingo. If you prefer white sand beaches, Boca Chica is 30 minutes by taxi and Juan Dolio is 45 minutes.",
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
