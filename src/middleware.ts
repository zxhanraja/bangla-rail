import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Sliding-window in-memory rate limiter
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up expired records every 5 minutes to keep memory small
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    for (const [key, record] of rateLimitMap.entries()) {
      if (now > record.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 4. Force HTTPS in production ─────────────────────────────────────────
  const isProduction = process.env.NODE_ENV === 'production';
  const proto = request.headers.get('x-forwarded-proto');
  if (isProduction && proto && proto !== 'https') {
    const httpsUrl = request.nextUrl.clone();
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, { status: 301 });
  }

  // Apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous-client';

    // Stricter limits on submission/post routes, generous on searches
    const isWriteRoute = request.method === 'POST' || pathname.startsWith('/api/corrections');
    const limit = isWriteRoute ? 30 : 150;
    const windowMs = 60 * 1000;

    const allowed = checkRateLimit(ip, limit, windowMs);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests. Please slow down and try again in a moment.',
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
  }

  const response = NextResponse.next();

  // ── Security headers ──────────────────────────────────────────────────────
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // ── HSTS: Force HTTPS for 2 years, subdomains, preload ───────────────────
  if (isProduction) {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload'
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except Next.js internals and static files
     * This enables HTTPS enforcement and security headers for all routes
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
