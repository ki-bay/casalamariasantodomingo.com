// Email capture endpoint. Wired to:
//   1. Brevo HTTP API → POST /v3/contacts (adds to mailing list — optional)
//   2. Existing Supabase send-email edge function → welcome email + 5% code
//      + link to the 48-hour Zona Colonial itinerary lead-magnet page
//
// Required Cloudflare Pages env vars:
//   NEXT_PUBLIC_SUPABASE_URL    = https://blwodrambvrhapjplqhx.supabase.co
//   EDGE_SECRET                 = shared secret with Supabase send-email
// Optional (gracefully degrades if absent):
//   BREVO_API_KEY               = Brevo HTTP API key (xkeysib-…)
//   BREVO_LIST_ID               = numeric list id ("Newsletter" in Brevo)

interface Env {
  NEXT_PUBLIC_SUPABASE_URL: string;
  EDGE_SECRET: string;
  BREVO_API_KEY?: string;
  BREVO_LIST_ID?: string;
}

interface SubscribeBody {
  email: string;
  firstName?: string;
  locale?: "es" | "en";
  source?: string;
}

const DISCOUNT_CODE = "DIRECT5";
const SITE = "https://casalamariazonacolonial.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: cors });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: SubscribeBody;
  try {
    body = await context.request.json();
  } catch {
    return json({ error: "Invalid body" }, 400);
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const firstName = (body.firstName ?? "").trim().slice(0, 60);
  const locale: "es" | "en" = body.locale === "en" ? "en" : "es";
  const isEN = locale === "en";

  if (!isValidEmail(email)) return json({ error: "Invalid email" }, 400);

  // 1. Best-effort: add to Brevo contacts list (skipped if no API key set)
  if (context.env.BREVO_API_KEY && context.env.BREVO_LIST_ID) {
    try {
      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "api-key": context.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email,
          attributes: {
            FIRSTNAME: firstName || undefined,
            LANGUAGE: locale.toUpperCase(),
            SOURCE: body.source ?? "website",
          },
          listIds: [Number(context.env.BREVO_LIST_ID)],
          updateEnabled: true,
        }),
      });
    } catch {
      // non-fatal: we still send the welcome email below
    }
  }

  // 2. Send welcome email through Supabase send-email function (Brevo SMTP)
  const supabaseUrl = context.env.NEXT_PUBLIC_SUPABASE_URL;
  const edgeSecret = context.env.EDGE_SECRET;
  if (!supabaseUrl || !edgeSecret) {
    return json({ error: "Email service not configured" }, 503);
  }

  const itineraryUrl = isEN
    ? `${SITE}/en/blog/where-to-stay-near-calle-las-damas`
    : `${SITE}/es/blog/where-to-stay-near-calle-las-damas`;
  const reservaUrl = isEN ? `${SITE}/en/apartments` : `${SITE}/es/apartamentos`;

  const subject = isEN
    ? `Your ${DISCOUNT_CODE} code + the Zona Colonial 48-hour itinerary`
    : `Tu código ${DISCOUNT_CODE} + el itinerario de 48 horas en la Zona Colonial`;

  const html = welcomeEmailHtml({
    firstName: firstName || (isEN ? "there" : "hola"),
    isEN,
    itineraryUrl,
    reservaUrl,
  });

  try {
    const r = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${edgeSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ to: email, subject, html }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      return json({ error: "send_failed", detail: detail.slice(0, 400) }, 502);
    }
  } catch (err) {
    return json(
      { error: err instanceof Error ? err.message : "send_error" },
      502,
    );
  }

  return json({ ok: true, code: DISCOUNT_CODE });
};

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length < 200;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: cors });
}

