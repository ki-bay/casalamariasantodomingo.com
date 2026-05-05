'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import { nightlyUsdForGuests, formatApartmentPrice } from '@/lib/format-price';

type Apartment = {
  slug: string;
  price_1guest_dop?: number | null;
  price_2guest_dop?: number | null;
  price_4guest_dop?: number | null;
  price_standard_dop?: number | null;
  price_base_usd?: number | null;
  price_currency?: string | null;
};

const TIERS = [1, 2, 4] as const;

export function ApartmentPriceBlock({ apartment, locale }: { apartment: Apartment; locale: string }) {
  const isEN = locale === 'en';
  const bookHref = isEN ? `/en/book?apt=${apartment.slug}` : `/es/reserva?apt=${apartment.slug}`;
  const hasTiers = apartment.price_1guest_dop != null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-medium text-foreground text-sm mb-0.5">
        {isEN ? 'Per-night rate' : 'Tarifa por noche'}
      </p>
      <p className="font-serif text-2xl text-foreground font-semibold mb-1">
        {hasTiers ? `${isEN ? 'From' : 'Desde'} ${formatApartmentPrice(apartment, isEN)}` : formatApartmentPrice(apartment, isEN)}
      </p>
      <p className="text-xs text-muted-foreground mb-4">
        {isEN ? 'per night · price varies by guest count' : 'por noche · varía según huéspedes'}
      </p>

      {hasTiers && (
        <ul className="space-y-2 mb-4">
          {TIERS.map((g) => {
            const usd = nightlyUsdForGuests(apartment, g);
            if (usd == null) return null;
            return (
              <li key={g} className="flex items-center justify-between text-sm bg-surface border border-warm-border/50 rounded-lg px-3 py-2">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Users className="w-3.5 h-3.5" />
                  {g} {isEN ? (g === 1 ? 'guest' : 'guests') : (g === 1 ? 'huésped' : 'huéspedes')}
                </span>
                <span className="font-medium text-foreground">${usd} USD</span>
              </li>
            );
          })}
        </ul>
      )}

      <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href={bookHref}>{isEN ? 'Reserve' : 'Reservar'}</Link>
      </Button>
    </div>
  );
}
