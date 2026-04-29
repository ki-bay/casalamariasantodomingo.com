// Live Lodgify quote
// GET /api/lodgify-quote?propertyId=674785&roomTypeId=741756&from=2026-05-01&to=2026-05-05&adults=2&children=0
//
// Response:
//   { propertyId, from, to, nights, currency, totalAmount, breakdown: [...], raw }
//
// Errors are returned with the body Lodgify sent so the client can show
// a meaningful message (e.g. "minimum stay not met", "dates blocked").

interface Env {
  LODGIFY_API_KEY: string;
}

const LODGIFY_BASE = "https://api.lodgify.com";
const ALLOWED_PROPERTY_IDS = new Set([
  "674785",
  "674786",
  "674787",
  "674788",
  "674789",
]);

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: cors });
  }
  if (context.request.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!context.env.LODGIFY_API_KEY) {
    return json({ error: "Lodgify not configured" }, 500);
  }

  const url = new URL(context.request.url);
  const propertyId = url.searchParams.get("propertyId") ?? "";
  const roomTypeId = url.searchParams.get("roomTypeId") ?? "";
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";
  const adults = Number.parseInt(url.searchParams.get("adults") ?? "2", 10);
  const children = Number.parseInt(url.searchParams.get("children") ?? "0", 10);
  const infants = Number.parseInt(url.searchParams.get("infants") ?? "0", 10);

  if (!ALLOWED_PROPERTY_IDS.has(propertyId)) {
    return json({ error: "Invalid propertyId" }, 400);
  }
  if (!roomTypeId || !/^\d+$/.test(roomTypeId)) {
    return json({ error: "roomTypeId required (numeric)" }, 400);
  }
  if (!isISODate(from) || !isISODate(to)) {
    return json({ error: "from and to must be YYYY-MM-DD" }, 400);
  }
  if (from >= to) {
    return json({ error: "from must be before to" }, 400);
  }
  if (adults < 1 || adults > 16) {
    return json({ error: "adults must be 1–16" }, 400);
  }

  // Lodgify quote endpoint expects roomTypes[0] etc. as separate flat params
  const qp = new URLSearchParams({
    from,
    to,
    "roomTypes[0].Id": roomTypeId,
    "roomTypes[0].People": String(adults + children),
    "guest_breakdown.adults": String(adults),
    "guest_breakdown.children": String(children),
    "guest_breakdown.infants": String(infants),
  });

  const res = await fetch(`${LODGIFY_BASE}/v2/quote/${propertyId}?${qp.toString()}`, {
    headers: {
      "X-ApiKey": context.env.LODGIFY_API_KEY,
      Accept: "application/json",
    },
  });

  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    let parsed: unknown = bodyText;
    try {
      parsed = JSON.parse(bodyText);
    } catch {
      /* leave as text */
    }
    return json(
      { error: "Lodgify quote error", status: res.status, body: parsed },
      res.status === 422 ? 422 : 502,
    );
  }

  let data: LodgifyQuote;
  try {
    data = JSON.parse(bodyText) as LodgifyQuote;
  } catch {
    return json({ error: "Lodgify returned non-JSON", preview: bodyText.slice(0, 200) }, 502);
  }

  // Lodgify returns an array of quote results (one per room type queried)
  const first = Array.isArray(data) ? data[0] : data;
  if (!first) {
    return json({ error: "Lodgify returned empty quote" }, 502);
  }

  const nights = Math.round(
    (Date.parse(to) - Date.parse(from)) / (1000 * 60 * 60 * 24),
  );

  return json({
    propertyId,
    roomTypeId,
    from,
    to,
    nights,
    currency: first.currency_code ?? "USD",
    totalAmount: first.total_including_vat ?? first.total ?? null,
    subtotal: first.subtotal ?? null,
    breakdown: first.breakdown ?? first.amount_breakdown ?? null,
    raw: first,
  });
};

function isISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

interface LodgifyQuote {
  currency_code?: string;
  total?: number;
  total_including_vat?: number;
  subtotal?: number;
  breakdown?: unknown;
  amount_breakdown?: unknown;
  [k: string]: unknown;
}