function welcomeEmailHtml(opts: {
  firstName: string;
  isEN: boolean;
  itineraryUrl: string;
  reservaUrl: string;
}): string {
  const { firstName, isEN, itineraryUrl, reservaUrl } = opts;
  if (isEN) {
    return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;border:1px solid #E6E2DB;border-radius:12px;color:#2B2B2B;line-height:1.55">
  <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#999;margin:0 0 14px">Casa La Maria · Zona Colonial</p>
  <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 16px;color:#2B2B2B;font-weight:600">Welcome, ${escapeHtml(firstName)}.</h1>
  <p style="font-family:Arial,sans-serif;font-size:15px;color:#444;margin:0 0 20px">
    As promised — your direct-booking discount code and the 48-hour walking + eating itinerary
    that locals actually use.
  </p>

  <div style="background:#fff;border:1px solid #E6E2DB;border-radius:10px;padding:18px;margin:0 0 22px;text-align:center">
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:.18em;text-transform:uppercase;margin:0 0 6px">Your code</p>
    <p style="font-family:Menlo,Consolas,monospace;font-size:22px;font-weight:bold;letter-spacing:.18em;color:#2B2B2B;margin:0">${DISCOUNT_CODE}</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:8px 0 0">5% off your first direct booking — apply at checkout</p>
  </div>

  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 6px"><strong>Your 48-hour Zona Colonial guide</strong></p>
  <p style="font-family:Arial,sans-serif;font-size:14px;color:#555;margin:0 0 14px">
    A walking-distance plan from Calle Las Damas to Plaza España, with the cafés, restaurants and
    sunset spots we send our own friends to. No taxis required.
  </p>
  <a href="${itineraryUrl}" style="display:inline-block;background:#2B2B2B;color:#FAFAF8;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:500;padding:12px 22px;border-radius:8px">Open the guide →</a>

  <hr style="margin:28px 0;border:none;border-top:1px solid #E6E2DB"/>

  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 12px">
    When you're ready, our five apartments are bookable in two minutes — same flexibility as Airbnb,
    no platform fees:
  </p>
  <a href="${reservaUrl}" style="font-family:Arial,sans-serif;font-size:14px;color:#C9A96E;text-decoration:underline">Browse apartments →</a>

  <hr style="margin:28px 0;border:none;border-top:1px solid #E6E2DB"/>
  <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0">
    Casa La Maria · Callejón Regina, Zona Colonial, Santo Domingo · +1 (829) 406-7269 ·
    <a href="mailto:info@casalamariazonacolonial.com" style="color:#C9A96E">info@casalamariazonacolonial.com</a>
  </p>
</div>`;
  }
  return `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;border:1px solid #E6E2DB;border-radius:12px;color:#2B2B2B;line-height:1.55">
  <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#999;margin:0 0 14px">Casa La Maria · Zona Colonial</p>
  <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 16px;color:#2B2B2B;font-weight:600">Hola, ${escapeHtml(firstName)}.</h1>
  <p style="font-family:Arial,sans-serif;font-size:15px;color:#444;margin:0 0 20px">
    Como prometimos — tu código de descuento para reserva directa y el itinerario de 48 horas
    de caminata y restaurantes que de verdad usan los locales.
  </p>

  <div style="background:#fff;border:1px solid #E6E2DB;border-radius:10px;padding:18px;margin:0 0 22px;text-align:center">
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#888;letter-spacing:.18em;text-transform:uppercase;margin:0 0 6px">Tu código</p>
    <p style="font-family:Menlo,Consolas,monospace;font-size:22px;font-weight:bold;letter-spacing:.18em;color:#2B2B2B;margin:0">${DISCOUNT_CODE}</p>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:8px 0 0">5% de descuento en tu primera reserva directa — aplica al pagar</p>
  </div>

  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 6px"><strong>Tu guía de 48 horas en la Zona Colonial</strong></p>
  <p style="font-family:Arial,sans-serif;font-size:14px;color:#555;margin:0 0 14px">
    Un plan caminable desde Calle Las Damas hasta Plaza España, con los cafés, restaurantes
    y mejores miradores al atardecer que recomendamos a nuestros propios amigos. Sin taxis.
  </p>
  <a href="${itineraryUrl}" style="display:inline-block;background:#2B2B2B;color:#FAFAF8;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:500;padding:12px 22px;border-radius:8px">Abrir la guía →</a>

  <hr style="margin:28px 0;border:none;border-top:1px solid #E6E2DB"/>

  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 12px">
    Cuando estés listo, nuestros cinco apartamentos se reservan en dos minutos — la misma
    flexibilidad que Airbnb, sin comisiones de plataforma:
  </p>
  <a href="${reservaUrl}" style="font-family:Arial,sans-serif;font-size:14px;color:#C9A96E;text-decoration:underline">Ver apartamentos →</a>

  <hr style="margin:28px 0;border:none;border-top:1px solid #E6E2DB"/>
  <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0">
    Casa La Maria · Callejón Regina, Zona Colonial, Santo Domingo · +1 (829) 406-7269 ·
    <a href="mailto:info@casalamariazonacolonial.com" style="color:#C9A96E">info@casalamariazonacolonial.com</a>
  </p>
</div>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
