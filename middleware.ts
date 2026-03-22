import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from '@/lib/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Route protection disabled for now; admin routes are open.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);
  const requestWithPath = new NextRequest(request.url, { headers: requestHeaders });
  return intlMiddleware(requestWithPath);
}

export const config = {
  // next-intl: include `/` and locale-prefixed paths explicitly (fixes 404 on `/` and `/admin/*` on Next 15+)
  matcher: [
    '/',
    '/(en|fr)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
