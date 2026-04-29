'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { formatApartmentPrice } from '@/lib/format-price';

type Apartment = {
  slug: string;
  price_standard_dop?: number | null;
  price_flexible_dop?: number | null;
  price_base_usd?: number | null;
  price_currency?: string | null;
};

export function ApartmentPriceBlock({ apartment, locale }: { apartment: Apartment; locale: string }) {
  const isEN = locale === 'en';
  const bookHref = isEN ? `/en/book?apt=${apartment.slug}` : `/es/reserva?apt=${apartment.slug}`;

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-medium text-foreground text-sm mb-0.5">
        {isEN ? 'Non-refundable rate' : 'Tarifa no reembolsable'}
      </p>
      <p className="font-serif text-2xl text-foreground font-semibold">{formatApartmentPrice(apartment, isEN)}</p>
      <p className="text-xs text-muted-foreground mb-4">
        {isEN ? 'per night · Pay at property before arrival' : 'por noche · Pago al alojamiento antes de llegar'}
      </p>
      <ul className="space-y-1 mb-4">
        <li className="flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
          {isEN ? 'Best price guaranteed' : 'Mejor precio garantizado'}
        </li>
        <li className="flex items-center gap-2 text-xs text-muted-foreground">
          <XCircle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
          {isEN ? 'Non-refundable — see T&C' : 'No reembolsable — ver T&C'}
        </li>
      </ul>
      <Button asChild size="sm" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        <Link href={`${bookHref}&rate=standard`}>
          {isEN ? 'Reserve' : 'Reservar'}
        </Link>
      </Button>
    </div>
  );
}
