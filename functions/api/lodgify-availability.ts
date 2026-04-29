// Live Lodgify availability check
// GET /api/lodgify-availability?propertyId=674785&from=2026-05-01&to=2026-05-05
//
// Response:
//   { available: true, propertyId, from, to, periods: [...] }
//   { available: false, propertyId, from, to, blocked: [{start,end,reason}] }

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
  try {
    return await handle(context);
  } catch (err) {
    return json(
      { error: "Function crashed", reason: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack?.split("\n").slice(0, 5).join(" | ") : undefined },
      500,
    );
  }
};

async function handle(context: Parameters<PagesFunction<Env>>[0]): Promise<Response> {
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
  const from = url.searchParams.get("from") ?? "";
  const to = url.searchParams.get("to") ?? "";

  if (!ALLOWED_PROPERTY_IDS.has(propertyId)) {
    return json({ error: "Invalid propertyId" }, 400);
  }
  if (!isISODate(from) || !isISODate(to)) {
    return json({ error: "from and to must be YYYY-MM-DD" }, 400);
  }
  if (from >= to) {
    return json({ error: "from must be before to" }, 400);
  }

  let res: Response;
  try {
    res = await fetch(
      `${LODGIFY_BASE}/v2/availability/${propertyId}?start=${from}&end=${to}`,
      {
        headers: {
          "X-ApiKey": context.env.LODGIFY_API_KEY,
          Accept: "application/json",
        },
      },
    );
  } catch (err) {
    return json(
      { error: "Lodgify fetch failed", reason: err instanceof Error ? err.message : String(err) },
      502,
    );
  }

  const bodyText = await res.text().catch(() => "");
  if (!res.ok) {
    return json(
      { error: "Lodgify availability error", status: res.status, body: bodyText.slice(0, 300) },
      502,
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(bodyText);
  } catch {
    return json(
      { error: "Lodgify returned non-JSON", preview: bodyText.slice(0, 300) },
      502,
    );
  }
  const roomEntries = Array.isArray(data) ? (data as Array<{ periods?: AvailPeriod[] }>) : [data as { periods?: AvailPeriod[] }];
  const periods: AvailPeriod[] = roomEntries.flatMap((r) => r?.periods ?? []);

  // Collect blocked periods that intersect the requested range
  const blocked = periods
    .filter((p) => (p.available === 0 || p.available === false) && overlaps(p.start, p.end, from, to))
    .map((p) => ({
      start: p.start,
      end: p.end,
      reason: (p.bookings?.length ?? 0) > 0 ? "booked" : "blocked",
    }));

  return json({
    propertyId,
    from,
    to,
    available: blocked.length === 0,
    blocked,
  });
}

function isISODate(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

interface AvailPeriod {
  start: string;
  end: string;
  available: 0 | 1 | boolean;
  bookings?: Array<{ id: number }>;
}
