interface Env {
  CONTACT_EMAIL_TO?: string; // defaults to info@casalamariazonacolonial.com
}

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (context.request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

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

  // Use Cloudflare Email Routing (MailChannels) to send the email
  const emailPayload = {
    personalizations: [{ to: [{ email: to, name: "Casa La Maria" }] }],
    from: { email: "noreply@casalamariazonacolonial.com", name: "Casa La Maria Web" },
    reply_to: { email, name },
    subject: `[Contacto Web] ${subject} — ${name}`,
    content: [
      {
        type: "text/html",
        value: `
          <h2 style="font-family:Georgia,serif;color:#2B2B2B">Nuevo mensaje de contacto</h2>
          <table style="font-family:Arial,sans-serif;font-size:14px;color:#444;border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold;width:120px">Nombre:</td><td style="padding:8px">${name}</td></tr>
            <tr><td style="padding:8px;font-weight:bold">Email:</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold">Asunto:</td><td style="padding:8px">${subject}</td></tr>
            <tr><td style="padding:8px;font-weight:bold;vertical-align:top">Mensaje:</td><td style="padding:8px;white-space:pre-wrap">${message}</td></tr>
          </table>
          <hr style="margin:24px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:12px;color:#999">Enviado desde casalamariazonacolonial.com</p>
        `,
      },
    ],
  };

  try {
    // Send via MailChannels (available on Cloudflare Workers)
    const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailPayload),
    });

    if (!res.ok && res.status !== 202) {
      const errText = await res.text().catch(() => "");
      return new Response(JSON.stringify({ error: "Email send failed", detail: errText }), { status: 500, headers: corsHeaders });
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: corsHeaders });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), { status: 500, headers: corsHeaders });
  }
};
