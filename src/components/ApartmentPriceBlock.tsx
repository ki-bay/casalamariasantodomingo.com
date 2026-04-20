'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

  const plans = [
    {
      key: 'standard',
      label: isEN ? 'Non-refundable' : 'No reembolsable',
      price: fmt(apartment.price_standard_dop),
      note: isEN ? 'Pay at property' : 'Pago al alojamiento',
      features: [
        { ok: true, text: isEN ? 'Best price guaranteed' : 'Mejor precio garantizado' },
        { ok: false, text: isEN ? 'No free cancellation' : 'Sin cancelación gratis' },
      ],
      recommended: false,
    },
    {
      key: 'flexible',
      label: isEN ? 'Flexible' : 'Flexible',
      price: fmt(apartment.price_flexible_dop),
      note: isEN ? 'No upfront payment' : 'Sin pago por adelantado',
      features: [
        { ok: true, text: isEN ? 'Free cancellation' : 'Cancelación gratis' },
        { ok: true, text: isEN ? 'No payment until arrival' : 'Sin pago hasta llegar' },
      ],
      recommended: true,
    },
  ];

  return (
    <div className="space-y-3">
      {plans.map(plan => (
        <div
          key={plan.key}
          className={`relative rounded-2xl border p-5 transition-all ${
            plan.recommended
              ? 'border-accent bg-accent/5'
              : 'border-border bg-card'
          }`}
        >
          {plan.recommended && (
            <Badge className="absolute -top-2.5 left-4 bg-accent text-accent-foreground text-xs">
              {isEN ? 'Recommended' : 'Recomendado'}
            </Badge>
          )}
          <p className="font-medium text-foreground text-sm mb-0.5">{plan.label}</p>
          <p className="font-serif text-2xl text-foreground font-semibold">{plan.price}</p>
          <p className="text-xs text-muted-foreground mb-3">
            {isEN ? 'per night · ' : 'por noche · '}{plan.note}
          </p>
          <ul className="space-y-1 mb-4">
            {plan.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                {f.ok
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  : <XCircle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
                }
                {f.text}
              </li>
            ))}
          </ul>
          <Button
            asChild
            size="sm"
            className={`w-full ${plan.recommended ? 'bg-accent hover:bg-accent/90 text-accent-foreground' : ''}`}
            variant={plan.recommended ? 'default' : 'outline'}
          >
            <Link href={`${bookHref}&rate=${plan.key}`}>
              {isEN ? 'Reserve' : 'Reservar'}
            </Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
