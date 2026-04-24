/// <reference types="@cloudflare/workers-types" />

interface Env {
  // Supabase Edge Function (Hostinger SMTP relay)
  NEXT_PUBLIC_SUPABASE_URL: string;  // e.g. https://blwodrambvrhapjplqhx.supabase.co
  EDGE_SECRET: string;               // shared secret set in Supabase secrets + here
  // Optional override
  CONTACT_EMAIL_TO?: string;         // defaults to info@casalamariazonacolonial.com
}

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: ContactRequest;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), { status: 400, headers: corsHeaders });
  }

  const { name, email, subject, message } = body;
  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: corsHeaders });
  }

  const to = context.env.CONTACT_EMAIL_TO ?? "info@casalamariazonacolonial.com";
  const supabaseUrl = context.env.NEXT_PUBLIC_SUPABASE_URL;
  const edgeSecret = context.env.EDGE_SECRET;

  if (!supabaseUrl || !edgeSecret) {
    return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 503, headers: corsHeaders });
  }

  const html = `
    <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;border:1px solid #E6E2DB;border-radius:12px">
      <h2 style="font-family:Georgia,serif;color:#2B2B2B;margin:0 0 24px">Nuevo mensaje — Casa La Maria</h2>
      <table style="font-family:Arial,sans-serif;font-size:14px;color:#444;width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 12px;font-weight:bold;width:100px;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Nombre</td><td style="padding:8px 12px">${name}</td></tr>
        <tr style="background:#f5f5f0"><td style="padding:8px 12px;font-weight:bold;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Email</td><td style="padding:8px 12px"><a href="mailto:${email}" style="color:#C9A96E">${email}</a></td></tr>
        <tr><td style="padding:8px 12px;font-weight:bold;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Asunto</td><td style="padding:8px 12px">${subject}</td></tr>
        <tr style="background:#f5f5f0"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.05em">Mensaje</td><td style="padding:8px 12px;white-space:pre-wrap;line-height:1.6">${message}</td></tr>
      </table>
      <hr style="margin:24px 0;border:none;border-top:1px solid #E6E2DB"/>
      <p style="font-size:12px;color:#999;margin:0">Enviado desde casalamariazonacolonial.com · Responde directamente a <a href="mailto:${email}" style="color:#C9A96E">${email}</a></p>
    </div>
  `;

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${edgeSecret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        replyTo: email,
        subject: `[Web] ${subject} — ${name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return new Response(JSON.stringify({ error: "Send failed", detail: err }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: corsHeaders });
  }
};

