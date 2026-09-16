import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isValidLocale,
} from './src/config/i18n.config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, Next internal files, and api routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files like favicon.ico, images, robots.txt, sitemap.xml
  ) {
    return NextResponse.next();
  }

  // 2. Check if pathname already starts with a supported locale
  const pathnameLocale = SUPPORTED_LOCALES.find(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameLocale) {
    // Response with security and camera permissions headers
    const response = NextResponse.next();
    response.headers.set('x-locale', pathnameLocale);
    response.headers.set(
      'Permissions-Policy',
      'camera=(self), geolocation=(self)',
    );
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  }

  // 3. Resolve preferred locale from cookie or Accept-Language header
  let targetLocale = DEFAULT_LOCALE;
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    targetLocale = cookieLocale;
  } else {
    const acceptLanguage = request.headers.get('accept-language') || '';
    for (const locale of SUPPORTED_LOCALES) {
      if (acceptLanguage.toLowerCase().includes(locale)) {
        targetLocale = locale;
        break;
      }
    }
  }

  // 4. Redirect to localized URL
  const newUrl = new URL(
    `/${targetLocale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`,
    request.url,
  );
  newUrl.search = request.nextUrl.search;

  const response = NextResponse.redirect(newUrl);
  response.headers.set(
    'Permissions-Policy',
    'camera=(self), geolocation=(self)',
  );
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
