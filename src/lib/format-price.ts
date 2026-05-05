// Apartment price formatter — handles three sources, in priority order:
//   1. Per-occupancy DOP rates (price_1guest_dop / 2 / 4) — sourced from
//      Booking.com listings; this is the current source of truth.
//   2. Lodgify-synced USD floor (price_base_usd) — fallback for newly
//      synced rows that don't yet have per-occupancy rates.
//   3. Legacy DOP rate (price_standard_dop) — pre-Lodgify fallback.
//
// USD shown to the guest is computed from the DOP rate using a constant
// conversion (60 DOP/USD ≈ rate as of mid-2026). Stripe still charges in
// USD; Lodgify booking total comes from its own rate calendar.

const DOP_PER_USD = 60;

export type PriceableApartment = {
  price_1guest_dop?: number | null;
  price_2guest_dop?: number | null;
  price_4guest_dop?: number | null;
  price_standard_dop?: number | null;
  price_base_usd?: number | null;
  price_currency?: string | null;
};

/**
 * Returns the per-night DOP price for the given guest count.
 * 3-guest rate is interpolated as midpoint of 2 and 4 (Booking.com
 * doesn't surface a separate 3-guest tier).
 */
export function nightlyDopForGuests(
  apt: PriceableApartment,
  guests: number,
): number | null {
  const g = Math.max(1, Math.min(4, Math.round(guests)));
  if (g <= 1) return apt.price_1guest_dop ?? null;
  if (g === 2) return apt.price_2guest_dop ?? null;
  if (g === 3) {
    const p2 = apt.price_2guest_dop;
    const p4 = apt.price_4guest_dop;
    if (p2 != null && p4 != null) return (Number(p2) + Number(p4)) / 2;
    return (p2 ?? p4 ?? null) as number | null;
  }
  return apt.price_4guest_dop ?? null;
}

export function nightlyUsdForGuests(
  apt: PriceableApartment,
  guests: number,
): number | null {
  const dop = nightlyDopForGuests(apt, guests);
  if (dop == null) return null;
  return Math.round(Number(dop) / DOP_PER_USD);
}

/**
 * "From" price for cards/listings — uses the cheapest tier (1-guest) so
 * shoppers see the floor price, just like Booking.com's "desde X" copy.
 */
export function formatApartmentPrice(apt: PriceableApartment, isEN: boolean): string {
  // Preferred: per-occupancy DOP rate from Booking
  if (apt.price_1guest_dop != null) {
    const usd = Math.round(Number(apt.price_1guest_dop) / DOP_PER_USD);
    return `$${usd} USD`;
  }
  // Fallback: Lodgify-synced USD floor
  if (apt.price_base_usd != null) {
    return `$${Math.round(apt.price_base_usd)} USD`;
  }
  // Legacy DOP fallback
  if (apt.price_standard_dop != null) {
    return isEN
      ? `$${Math.round(apt.price_standard_dop / DOP_PER_USD)} USD`
      : `DOP ${apt.price_standard_dop.toLocaleString("es-DO")}`;
  }
  return isEN ? "On request" : "A consultar";
}
