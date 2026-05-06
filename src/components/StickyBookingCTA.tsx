"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  /** Slug of the apartment to deep-link the booking flow into. */
  apartmentSlug: string;
  /** "es" | "en". */
  locale: string;
  /** "From $89" copy for the right-side label. */
  fromPriceLabel?: string;
}

/**
 * Sticky bottom-aligned booking CTA that rotates its primary message based
 * on scroll position. Three breakpoints:
 *   - 0–30%   : "Check Dates – No Fees"
 *   - 30–70%  : "See tonight's price"
 *   - 70%+    : "Book in 2 minutes"
 *
 * The bar fades in after the first 200px of scroll so it doesn't compete
 * with the hero image. Mobile = full-width bottom bar; desktop = pill-shaped
 * floating bar centered.
 */
export function StickyBookingCTA({ apartmentSlug, locale, fromPriceLabel }: Props) {
  const isEN = locale === "en";
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window === "undefined") return;
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = total > 0 ? scrolled / total : 0;
      setVisible(scrolled > 200);
      setPhase(pct < 0.3 ? 0 : pct < 0.7 ? 1 : 2);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const messages = isEN
    ? [
        { primary: "Check dates — no fees", secondary: "Direct booking" },
        { primary: "See tonight's price", secondary: "No platform fees" },
        { primary: "Book in 2 minutes", secondary: "WhatsApp host" },
      ]
    : [
        { primary: "Consulta fechas — sin comisiones", secondary: "Reserva directa" },
        { primary: "Ve el precio de hoy", secondary: "Sin comisión" },
        { primary: "Reserva en 2 minutos", secondary: "WhatsApp con el host" },
      ];

  const reservaPath = isEN
    ? `/en/book?apt=${apartmentSlug}`
    : `/es/reserva?apt=${apartmentSlug}`;
  const msg = messages[phase];

  // Fully unmount the bar while hidden so the inner Link can't be tab-focused
  // (otherwise Lighthouse flags aria-hidden-focus). It still mounts/unmounts
  // smoothly because the parent fade transition is on the wrapper opacity.
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-3 inset-x-3 md:bottom-5 md:left-1/2 md:right-auto md:-translate-x-1/2 z-40 transition-opacity duration-300"
    >
      <div className="md:w-[420px] mx-auto rounded-full bg-foreground text-background shadow-2xl flex items-center justify-between gap-3 pl-5 pr-1.5 py-1.5">
        <div className="flex flex-col leading-tight">
          <span className="text-sm md:text-[15px] font-semibold whitespace-nowrap">
            {msg.primary}
          </span>
          <span className="text-[11px] text-background/65 whitespace-nowrap">
            {fromPriceLabel ? `${fromPriceLabel} · ${msg.secondary}` : msg.secondary}
          </span>
        </div>
        <Link
          href={reservaPath}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
        >
          {isEN ? "Reserve" : "Reservar"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
