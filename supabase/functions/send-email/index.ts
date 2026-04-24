// Supabase Edge Function — deployed with: supabase functions deploy send-email
// Secrets needed (set via: supabase secrets set KEY=value):
//   SMTP_USER   = info@casalamariazonacolonial.com
//   SMTP_PASS   = <your hostinger email password>
//   EDGE_SECRET = <random secret shared with CF Pages Functions>

// @ts-nocheck  (Deno environment — no TypeScript project config applies here)
import nodemailer from "npm:nodemailer@6.9.9";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
  cc?: string;
  from?: string; // override display name if needed
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Auth: verify shared secret sent by Cloudflare functions
  const authHeader = req.headers.get("Authorization") ?? "";
  const edgeSecret = Deno.env.get("EDGE_SECRET") ?? "";
  if (!edgeSecret || authHeader !== `Bearer ${edgeSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let payload: EmailPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (!payload.to || !payload.subject || !payload.html) {
    return new Response(JSON.stringify({ error: "Missing required fields: to, subject, html" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPass = Deno.env.get("SMTP_PASS");

  if (!smtpUser || !smtpPass) {
    return new Response(JSON.stringify({ error: "SMTP credentials not configured" }), {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      secure: true, // SSL
      auth: { user: smtpUser, pass: smtpPass },
    });

    const info = await transporter.sendMail({
      from: payload.from ?? `"La Casa Maria" <${smtpUser}>`,
      to: payload.to,
      cc: payload.cc,
      replyTo: payload.replyTo ?? smtpUser,
      subject: payload.subject,
      html: payload.html,
    });

    return new Response(JSON.stringify({ ok: true, messageId: info.messageId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown SMTP error";
    console.error("[send-email] SMTP error:", message);
    return new Response(JSON.stringify({ error: `SMTP error: ${message}` }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
