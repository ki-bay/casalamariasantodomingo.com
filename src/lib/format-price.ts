// Apartment price formatter — handles both legacy DOP rows and
// new Lodgify-synced rows that have price_base_usd. Null-safe so
// prerender doesn't crash on apartments missing one or the other.

export type PriceableApartment = {
  price_standard_dop?: number | null;
  price_base_usd?: number | null;
  price_currency?: string | null;
};

export function formatApartmentPrice(apt: PriceableApartment, isEN: boolean): string {
  // Prefer Lodgify USD when present (new path)
  if (apt.price_base_usd != null) {
    const formatted = `$${Math.round(apt.price_base_usd)}`;
    return isEN ? `${formatted} USD` : `${formatted} USD`;
  }
  // Legacy DOP fallback
  if (apt.price_standard_dop != null) {
    return isEN
      ? `$${Math.round(apt.price_standard_dop * 0.0167)} USD`
      : `DOP ${apt.price_standard_dop.toLocaleString("es-DO")}`;
  }
  return isEN ? "On request" : "A consultar";
}
