const { createClient } = require('@supabase/supabase-js');

const client = createClient(
  'https://blwodrambvrhapjplqhx.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsd29kcmFtYnZyaGFwanBscWh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjU4ODY4OSwiZXhwIjoyMDkyMTY0Njg5fQ.2UAGGTE-nzx_sfUggfvX-FZCZN8TGGrmyhh7nY3ia4M'
);

// Real Lodgify property IDs confirmed via API
// 674788=1A(1BR), 674789=2A(1BR+balcony), 674785=1B(2BR), 674786=2B(2BR+balcony), 674787=3B(2BR premium)
const apartments = [
  {
    slug: 'suite-clasica-1-hab',
    name_es: 'Suite Clásica 1 Habitación',
    name_en: 'Classic 1-Bedroom Suite',
    description_es: 'Apartamento de un dormitorio con 2 camas Queen, cocina privada equipada, baño privado y terraza con vistas a la ciudad. Ubicado en el tranquilo Callejón Regina de la Zona Colonial. Diseño minimalista con todas las comodidades modernas.',
    description_en: 'One-bedroom apartment with 2 Queen beds, fully equipped private kitchen, private bathroom, and city-view terrace. Located on the peaceful Callejón Regina in the Colonial Zone. Minimalist design with all modern amenities.',
    bedrooms: 1, bathrooms: 1,
    bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
    size_m2: 70, max_guests: 4,
    bed_config_es: '2 camas Queen size', bed_config_en: '2 Queen beds',
    has_balcony: false, has_terrace: true,
    price_standard_dop: 5603.00, price_flexible_dop: 6225.00,
    amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","city_view","private_entrance","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_dining"],
    images: [{"url":"https://l.icdbcdn.com/oh/eb482b81-04ab-4c34-aff1-e3c9d886cff7.jpg","alt_es":"Suite Clásica 1 Habitación","alt_en":"Classic 1-Bedroom Suite"}],
    lodgify_property_id: '674788',
    sort_order: 1
  },
  {
    slug: 'suite-colonial-balcon-1-hab',
    name_es: 'Suite Colonial Balcón 1 Habitación',
    name_en: 'Colonial Balcony 1-Bedroom Suite',
    description_es: 'Apartamento de un dormitorio con 2 camas Queen y amplio balcón privado. Vistas panorámicas a la ciudad, cocina privada, baño privado y acceso privado en el histórico Callejón Regina.',
    description_en: 'One-bedroom apartment with 2 Queen beds and a spacious private balcony. Panoramic city views, private kitchen, private bathroom, and private access on the historic Callejón Regina.',
    bedrooms: 1, bathrooms: 1,
    bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
    size_m2: 70, max_guests: 4,
    bed_config_es: '2 camas Queen size', bed_config_en: '2 Queen beds',
    has_balcony: true, has_terrace: true,
    price_standard_dop: 5603.00, price_flexible_dop: 6225.00,
    amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","private_entrance","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_dining"],
    images: [{"url":"https://l.icdbcdn.com/oh/3d9ff995-9469-474b-ac28-eb7ed557088f.jpg","alt_es":"Suite Colonial Balcón","alt_en":"Colonial Balcony Suite"}],
    lodgify_property_id: '674789',
    sort_order: 2
  },
  {
    slug: 'suite-estandar-2-hab',
    name_es: 'Suite Estándar 2 Habitaciones',
    name_en: 'Standard 2-Bedroom Suite',
    description_es: 'Amplio apartamento de 85 m² con dos habitaciones Queen, balcón privado, terraza y cocina equipada. Perfecto para familias o grupos en el corazón de la Zona Colonial de Santo Domingo.',
    description_en: 'Spacious 85 m² apartment with two Queen bedrooms, private balcony, terrace, and equipped kitchen. Perfect for families or groups in the heart of Santo Domingo\'s Colonial Zone.',
    bedrooms: 2, bathrooms: 1,
    bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
    size_m2: 85, max_guests: 4,
    bed_config_es: 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen', bed_config_en: 'Room 1: 1 Queen — Room 2: 1 Queen',
    has_balcony: true, has_terrace: true,
    price_standard_dop: 5603.00, price_flexible_dop: 6225.00,
    amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_dining"],
    images: [{"url":"https://l.icdbcdn.com/oh/5332ede9-9c43-4473-97d9-62dd01d1edb0.jpg","alt_es":"Suite Estándar 2 Habitaciones","alt_en":"Standard 2-Bedroom Suite"}],
    lodgify_property_id: '674785',
    sort_order: 3
  },
  {
    slug: 'suite-premium-2-hab',
    name_es: 'Suite Premium 2 Habitaciones',
    name_en: 'Premium 2-Bedroom Suite',
    description_es: 'Suite premium de 85 m² con exclusivo baño integrado de diseño contemporáneo, dos habitaciones Queen y terraza privada con vistas panorámicas. La opción más sofisticada de Casa La Maria.',
    description_en: 'Premium 85 m² suite with an exclusive en-suite bathroom of contemporary design, two Queen bedrooms, and a private terrace with panoramic views. The most sophisticated option at Casa La Maria.',
    bedrooms: 2, bathrooms: 1,
    bath_type_es: 'Baño integrado', bath_type_en: 'En-suite bathroom',
    size_m2: 85, max_guests: 4,
    bed_config_es: 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen', bed_config_en: 'Room 1: 1 Queen — Room 2: 1 Queen',
    has_balcony: false, has_terrace: true,
    price_standard_dop: 6912.00, price_flexible_dop: 7680.00,
    amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","city_view","ensuite_bath","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_dining"],
    images: [{"url":"https://l.icdbcdn.com/oh/8916f87b-c5d9-40c2-90c3-9f120eb56e5c.jpg","alt_es":"Suite Premium 2 Habitaciones","alt_en":"Premium 2-Bedroom Suite"}],
    lodgify_property_id: '674787',
    sort_order: 4
  },
  {
    slug: 'suite-deluxe-balcon-2-hab',
    name_es: 'Suite Deluxe Balcón 2 Habitaciones',
    name_en: 'Deluxe Balcony 2-Bedroom Suite',
    description_es: 'La experiencia definitiva. Suite de 85 m² con dos habitaciones Queen, balcón privado, terraza exterior y vistas espectaculares. Cocina privada completa y toda la comodidad para una estancia perfecta en la Zona Colonial.',
    description_en: 'The ultimate experience. 85 m² suite with two Queen bedrooms, private balcony, outdoor terrace, and spectacular views. Full private kitchen and complete comfort for a perfect stay in the Colonial Zone.',
    bedrooms: 2, bathrooms: 1,
    bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
    size_m2: 85, max_guests: 4,
    bed_config_es: 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen', bed_config_en: 'Room 1: 1 Queen — Room 2: 1 Queen',
    has_balcony: true, has_terrace: true,
    price_standard_dop: 6912.00, price_flexible_dop: 7680.00,
    amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_dining"],
    images: [{"url":"https://l.icdbcdn.com/oh/9d2101f5-891c-4d44-9bcc-392954c6b948.jpg","alt_es":"Suite Deluxe Balcón 2 Habitaciones","alt_en":"Deluxe Balcony 2-Bedroom Suite"}],
    lodgify_property_id: '674786',
    sort_order: 5
  }
];

