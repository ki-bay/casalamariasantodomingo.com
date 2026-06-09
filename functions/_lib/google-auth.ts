// Google service-account auth for Cloudflare Workers / Pages Functions.
//
// Signs a JWT with the service account's private key (RS256) and exchanges
// it at oauth2.googleapis.com for a short-lived access token. The access
// token is used as a Bearer in Drive / Cloud Storage API calls.
//
// Why this exists: the official google-auth-library uses Node's `crypto`
// module which isn't available on the Workers runtime. WebCrypto's
// `subtle.importKey` + `subtle.sign` handle RS256 natively.

interface ServiceAccountJson {
  client_email: string;
  private_key: string;
  token_uri?: string;
}

const TOKEN_TTL_SECONDS = 3500; // < 1h max; cushion for clock skew

function b64urlEncode(input: ArrayBuffer | Uint8Array | string): string {
  let bytes: Uint8Array;
  if (typeof input === "string") {
    bytes = new TextEncoder().encode(input);
  } else if (input instanceof ArrayBuffer) {
    bytes = new Uint8Array(input);
  } else {
    bytes = input;
  }
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  // Strip header/footer and whitespace, then base64-decode.
  const b64 = pem
    .replace(/-----BEGIN [^-]+-----/g, "")
    .replace(/-----END [^-]+-----/g, "")
    .replace(/\s+/g, "");
  const bin = atob(b64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf.buffer;
}

function parseServiceAccount(jsonString: string): ServiceAccountJson {
  const parsed = JSON.parse(jsonString) as ServiceAccountJson;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("Service account JSON missing client_email or private_key");
  }
  return parsed;
}

/**
 * Returns a short-lived OAuth2 access token for the given scopes.
 * Caller is responsible for not requesting tokens more often than needed
 * — they're valid for ~1h.
 */
export async function getGoogleAccessToken(
  serviceAccountJson: string,
  scopes: string[],
): Promise<string> {
  const sa = parseServiceAccount(serviceAccountJson);
  const tokenUri = sa.token_uri ?? "https://oauth2.googleapis.com/token";

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: scopes.join(" "),
    aud: tokenUri,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  };

  const signingInput = `${b64urlEncode(JSON.stringify(header))}.${b64urlEncode(JSON.stringify(payload))}`;

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(signingInput),
  );

  const jwt = `${signingInput}.${b64urlEncode(signature)}`;

  const res = await fetch(tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Google token exchange failed (HTTP ${res.status}): ${body.slice(0, 400)}`);
  }

  const json = (await res.json()) as { access_token?: string; error?: string };
  if (!json.access_token) {
    throw new Error(`Google token exchange: no access_token in response`);
  }
  return json.access_token;
}
