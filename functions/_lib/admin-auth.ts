// HMAC-signed admin cookie verification, mirroring middleware.ts so any
// /api/admin/* endpoint can re-check the cookie before exposing the
// Supabase service-role key. Same scheme; do not change one without the
// other.

const ADMIN_COOKIE = "clm_admin";

export function readCookie(req: Request, name: string): string | null {
  const header = req.headers.get("Cookie") ?? "";
  for (const part of header.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return rest.join("=");
  }
  return null;
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

export async function verifyAdminCookie(cookieValue: string, secret: string): Promise<boolean> {
  try {
    const parts = cookieValue.split(".");
    if (parts.length !== 2) return false;
    const [payloadB64, sigB64] = parts;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sig = b64urlDecode(sigB64);
    const valid = await crypto.subtle.verify("HMAC", key, sig, enc.encode(payloadB64));
    if (!valid) return false;
    const json = new TextDecoder().decode(b64urlDecode(payloadB64));
    const { exp } = JSON.parse(json) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export async function isAdminRequest(req: Request, secret: string | undefined): Promise<boolean> {
  if (!secret) return false;
  const cookie = readCookie(req, ADMIN_COOKIE);
  if (!cookie) return false;
  return verifyAdminCookie(cookie, secret);
}
