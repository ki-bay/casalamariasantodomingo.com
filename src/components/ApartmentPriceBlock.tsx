'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

type Apartment = {
  slug: string;
  price_standard_dop: number;
  price_flexible_dop: number;
};

export function ApartmentPriceBlock({ apartment, locale }: { apartment: Apartment; locale: string }) {
  const [rate, setRate] = useState<number | null>(null);
  const isEN = locale === 'en';
  const bookHref = isEN ? `/en/book?apt=${apartment.slug}` : `/es/reserva?apt=${apartment.slug}`;

  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/DOP")
      .then(r => r.json())
      .then(d => setRate(d.rates?.USD ?? null))
      .catch(() => setRate(null));
  }, []);

  const fmt = (dop: number) => {
    if (isEN && rate) {
      const usd = dop / rate;
      return `$${usd.toFixed(0)} USD`;
    }
    return `DOP ${dop.toLocaleString('es-DO')}`;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="font-medium text-foreground text-sm mb-0.5">
        {isEN ? 'Non-refundable rate' : 'Tarifa no reembolsable'}
      </p>
      <p className="font-serif text-2xl text-foreground font-semibold">{fmt(apartment.price_standard_dop)}</p>
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
