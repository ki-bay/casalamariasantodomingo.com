// Bilingual booking confirmation emails. Sent after the Stripe webhook
// confirms a booking and Lodgify writes it through. Delivery uses the
// existing Supabase send-email edge function (Brevo SMTP relay) so the
// stripe-webhook doesn't need its own SMTP credentials.

const SITE = "https://casalamariazonacolonial.com";
const ADMIN_TO = "info@casalamariazonacolonial.com";
const WHATSAPP_HREF = "https://wa.me/18294067269";
const ADMIN_PANEL = `${SITE}/es/admin/`;

const UNIT_LABELS: Record<number, string> = {
  674785: "Casa La Maria — Unidad 1B (TwoBedRoom)",
  674786: "Casa La Maria — Unidad 2B (TwoBedRoom)",
  674787: "Casa La Maria — Unidad 3B (TwoBedRoom)",
  674788: "Casa La Maria — Unidad 1A (OneBedRoom)",
  674789: "Casa La Maria — Unidad 2A (OneBedRoom)",
};

export interface BookingEmailInput {
  guestEmail: string;
  guestFirstName: string;
  guestLastName: string;
  guestPhone: string;
  propertyId: number;
  arrival: string;       // YYYY-MM-DD
  departure: string;     // YYYY-MM-DD
  people: number;
  totalUsd: number;
  notes: string;
  stripePaymentIntentId: string;
  lodgifyBookingId: number | null;
  locale?: "es" | "en";
}

function nights(a: string, d: string) {
  return Math.max(0, Math.round((Date.parse(d) - Date.parse(a)) / 86_400_000));
}
function fmtDateEs(s: string) {
  return new Date(s + "T00:00:00").toLocaleDateString("es-DO", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
}
function fmtDateEn(s: string) {
  return new Date(s + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });
}
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
 * HTML email sent to the guest's address.
 */
