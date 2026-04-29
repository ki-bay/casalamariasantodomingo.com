import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const ADMIN_COOKIE = 'clm_admin';

// Matches /es/admin or /en/admin (and sub-paths), but NOT the admin login page
function isProtectedAdminRoute(pathname: string): boolean {
  return (
    /^\/(es|en)\/admin/.test(pathname) &&
    !/^\/(es|en)\/admin\/login/.test(pathname)
  );
}

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function verifyAdminCookie(cookieValue: string, secret: string): Promise<boolean> {
  try {
    const parts = cookieValue.split('.');
    if (parts.length !== 2) return false;
    const [payloadB64, sigB64] = parts;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sig = b64urlDecode(sigB64);
    const valid = await crypto.subtle.verify('HMAC', key, sig, enc.encode(payloadB64));
    if (!valid) return false;

    const json = new TextDecoder().decode(b64urlDecode(payloadB64));
    const { exp } = JSON.parse(json) as { exp: number };
    return Date.now() < exp;
  } catch {
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedAdminRoute(pathname)) {
    const secret = process.env.ADMIN_COOKIE_SECRET ?? '';
    const cookieVal = request.cookies.get(ADMIN_COOKIE)?.value ?? '';
    const isValid = secret ? await verifyAdminCookie(cookieVal, secret) : false;

    if (!isValid) {
      const locale = pathname.startsWith('/en') ? 'en' : 'es';
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all paths except api, _next, static files
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
