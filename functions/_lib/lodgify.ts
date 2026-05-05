// Lodgify Public API helpers (v1 + v2). Used from Pages Functions.
//
// v1 is required for booking writes (POST /v1/reservation/booking). v2 is
// used for property/availability/quote reads. Snake_case JSON throughout v1.
// Authenticates with X-ApiKey header from LODGIFY_API_KEY env var.

const LODGIFY_BASE = "https://api.lodgify.com";

export interface LodgifyGuestName {
  first_name: string;
  last_name: string;
}

export interface LodgifyGuest {
  guest_name: LodgifyGuestName;
  email?: string;
  phone?: string;
}

export interface LodgifyRoom {
  room_type_id: number;
  people: number;
}

export interface CreateBookingInput {
  property_id: number;
  arrival: string;   // YYYY-MM-DD
  departure: string; // YYYY-MM-DD
  guest: LodgifyGuest;
  rooms: LodgifyRoom[];
  source?: string;        // "Manual" for direct bookings
  status?: string;        // "Open" | "Booked"
  total_amount?: number;
  total_paid?: number;
  currency_code?: string; // e.g. "USD"
  notes?: string;
}

export interface CreateBookingResult {
  ok: boolean;
  bookingId?: number;
  rawStatus: number;
  rawBody: string;
}

/**
 * POST /v1/reservation/booking
 * Returns the new booking's numeric id on success (HTTP 201, body = id as string).
 */
export async function lodgifyCreateBooking(
  apiKey: string,
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const body = {
    property_id: input.property_id,
    arrival: input.arrival,
    departure: input.departure,
    source: input.source ?? "Manual",
    status: input.status ?? "Booked",
    guest: input.guest,
    rooms: input.rooms,
    ...(input.total_amount != null ? { total_amount: input.total_amount } : {}),
    ...(input.total_paid != null ? { total_paid: input.total_paid } : {}),
    ...(input.currency_code ? { currency_code: input.currency_code } : {}),
    ...(input.notes ? { notes: input.notes } : {}),
  };

  const res = await fetch(`${LODGIFY_BASE}/v1/reservation/booking`, {
    method: "POST",
    headers: {
      "X-ApiKey": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    return { ok: false, rawStatus: res.status, rawBody: text };
  }
  const trimmed = text.trim();
  const idNum = /^\d+$/.test(trimmed) ? Number(trimmed) : undefined;
  return { ok: true, bookingId: idNum, rawStatus: res.status, rawBody: text };
}

/**
 * POST /v1/reservation/booking/{id}/Quote
 *
 * Creating a Quote forces Lodgify to compute total_amount from its rate
 * calendar and attach it to the booking. Without this, bookings created
 * via the public API show total_amount=0 in the Lodgify dashboard even
 * though the calendar block is correct.
 *
 * Note: Lodgify's Public API does not expose any way to set total_paid
 * (the "amount received" / "paid" status). Stripe + our Supabase
 * bookings table remain the source of truth for actual payment;
 * Lodgify's dashboard will always show the booking as "amount due".
 *
 * Returns the new quote id on 201, or {ok:false} with the raw body for
 * non-2xx so the caller can log without throwing — this call is
 * post-success polish, never load-bearing for blocking the calendar.
 */
export async function lodgifyCreateBookingQuote(
  apiKey: string,
  bookingId: number,
): Promise<{ ok: boolean; quoteId?: number; rawStatus: number; rawBody: string }> {
  const res = await fetch(
    `${LODGIFY_BASE}/v1/reservation/booking/${bookingId}/Quote`,
    {
      method: "POST",
      headers: {
        "X-ApiKey": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      // Empty body is enough — Lodgify computes total from its own rates.
      // Fields like total_amount are recalculated server-side regardless
      // of what we send (verified by probe).
      body: "{}",
    },
  );
  const text = await res.text();
  if (!res.ok) return { ok: false, rawStatus: res.status, rawBody: text };
  const trimmed = text.trim();
  const idNum = /^\d+$/.test(trimmed) ? Number(trimmed) : undefined;
  return { ok: true, quoteId: idNum, rawStatus: res.status, rawBody: text };
}

/**
 * GET /v1/reservation/booking/{id}
 */
export async function lodgifyGetBooking(
  apiKey: string,
  bookingId: number,
): Promise<{ ok: boolean; rawStatus: number; data?: unknown; rawBody: string }> {
  const res = await fetch(
    `${LODGIFY_BASE}/v1/reservation/booking/${bookingId}`,
    {
      headers: { "X-ApiKey": apiKey, Accept: "application/json" },
    },
  );
  const text = await res.text();
  if (!res.ok) return { ok: false, rawStatus: res.status, rawBody: text };
  try {
    return { ok: true, rawStatus: res.status, data: JSON.parse(text), rawBody: text };
  } catch {
    return { ok: false, rawStatus: res.status, rawBody: text };
  }
}

/**
 * Split a "Full Name" into first/last, defaulting last_name to "—" if absent
 * (Lodgify rejects empty last_name in some validation paths).
 */
export function splitFullName(full: string): LodgifyGuestName {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return { first_name: "Guest", last_name: "—" };
  if (parts.length === 1) return { first_name: parts[0], last_name: "—" };
  return {
    first_name: parts[0],
    last_name: parts.slice(1).join(" "),
  };
}