export function guestConfirmationHtml(i: BookingEmailInput): { subject: string; html: string } {
  const isEN = i.locale === "en";
  const n = nights(i.arrival, i.departure);
  const fullName = `${i.guestFirstName} ${i.guestLastName}`.trim() || (isEN ? "Guest" : "Huésped");
  const unit = UNIT_LABELS[i.propertyId] ?? `Property ${i.propertyId}`;
  const arrivalStr = isEN ? fmtDateEn(i.arrival) : fmtDateEs(i.arrival);
  const departureStr = isEN ? fmtDateEn(i.departure) : fmtDateEs(i.departure);
  const ref = i.lodgifyBookingId ? `#${i.lodgifyBookingId}` : i.stripePaymentIntentId.slice(-8).toUpperCase();

  if (isEN) {
    return {
      subject: `Booking confirmed — Casa La Maria · ${arrivalStr}`,
      html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;border:1px solid #E6E2DB;border-radius:12px;color:#2B2B2B;line-height:1.55">
  <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#999;margin:0 0 14px">Casa La Maria · Zona Colonial</p>
  <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px;font-weight:600">Booking confirmed, ${esc(fullName)}.</h1>
  <p style="font-family:Arial,sans-serif;font-size:15px;color:#444;margin:0 0 24px">
    Thank you for booking direct. Your payment cleared and we have your dates locked.
  </p>

  <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;margin-bottom:24px">
    <tr style="background:#fff;border:1px solid #E6E2DB">
      <td style="padding:14px;color:#888;width:130px;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Apartment</td>
      <td style="padding:14px">${esc(unit)}</td>
    </tr>
    <tr style="background:#f5f5f0">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Check-in</td>
      <td style="padding:14px"><strong>${arrivalStr}</strong> · from 3:00 PM</td>
    </tr>
    <tr style="background:#fff;border:1px solid #E6E2DB">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Check-out</td>
      <td style="padding:14px"><strong>${departureStr}</strong> · by 11:00 AM</td>
    </tr>
    <tr style="background:#f5f5f0">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Nights · Guests</td>
      <td style="padding:14px">${n} night${n === 1 ? "" : "s"} · ${i.people} guest${i.people === 1 ? "" : "s"}</td>
    </tr>
    <tr style="background:#fff;border:1px solid #E6E2DB">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Total paid</td>
      <td style="padding:14px;font-size:18px"><strong>$${i.totalUsd.toFixed(0)} USD</strong></td>
    </tr>
    <tr style="background:#f5f5f0">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Booking ref.</td>
      <td style="padding:14px;font-family:Menlo,Consolas,monospace">${esc(ref)}</td>
    </tr>
  </table>

  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 12px">
    <strong>How to find us:</strong><br/>
    Parmenio Troncoso 4, Zona Colonial, Santo Domingo 10210 — a quiet pedestrian street, 5 min walk from Calle Las Damas and the Catedral Primada.
  </p>
  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 12px">
    <strong>The day before arrival</strong> Joab will WhatsApp you the building code and the smart-lock instructions. If you need anything before then — early check-in, restaurant tips, an airport transfer — just reply or message us on WhatsApp:
  </p>
  <a href="${WHATSAPP_HREF}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:500;padding:11px 22px;border-radius:8px">WhatsApp Joab → +1 (829) 406-7269</a>

  <hr style="margin:28px 0;border:none;border-top:1px solid #E6E2DB"/>
  <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0">
    Casa La Maria · Parmenio Troncoso 4, Zona Colonial, Santo Domingo · <a href="mailto:${ADMIN_TO}" style="color:#C9A96E">${ADMIN_TO}</a>
  </p>
</div>`,
    };
  }

  // Spanish (default)
  return {
    subject: `Reserva confirmada — Casa La Maria · ${arrivalStr}`,
    html: `<div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;border:1px solid #E6E2DB;border-radius:12px;color:#2B2B2B;line-height:1.55">
  <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#999;margin:0 0 14px">Casa La Maria · Zona Colonial</p>
  <h1 style="font-family:Georgia,serif;font-size:24px;margin:0 0 12px;font-weight:600">Reserva confirmada, ${esc(fullName)}.</h1>
  <p style="font-family:Arial,sans-serif;font-size:15px;color:#444;margin:0 0 24px">
    Gracias por reservar directo. Tu pago se procesó correctamente y las fechas quedan bloqueadas a tu nombre.
  </p>

  <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;margin-bottom:24px">
    <tr style="background:#fff;border:1px solid #E6E2DB">
      <td style="padding:14px;color:#888;width:130px;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Apartamento</td>
      <td style="padding:14px">${esc(unit)}</td>
    </tr>
    <tr style="background:#f5f5f0">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Check-in</td>
      <td style="padding:14px"><strong>${arrivalStr}</strong> · desde las 3:00 PM</td>
    </tr>
    <tr style="background:#fff;border:1px solid #E6E2DB">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Check-out</td>
      <td style="padding:14px"><strong>${departureStr}</strong> · antes de las 11:00 AM</td>
    </tr>
    <tr style="background:#f5f5f0">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Noches · Huéspedes</td>
      <td style="padding:14px">${n} noche${n === 1 ? "" : "s"} · ${i.people} huésped${i.people === 1 ? "" : "es"}</td>
    </tr>
    <tr style="background:#fff;border:1px solid #E6E2DB">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Total pagado</td>
      <td style="padding:14px;font-size:18px"><strong>$${i.totalUsd.toFixed(0)} USD</strong></td>
    </tr>
    <tr style="background:#f5f5f0">
      <td style="padding:14px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Ref. de reserva</td>
      <td style="padding:14px;font-family:Menlo,Consolas,monospace">${esc(ref)}</td>
    </tr>
  </table>

  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 12px">
    <strong>Cómo llegar:</strong><br/>
    Parmenio Troncoso 4, Zona Colonial, Santo Domingo 10210 — una calle tranquila a 5 minutos a pie de Calle Las Damas y la Catedral Primada.
  </p>
  <p style="font-family:Arial,sans-serif;font-size:14px;color:#444;margin:0 0 12px">
    <strong>El día antes de tu llegada</strong> Joab te escribirá por WhatsApp con el código del edificio y las instrucciones de la cerradura inteligente. Si necesitas algo antes — early check-in, recomendaciones de restaurantes, transporte desde el aeropuerto — respóndenos a este correo o por WhatsApp:
  </p>
  <a href="${WHATSAPP_HREF}" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-family:Arial,sans-serif;font-size:14px;font-weight:500;padding:11px 22px;border-radius:8px">WhatsApp Joab → +1 (829) 406-7269</a>

  <hr style="margin:28px 0;border:none;border-top:1px solid #E6E2DB"/>
  <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0">
    Casa La Maria · Parmenio Troncoso 4, Zona Colonial, Santo Domingo · <a href="mailto:${ADMIN_TO}" style="color:#C9A96E">${ADMIN_TO}</a>
  </p>
</div>`,
  };
}

/**
 * Internal notification to info@casalamariazonacolonial.com.
 */
export function adminNotificationHtml(i: BookingEmailInput): { subject: string; html: string; to: string } {
  const n = nights(i.arrival, i.departure);
  const fullName = `${i.guestFirstName} ${i.guestLastName}`.trim() || "(sin nombre)";
  const unit = UNIT_LABELS[i.propertyId] ?? `#${i.propertyId}`;
  const arrivalStr = fmtDateEs(i.arrival);
  const departureStr = fmtDateEs(i.departure);

  return {
    to: ADMIN_TO,
    subject: `🎉 Nueva reserva · ${unit.replace("Casa La Maria — ", "")} · ${arrivalStr}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#FAFAF8;color:#2B2B2B;font-size:14px;line-height:1.55">
  <h1 style="font-family:Georgia,serif;font-size:22px;margin:0 0 8px">Nueva reserva confirmada</h1>
  <p style="color:#666;margin:0 0 18px">Stripe → Lodgify → DB completo. La reserva ya está en el panel.</p>

  <table style="width:100%;border-collapse:collapse;font-size:13px">
    <tr><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;width:140px;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Apartamento</td><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB"><strong>${esc(unit)}</strong></td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f0;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Huésped</td><td style="padding:8px 12px;background:#f5f5f0">${esc(fullName)}</td></tr>
    <tr><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Email</td><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB"><a href="mailto:${esc(i.guestEmail)}" style="color:#C9A96E">${esc(i.guestEmail)}</a></td></tr>
    ${i.guestPhone ? `<tr><td style="padding:8px 12px;background:#f5f5f0;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Teléfono</td><td style="padding:8px 12px;background:#f5f5f0"><a href="https://wa.me/${esc(i.guestPhone.replace(/[^0-9]/g,''))}" style="color:#C9A96E">${esc(i.guestPhone)}</a></td></tr>` : ""}
    <tr><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Fechas</td><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB">${arrivalStr} → ${departureStr} <span style="color:#888">(${n} noche${n === 1 ? "" : "s"} · ${i.people} huésped${i.people === 1 ? "" : "es"})</span></td></tr>
    <tr><td style="padding:8px 12px;background:#f5f5f0;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Total pagado</td><td style="padding:8px 12px;background:#f5f5f0;font-size:16px"><strong>$${i.totalUsd.toFixed(0)} USD</strong></td></tr>
    <tr><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Stripe PI</td><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;font-family:Menlo,Consolas,monospace;font-size:11px">${esc(i.stripePaymentIntentId)}</td></tr>
    ${i.lodgifyBookingId ? `<tr><td style="padding:8px 12px;background:#f5f5f0;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Lodgify</td><td style="padding:8px 12px;background:#f5f5f0;font-family:Menlo,Consolas,monospace;font-size:11px">#${i.lodgifyBookingId}</td></tr>` : ""}
    ${i.notes ? `<tr><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;color:#888;text-transform:uppercase;font-size:11px;letter-spacing:.05em">Nota</td><td style="padding:8px 12px;background:#fff;border:1px solid #E6E2DB;white-space:pre-wrap">${esc(i.notes)}</td></tr>` : ""}
  </table>

  <p style="margin:18px 0 0">
    <a href="${ADMIN_PANEL}" style="display:inline-block;background:#2B2B2B;color:#FAFAF8;text-decoration:none;font-size:13px;font-weight:500;padding:10px 18px;border-radius:6px">Abrir panel de administración →</a>
  </p>
</div>`,
  };
}

/**
 * Best-effort send via Supabase send-email edge function.
 */
export async function sendViaSupabase(opts: {
  supabaseUrl: string;
  edgeSecret: string;
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<{ ok: boolean; status: number; detail?: string }> {
  try {
    const r = await fetch(`${opts.supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${opts.edgeSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: opts.to,
        subject: opts.subject,
        html: opts.html,
        replyTo: opts.replyTo,
      }),
    });
    if (!r.ok) {
      const body = await r.text().catch(() => "");
      return { ok: false, status: r.status, detail: body.slice(0, 400) };
    }
    return { ok: true, status: r.status };
  } catch (err) {
    return { ok: false, status: 0, detail: err instanceof Error ? err.message : String(err) };
  }
}
