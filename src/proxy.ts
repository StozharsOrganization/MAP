import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Locale routing:
 *   /            -> Ukrainian (internally rewritten to /ua/...)
 *   /en/...      -> English
 *   /ua/...      -> redirected to the clean URL without prefix (avoid duplicate content)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/en' || pathname.startsWith('/en/')) {
    return NextResponse.next();
  }

  if (pathname === '/ua' || pathname.startsWith('/ua/')) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || '/';
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/ua${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Skip API routes, Next internals, metadata files and anything with a file extension
    '/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
