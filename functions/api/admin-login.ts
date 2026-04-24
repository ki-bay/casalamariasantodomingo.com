/// <reference types="@cloudflare/workers-types" />

interface Env {
  ADMIN_PASSWORD: string;       // set in Cloudflare Pages → Settings → Env vars
  ADMIN_COOKIE_SECRET: string;  // random 32+ char secret, same value used in middleware.ts
}

const COOKIE_NAME = 'clm_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

const corsHeaders = {
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function b64urlEncode(data: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(data)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function buildCookieValue(secret: string): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + COOKIE_MAX_AGE * 1000 });
  // base64url-encode the JSON payload (ASCII-safe)
  const payloadB64 = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(payloadB64));
  const sigB64 = b64urlEncode(sigBuf);

  return `${payloadB64}.${sigB64}`;
}

/** Timing-safe string comparison via HMAC double-keyed trick */
async function safeEqual(a: string, b: string, key: CryptoKey): Promise<boolean> {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.sign('HMAC', key, enc.encode(a)),
    crypto.subtle.sign('HMAC', key, enc.encode(b)),
  ]);
  const ua = new Uint8Array(ha);
  const ub = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < ua.length; i++) diff |= ua[i] ^ ub[i];
  return diff === 0;
}

export const onRequestOptions: PagesFunction = async () =>
  new Response(null, { status: 204, headers: corsHeaders });

export const onRequestPost: PagesFunction<Env> = async (context) => {
  let body: { password?: string };
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid body' }), { status: 400, headers: corsHeaders });
  }

  const { password } = body;
  if (!password) {
    return new Response(JSON.stringify({ error: 'Password required' }), { status: 400, headers: corsHeaders });
  }

  const adminPassword = context.env.ADMIN_PASSWORD;
  const cookieSecret = context.env.ADMIN_COOKIE_SECRET;

  if (!adminPassword || !cookieSecret) {
    return new Response(JSON.stringify({ error: 'Server misconfigured' }), { status: 500, headers: corsHeaders });
  }

  const enc = new TextEncoder();
  const hmacKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(cookieSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const match = await safeEqual(password, adminPassword, hmacKey);

  if (!match) {
    // Slight delay to slow down brute force
    await new Promise((r) => setTimeout(r, 600));
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: corsHeaders });
  }

  const cookieValue = await buildCookieValue(cookieSecret);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Set-Cookie': `${COOKIE_NAME}=${cookieValue}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${COOKIE_MAX_AGE}`,
    },
  });
};
