"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BedDouble, Users, Ruler, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Apartment {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  bedrooms: number;
  size_m2: number;
  max_guests: number;
  has_balcony: boolean;
  has_terrace: boolean;
  price_standard_dop: number;
  price_flexible_dop: number;
  images: { url: string; alt_es: string; alt_en: string }[];
}

interface Props {
  apartment: Apartment;
  locale: string;
}

export function ApartmentCard({ apartment, locale }: Props) {
  const [rateUSD, setRateUSD] = useState<number>(0.0167);
  const isEN = locale === "en";

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/DOP")
      .then(r => r.json())
      .then(d => { if (d.rates?.USD) setRateUSD(d.rates.USD); })
      .catch(() => {});
  }, []);

  const name = isEN ? apartment.name_en : apartment.name_es;
  const description = isEN ? apartment.description_en : apartment.description_es;
  const price = apartment.price_standard_dop;
  const priceDisplay = isEN
    ? `$${(price * rateUSD).toFixed(0)}`
    : `DOP ${price.toLocaleString('es-DO')}`;

  const href = isEN
    ? `/en/apartments/${apartment.slug}`
    : `/es/apartamentos/${apartment.slug}`;

  const bookHref = isEN ? `/en/book?apt=${apartment.slug}` : `/es/reserva?apt=${apartment.slug}`;

  const mainImage = apartment.images?.[0];

  return (
    <article className="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-black/20 flex flex-col group">
      {/* Image */}
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={isEN ? mainImage.alt_en : mainImage.alt_es}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted-foreground/10 flex items-center justify-center">
            <BedDouble className="w-12 h-12 text-muted-foreground/30" />
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Link href={href}>
          <h2 className="font-serif text-lg text-foreground mb-2 group-hover:text-accent transition-colors leading-tight">
            {name}
          </h2>
        </Link>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" />
            {apartment.bedrooms} {isEN ? apartment.bedrooms === 1 ? "bed" : "beds" : apartment.bedrooms === 1 ? "hab." : "habs."}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            {apartment.max_guests} {isEN ? "guests" : "huéspedes"}
          </span>
          <span className="flex items-center gap-1">
            <Ruler className="w-3.5 h-3.5" />
            {apartment.size_m2} m²
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
          {description}
        </p>

        {/* Price + CTA */}
        <div className="flex items-end justify-between gap-3 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-muted-foreground">{isEN ? "From" : "Desde"}</span>
              <span className="text-xl font-semibold text-foreground">{priceDisplay}</span>
            </div>
            <span className="text-[11px] text-muted-foreground">/ {isEN ? "night" : "noche"}</span>
          </div>
          <div className="flex gap-2">
            <Link href={href}>
              <Button variant="outline" size="sm" className="text-xs border-border hover:border-accent hover:text-accent">
                {isEN ? "Details" : "Ver más"}
              </Button>
            </Link>
            <Link href={bookHref}>
              <Button size="sm" className="text-xs bg-accent text-accent-foreground hover:opacity-90">
                {isEN ? "Book" : "Reservar"}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
