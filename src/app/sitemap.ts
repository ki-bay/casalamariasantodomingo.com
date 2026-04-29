import type { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-static";

const BASE = "https://casalamariazonacolonial.com";
const TODAY = new Date().toISOString().split("T")[0];

// Cloudinary images used on each major static page
const HERO_IMAGES = [
  "https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp",
  "https://res.cloudinary.com/dspogotur/image/upload/v1776784040/Casa_la_Maria_zona_colonial_santo_domingo.webp",
  "https://res.cloudinary.com/dspogotur/image/upload/v1776784038/Casa_la_Maria_zona_colonial_santo_domingo_hotel.webp",
  "https://res.cloudinary.com/dspogotur/image/upload/v1776784036/Casa_la_Maria_zona_colonial.webp",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Fetch apartment slugs + images from Supabase ──
  const { data: apartments } = await supabase
    .from("apartments")
    .select("slug, images")
    .eq("available", true);

  const aptEntries = (apartments || []).flatMap((apt) => {
    const imgs: string[] = (apt.images || [])
      .map((i: { url: string }) => i.url)
      .filter(Boolean);

    return [
      {
        url: `${BASE}/es/apartamentos/${apt.slug}`,
        lastModified: TODAY,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: {
          languages: {
            es: `${BASE}/es/apartamentos/${apt.slug}`,
            en: `${BASE}/en/apartments/${apt.slug}`,
          },
        },
        images: imgs,
      },
      {
        url: `${BASE}/en/apartments/${apt.slug}`,
        lastModified: TODAY,
        changeFrequency: "weekly" as const,
        priority: 0.85,
        alternates: {
          languages: {
            es: `${BASE}/es/apartamentos/${apt.slug}`,
            en: `${BASE}/en/apartments/${apt.slug}`,
          },
        },
        images: imgs,
      },
    ];
  });

  // ── Static pages ──
  const staticPages: MetadataRoute.Sitemap = [
    // Homepages
    {
      url: `${BASE}/es`,
      lastModified: TODAY,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: { es: `${BASE}/es`, en: `${BASE}/en` } },
      images: HERO_IMAGES,
    },
    {
      url: `${BASE}/en`,
      lastModified: TODAY,
      changeFrequency: "weekly",
      priority: 1.0,
      alternates: { languages: { es: `${BASE}/es`, en: `${BASE}/en` } },
      images: HERO_IMAGES,
    },

    // Blog index
    {
      url: `${BASE}/es/blog`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: { es: `${BASE}/es/blog`, en: `${BASE}/en/blog` } },
    },
    {
      url: `${BASE}/en/blog`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: { languages: { es: `${BASE}/es/blog`, en: `${BASE}/en/blog` } },
    },

    // Blog post — Wine Tasting at Ocoa Bay
    {
      url: `${BASE}/es/blog/wine-tasting-ocoa-bay`,
      lastModified: "2026-04-29",
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${BASE}/es/blog/wine-tasting-ocoa-bay`,
          en: `${BASE}/en/blog/wine-tasting-ocoa-bay`,
        },
      },
      images: [
        "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-01.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-02.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-03.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/full-experiences.jpg",
        "https://ocoabay.com/wp-content/uploads/2025/06/gastronomy.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/Beach-img.webp",
      ],
    },
    {
      url: `${BASE}/en/blog/wine-tasting-ocoa-bay`,
      lastModified: "2026-04-29",
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${BASE}/es/blog/wine-tasting-ocoa-bay`,
          en: `${BASE}/en/blog/wine-tasting-ocoa-bay`,
        },
      },
      images: [
        "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-01.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-02.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/Wine-Tour-Tasting-03.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/full-experiences.jpg",
        "https://ocoabay.com/wp-content/uploads/2025/06/gastronomy.webp",
        "https://ocoabay.com/wp-content/uploads/2025/06/Beach-img.webp",
      ],
    },

    // Blog post — Zona Colonial
    {
      url: `${BASE}/es/blog/zona-colonial-santo-domingo`,
      lastModified: "2026-04-21",
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${BASE}/es/blog/zona-colonial-santo-domingo`,
          en: `${BASE}/en/blog/zona-colonial-santo-domingo`,
        },
      },
      images: [
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp",
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784040/Casa_la_Maria_zona_colonial_santo_domingo.webp",
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784038/Casa_la_Maria_zona_colonial_santo_domingo_hotel.webp",
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784036/Casa_la_Maria_zona_colonial.webp",
      ],
    },
    {
      url: `${BASE}/en/blog/zona-colonial-santo-domingo`,
      lastModified: "2026-04-21",
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          es: `${BASE}/es/blog/zona-colonial-santo-domingo`,
          en: `${BASE}/en/blog/zona-colonial-santo-domingo`,
        },
      },
      images: [
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784041/Fotografo_babula_shots_rd.webp",
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784040/Casa_la_Maria_zona_colonial_santo_domingo.webp",
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784038/Casa_la_Maria_zona_colonial_santo_domingo_hotel.webp",
        "https://res.cloudinary.com/dspogotur/image/upload/v1776784036/Casa_la_Maria_zona_colonial.webp",
      ],
    },

    // Gallery
    {
      url: `${BASE}/es/galeria`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: { es: `${BASE}/es/galeria`, en: `${BASE}/en/gallery` } },
      images: HERO_IMAGES,
    },
    {
      url: `${BASE}/en/gallery`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: { es: `${BASE}/es/galeria`, en: `${BASE}/en/gallery` } },
      images: HERO_IMAGES,
    },

    // Contact
    {
      url: `${BASE}/es/contacto`,
      lastModified: TODAY,
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: { languages: { es: `${BASE}/es/contacto`, en: `${BASE}/en/contact` } },
    },
    {
      url: `${BASE}/en/contact`,
      lastModified: TODAY,
      changeFrequency: "yearly",
      priority: 0.6,
      alternates: { languages: { es: `${BASE}/es/contacto`, en: `${BASE}/en/contact` } },
    },

    // Reserva / Book
    {
      url: `${BASE}/es/reserva`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { es: `${BASE}/es/reserva`, en: `${BASE}/en/book` } },
    },
    {
      url: `${BASE}/en/book`,
      lastModified: TODAY,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: { languages: { es: `${BASE}/es/reserva`, en: `${BASE}/en/book` } },
    },

    // Terms
    {
      url: `${BASE}/es/terminos`,
      lastModified: TODAY,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: { es: `${BASE}/es/terminos`, en: `${BASE}/en/terms` } },
    },
    {
      url: `${BASE}/en/terms`,
      lastModified: TODAY,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: { languages: { es: `${BASE}/es/terminos`, en: `${BASE}/en/terms` } },
    },
  ];

  return [...staticPages, ...aptEntries];
}
