// Lodgify → Supabase sync
// Deploy:   supabase functions deploy lodgify-sync
// Secrets:  supabase secrets set LODGIFY_API_KEY=... EDGE_SECRET=...
// Trigger:  POST https://<project>.supabase.co/functions/v1/lodgify-sync
//           Header: Authorization: Bearer <EDGE_SECRET>
//
// This function pulls property metadata, rates, and availability from
// Lodgify Public API v2 and upserts into Supabase. Photos are intentionally
// NOT synced — those are managed manually in apartments.images.
// English copy is also NOT synced — name_en / description_en stay manual.

// @ts-nocheck — Deno runtime
import { createClient } from "npm:@supabase/supabase-js@2";

const LODGIFY_BASE = "https://api.lodgify.com";

// Hardcoded list of property IDs to sync (the 5 Casa La Maria units)
const PROPERTY_IDS: number[] = [674785, 674786, 674787, 674788, 674789];

// How many days into the future to pull rates + availability
const SYNC_HORIZON_DAYS = 365;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

type SyncResult = {
  status: "success" | "partial" | "failed";
  properties_synced: number;
  rates_synced: number;
  blackouts_synced: number;
  errors: Array<{ propertyId: number; error: string }>;
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Auth via shared secret (same EDGE_SECRET used by send-email)
  const authHeader = req.headers.get("Authorization") ?? "";
  const edgeSecret = Deno.env.get("EDGE_SECRET") ?? "";
  if (!edgeSecret || authHeader !== `Bearer ${edgeSecret}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  const lodgifyKey = Deno.env.get("LODGIFY_API_KEY");
  if (!lodgifyKey) return json({ error: "LODGIFY_API_KEY not set" }, 500);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const sb = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const startedAt = new Date().toISOString();
  const result: SyncResult = {
    status: "success",
    properties_synced: 0,
    rates_synced: 0,
    blackouts_synced: 0,
    errors: [],
  };

  for (const propertyId of PROPERTY_IDS) {
    try {
      const synced = await syncProperty(sb, lodgifyKey, propertyId);
      result.properties_synced += 1;
      result.rates_synced += synced.rates;
      result.blackouts_synced += synced.blackouts;
    } catch (err) {
      result.errors.push({
        propertyId,
        error: err instanceof Error ? err.message : String(err),
      });
      result.status = "partial";
    }
  }

  if (result.properties_synced === 0 && result.errors.length > 0) {
    result.status = "failed";
  }

  await sb.from("lodgify_sync_log").insert({
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    status: result.status,
    properties_synced: result.properties_synced,
    rates_synced: result.rates_synced,
    blackouts_synced: result.blackouts_synced,
    details: { errors: result.errors },
  });

  return json(result, result.status === "failed" ? 500 : 200);
});

// ──────────────────────────────────────────────────────────
// Per-property sync
// ──────────────────────────────────────────────────────────
async function syncProperty(
  sb: ReturnType<typeof createClient>,
  apiKey: string,
  propertyId: number,
): Promise<{ rates: number; blackouts: number }> {
  const property = await lodgifyGet<LodgifyProperty>(
    `/v2/properties/${propertyId}`,
    apiKey,
  );

  // First room type wins for rate/availability lookups (most listings have 1)
  const roomType = (property.rooms ?? [])[0];
  const roomTypeId = roomType?.id ?? null;

  // ── Upsert apartment record ──
  // Slug is built from name + last 4 digits of Lodgify ID to guarantee
  // uniqueness across properties that share the same name (common for
  // multi-unit buildings like Casa La Maria).
  const baseSlug = slugify(property.name ?? `apt-${propertyId}`);
  const slug = `${baseSlug}-${String(propertyId).slice(-4)}`;
  const { data: existing } = await sb
    .from("apartments")
    .select("id, name_en, description_en, images, sort_order")
    .eq("lodgify_property_id", String(propertyId))
    .maybeSingle();

  const upsertData = {
    lodgify_property_id: String(propertyId),
    lodgify_room_type_id: roomTypeId ? String(roomTypeId) : null,
    slug, // deterministic from name + last 4 of ID — same every sync
    name_es: property.name ?? `Apartamento ${propertyId}`,
    name_en: existing?.name_en ?? property.name ?? `Apartment ${propertyId}`,
    description_es: stripHtml(property.description ?? ""),
    description_en: existing?.description_en ?? "", // manual EN
    bedrooms: property.bedrooms ?? roomType?.bedrooms ?? 1,
    bathrooms: Math.round(property.bathrooms ?? roomType?.bathrooms ?? 1),
    size_m2: property.area ?? null,
    max_guests: property.max_people ?? roomType?.max_people ?? 4,
    price_currency: property.currency_code ?? "USD",
    price_base_usd: property.min_price ?? null,
    available: true,
    lodgify_synced_at: new Date().toISOString(),
    lodgify_raw: property,
  };

  // strip undefined so it doesn't blow away the slug
  const cleaned = Object.fromEntries(
    Object.entries(upsertData).filter(([, v]) => v !== undefined),
  );

  const { data: apt, error: aptErr } = await sb
    .from("apartments")
    .upsert(cleaned, { onConflict: "lodgify_property_id" })
    .select("id")
    .single();

  if (aptErr || !apt) {
    throw new Error(`apartments upsert failed: ${aptErr?.message}`);
  }

  // ── Sync rates ──
  const today = new Date();
  const horizon = new Date();
  horizon.setDate(horizon.getDate() + SYNC_HORIZON_DAYS);
  const startDate = today.toISOString().slice(0, 10);
  const endDate = horizon.toISOString().slice(0, 10);

  const debug: Record<string, unknown> = {};

  let ratesCount = 0;
  if (roomTypeId) {
    // Try several known Lodgify v2 endpoint shapes
    const rateAttempts = [
      `/v2/rates/calendar?HouseId=${propertyId}&RoomTypeId=${roomTypeId}&StartDate=${startDate}&EndDate=${endDate}`,
      `/v2/rates/calendar?propertyId=${propertyId}&roomTypeId=${roomTypeId}&from=${startDate}&to=${endDate}`,
      `/v2/properties/${propertyId}/rates?from=${startDate}&to=${endDate}`,
    ];

    let ratesData: any = null;
    for (const path of rateAttempts) {
      const result = await lodgifyGetRaw(path, apiKey);
      debug[`rates_attempt:${path.split("?")[0]}`] = {
        status: result.status,
        bodyPreview: result.body.slice(0, 300),
      };
      if (result.status === 200) {
        try {
          ratesData = JSON.parse(result.body);
          break;
        } catch {
          /* keep trying */
        }
      }
    }

    if (ratesData) {
      // Lodgify rates calendar shape:
      // { calendar_items: [{ date: "YYYY-MM-DD"|null, is_default: bool,
      //                      prices: [{ min_stay, max_stay, price_per_day }] }] }
      // The item with date=null carries the default rate; we skip it.
      const items: any[] = ratesData.calendar_items ?? [];
      const currency = ratesData.currency_code ?? ratesData.currency ?? "USD";

      const rateRows = items
        .filter((it) => it.date && Array.isArray(it.prices) && it.prices.length > 0)
        .map((it) => {
          const p = it.prices[0];
          return {
            apartment_id: apt.id,
            starts_on: it.date,
            ends_on: it.date,
            price_per_night: p.price_per_day,
            currency,
            min_stay: p.min_stay ?? 1,
            source: "lodgify",
            synced_at: new Date().toISOString(),
          };
        })
        .filter((r) => r.price_per_night != null);

      if (rateRows.length) {
        await sb.from("seasonal_rates").delete().eq("apartment_id", apt.id);
        const { error: ratesErr } = await sb.from("seasonal_rates").insert(rateRows);
        if (ratesErr) throw new Error(`rates insert: ${ratesErr.message}`);
        ratesCount = rateRows.length;
      } else {
        debug.rates_parsed_zero = { keys: Object.keys(ratesData).slice(0, 10) };
      }
    }
  }

  // ── Sync availability blackouts ──
  let blackoutsCount = 0;
  const availAttempts = [
    `/v2/availability/${propertyId}?start=${startDate}&end=${endDate}`,
    `/v2/availability/${propertyId}?from=${startDate}&to=${endDate}`,
    `/v2/properties/${propertyId}/availability?from=${startDate}&to=${endDate}`,
  ];

  let availData: any = null;
  for (const path of availAttempts) {
    const result = await lodgifyGetRaw(path, apiKey);
    debug[`avail_attempt:${path.split("?")[0]}`] = {
      status: result.status,
      bodyPreview: result.body.slice(0, 300),
    };
    if (result.status === 200) {
      try {
        availData = JSON.parse(result.body);
        break;
      } catch {
        /* keep trying */
      }
    }
  }

  if (availData) {
    // Lodgify availability shape (per property):
    // [{ property_id, room_type_id, periods: [{ start, end, available: 0|1, bookings: [...] }] }]
    // We aggregate periods across all room types (most properties have 1).
    const roomEntries: any[] = Array.isArray(availData) ? availData : [availData];
    const periods: any[] = roomEntries.flatMap((r) => r?.periods ?? []);

    const blackoutRows = periods
      .filter((p) => p.available === 0 || p.available === false)
      .map((p) => ({
        apartment_id: apt.id,
        starts_on: p.start,
        ends_on: p.end,
        reason: (p.bookings?.length ?? 0) > 0 ? "booked" : "blocked",
        synced_at: new Date().toISOString(),
      }))
      .filter((r) => r.starts_on && r.ends_on);

    if (blackoutRows.length) {
      await sb.from("availability_blackouts").delete().eq("apartment_id", apt.id);
      const { error: boErr } = await sb.from("availability_blackouts").insert(blackoutRows);
      if (boErr) throw new Error(`blackouts insert: ${boErr.message}`);
      blackoutsCount = blackoutRows.length;
    }
  }

  // Persist diagnostic info on the apartment row for debugging
  await sb
    .from("apartments")
    .update({ lodgify_raw: { ...property, _sync_debug: debug } })
    .eq("id", apt.id);

  return { rates: ratesCount, blackouts: blackoutsCount };
}

async function lodgifyGetRaw(
  path: string,
  apiKey: string,
): Promise<{ status: number; body: string }> {
  const res = await fetch(`${LODGIFY_BASE}${path}`, {
    headers: { "X-ApiKey": apiKey, Accept: "application/json" },
  });
  const body = await res.text().catch(() => "");
  return { status: res.status, body };
}

// ──────────────────────────────────────────────────────────
// Lodgify HTTP helper
// ──────────────────────────────────────────────────────────
async function lodgifyGet<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${LODGIFY_BASE}${path}`, {
    headers: {
      "X-ApiKey": apiKey,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Lodgify ${path}: ${res.status} ${body.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

// ──────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || `apt-${Date.now()}`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ──────────────────────────────────────────────────────────
// Lodgify response shapes (defensive — fields documented but may vary)
// ──────────────────────────────────────────────────────────
type LodgifyProperty = {
  id: number;
  name?: string;
  description?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  max_people?: number;
  currency_code?: string;
  min_price?: number;
  rooms?: Array<{
    id: number;
    name?: string;
    bedrooms?: number;
    bathrooms?: number;
    max_people?: number;
  }>;
  [k: string]: unknown;
};

type LodgifyRatesCalendar = {
  currency_code?: string;
  calendar_items?: Array<{
    date: string;
    price: number;
    min_stay?: number;
  }>;
};

type LodgifyAvailability = {
  periods?: Array<{
    start: string;
    end: string;
    available: boolean | number;
    bookings?: Array<{ id: number }>;
  }>;
};