async function run() {
  const { data: existing } = await client.from('apartments').select('slug').limit(1);
  if (!existing) {
    console.error('apartments table not found - run supabase/migrations/002_apartments.sql first');
    process.exit(1);
  }
  const { data, error } = await client
    .from('apartments')
    .upsert(apartments, { onConflict: 'slug' })
    .select('slug, name_es, lodgify_property_id, price_standard_dop');

  if (error) { console.error('Error:', error.message); process.exit(1); }
  console.log('Apartments seeded/updated:');
  data.forEach(a => console.log(`  ${a.lodgify_property_id} | ${a.slug} | DOP ${a.price_standard_dop}`));
}

run().catch(console.error);

async function run() {
  // Check if apartments table already exists  
  const { data: existing, error: checkErr } = await client.from('apartments').select('slug').limit(1);
  
  if (!checkErr) {
    console.log('apartments table already exists, just seeding...');
    await seedApartments();
    return;
  }
  
  console.log('apartments table does not exist yet - need to run SQL in Supabase dashboard');
  console.log('Error:', checkErr.message);
  console.log('\nSQL file ready at: supabase/migrations/002_apartments.sql');
}

async function seedApartments() {
  const apartments = [
    {
      slug: 'suite-clasica-1-hab',
      name_es: 'Suite Clásica 1 Habitación',
      name_en: 'Classic 1-Bedroom Suite',
      description_es: 'Elegante apartamento de un dormitorio con 2 camas Queen en un edificio histórico de la Zona Colonial. Disfruta de hermosas vistas a la ciudad desde nuestra terraza privada. Cocina totalmente equipada, baño privado y todas las comodidades modernas en un entorno de carácter único.',
      description_en: 'Elegant one-bedroom apartment with 2 Queen beds in a historic building in the Colonial Zone. Enjoy stunning city views from our private terrace. Fully equipped kitchen, private bathroom, and all modern amenities in a uniquely charming setting.',
      bedrooms: 1, bathrooms: 1,
      bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
      size_m2: 70, max_guests: 4,
      bed_config_es: '2 camas Queen size', bed_config_en: '2 Queen beds',
      has_balcony: false, has_terrace: true,
      price_standard_dop: 5603.00, price_flexible_dop: 6225.00,
      amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","city_view","private_entrance","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"],
      images: [],
      sort_order: 1
    },
    {
      slug: 'suite-colonial-balcon-1-hab',
      name_es: 'Suite Colonial Balcón 1 Habitación',
      name_en: 'Colonial Balcony 1-Bedroom Suite',
      description_es: 'Apartamento de un dormitorio con 2 camas Queen, amplio balcón privado y espectaculares vistas a la ciudad. Un espacio donde la arquitectura colonial del siglo XVI se funde con el lujo contemporáneo. Terraza, cocina privada y acceso privado incluidos.',
      description_en: 'One-bedroom apartment with 2 Queen beds, a private balcony and spectacular city views. A space where 16th-century colonial architecture blends with contemporary luxury. Private terrace, kitchen, and private entrance included.',
      bedrooms: 1, bathrooms: 1,
      bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
      size_m2: 70, max_guests: 4,
      bed_config_es: '2 camas Queen size', bed_config_en: '2 Queen beds',
      has_balcony: true, has_terrace: true,
      price_standard_dop: 5603.00, price_flexible_dop: 6225.00,
      amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","private_entrance","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"],
      images: [],
      sort_order: 2
    },
    {
      slug: 'suite-estandar-2-hab',
      name_es: 'Suite Estándar 2 Habitaciones',
      name_en: 'Standard 2-Bedroom Suite',
      description_es: 'Espacioso apartamento de dos dormitorios con una cama Queen en cada habitación. Perfecto para familias o grupos. Cuenta con balcón privado, terraza, cocina equipada y hermosas vistas a la ciudad. 85 m² de espacio en el corazón de la Zona Colonial.',
      description_en: 'Spacious two-bedroom apartment with one Queen bed in each room. Perfect for families or groups. Features a private balcony, terrace, fully equipped kitchen, and beautiful city views. 85 m² of space in the heart of the Colonial Zone.',
      bedrooms: 2, bathrooms: 1,
      bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
      size_m2: 85, max_guests: 4,
      bed_config_es: 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen',
      bed_config_en: 'Room 1: 1 Queen bed — Room 2: 1 Queen bed',
      has_balcony: true, has_terrace: true,
      price_standard_dop: 5603.00, price_flexible_dop: 6225.00,
      amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"],
      images: [],
      sort_order: 3
    },
    {
      slug: 'suite-premium-2-hab',
      name_es: 'Suite Premium 2 Habitaciones',
      name_en: 'Premium 2-Bedroom Suite',
      description_es: 'Nuestra suite premium de dos habitaciones destaca por su exclusivo baño integrado de diseño contemporáneo. Dos habitaciones con cama Queen, terraza privada con vistas panorámicas a la ciudad y 85 m² de lujo en la Zona Colonial.',
      description_en: 'Our premium two-bedroom suite features an exclusive contemporary en-suite bathroom. Two Queen bedrooms, a private terrace with panoramic city views, and 85 m² of luxury in the Colonial Zone.',
      bedrooms: 2, bathrooms: 1,
      bath_type_es: 'Baño integrado', bath_type_en: 'En-suite bathroom',
      size_m2: 85, max_guests: 4,
      bed_config_es: 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen',
      bed_config_en: 'Room 1: 1 Queen bed — Room 2: 1 Queen bed',
      has_balcony: false, has_terrace: true,
      price_standard_dop: 6912.00, price_flexible_dop: 7680.00,
      amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","city_view","ensuite_bath","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"],
      images: [],
      sort_order: 4
    },
    {
      slug: 'suite-deluxe-balcon-2-hab',
      name_es: 'Suite Deluxe Balcón 2 Habitaciones',
      name_en: 'Deluxe Balcony 2-Bedroom Suite',
      description_es: 'La experiencia definitiva en Casa La Maria. Suite de dos habitaciones con balcón privado y vistas espectaculares. Con dos habitaciones Queen, cocina privada completa y 85 m², es el alojamiento perfecto en Santo Domingo.',
      description_en: 'The ultimate Casa La Maria experience. Two-bedroom suite with a private balcony and spectacular views. With two Queen bedrooms, a full private kitchen, and 85 m², the perfect accommodation in Santo Domingo.',
      bedrooms: 2, bathrooms: 1,
      bath_type_es: 'Baño privado', bath_type_en: 'Private bathroom',
      size_m2: 85, max_guests: 4,
      bed_config_es: 'Hab. 1: 1 cama Queen — Hab. 2: 1 cama Queen',
      bed_config_en: 'Room 1: 1 Queen bed — Room 2: 1 Queen bed',
      has_balcony: true, has_terrace: true,
      price_standard_dop: 6912.00, price_flexible_dop: 7680.00,
      amenities: ["wifi","ac","tv","kitchen","coffee_maker","terrace","balcony","city_view","desk","fridge","microwave","iron","hair_dryer","washer_dryer","outdoor_furniture","outdoor_dining"],
      images: [],
      sort_order: 5
    }
  ];

  const { data, error } = await client
    .from('apartments')
    .upsert(apartments, { onConflict: 'slug' })
    .select('slug, name_es');
  
  if (error) {
    console.error('Seed error:', error.message);
  } else {
    console.log('Seeded apartments:');
    data.forEach(a => console.log(' -', a.slug, '|', a.name_es));
  }
}

run().catch(console.error);
