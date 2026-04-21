import { NextRequest, NextResponse } from 'next/server';
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  normalizeLocale,
  normalizeTheme,
  type SupportedLocale,
} from '@/lib/prefs';
import { i18n } from '@/lib/i18n';

const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;
type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

function removeControlParams(url: URL): void {
  url.searchParams.delete('lang');
  url.searchParams.delete('theme');
}

function setPreferenceCookies(
  response: NextResponse,
  locale: SupportedLocale | null,
  theme: SupportedTheme | null,
): NextResponse {
  if (locale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (theme) {
    response.cookies.set(THEME_COOKIE, theme, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

function getPathnameLocale(pathname: string): SupportedLocale | null {
  const firstSegment = pathname.split('/')[1]?.toLowerCase();
  if (!firstSegment) return null;
  const match = i18n.languages.find((l) => l.toLowerCase() === firstSegment);
  return (match as SupportedLocale | undefined) ?? null;
}

function getQueryLocale(request: NextRequest): SupportedLocale | null {
  const lang = request.nextUrl.searchParams.get('lang')?.trim().toLowerCase();
  if (!lang) return null;
  const match = i18n.languages.find((item) => item.toLowerCase() === lang);
  return (match as SupportedLocale | undefined) ?? null;
}

function getQueryTheme(request: NextRequest): SupportedTheme | null {
  const theme = request.nextUrl.searchParams.get('theme')?.trim().toLowerCase();
  if (!theme) return null;
  return SUPPORTED_THEMES.find((item) => item === theme) ?? null;
}

function detectLanguage(request: NextRequest): string {
  const acceptLang = request.headers.get('accept-language');
  if (!acceptLang) return i18n.defaultLanguage;

  const entries = acceptLang
    .split(',')
    .map((entry) => {
      const [l, q] = entry.trim().split(';q=');
      return { lang: l.trim().toLowerCase(), quality: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const entry of entries) {
    const browserLang = entry.lang;

    const exact = i18n.languages.find((lang) => lang.toLowerCase() === browserLang);
    if (exact) return exact;

    const prefix = i18n.languages.find(
      (lang) =>
        lang.toLowerCase().startsWith(browserLang.split('-')[0] ?? '') ||
        browserLang.startsWith(lang.toLowerCase().split('-')[0] ?? ''),
    );
    if (prefix) return prefix;
  }

  return i18n.defaultLanguage;
}

function resolvePreferredLocale(
  request: NextRequest,
  queryLocale: SupportedLocale | null,
): string {
  if (queryLocale) return queryLocale;

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && (i18n.languages as string[]).includes(cookieLocale)) {
    return cookieLocale;
  }

  return detectLanguage(request);
}

function rebuildPathWithLocale(pathname: string, canonicalLocale: SupportedLocale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${canonicalLocale}`;
  segments[0] = canonicalLocale;
  return `/${segments.join('/')}`;
}

/**
 * Next.js 16 proxy: redirect un-prefixed paths to `/{lang}/...`, aligned with scalebox-docs.
 */
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.endsWith('.xml')) {
    return NextResponse.next();
  }

  const queryLocale = getQueryLocale(request);
  const queryTheme = getQueryTheme(request);

  const existingLocale = getPathnameLocale(pathname);

  if (existingLocale) {
    const canonicalLocale = (queryLocale ?? existingLocale) as SupportedLocale;
    const rebuilt = rebuildPathWithLocale(pathname, canonicalLocale);
    const needsPathFix = rebuilt !== pathname;

    const hasControlParams = queryLocale !== null || queryTheme !== null;

    if (hasControlParams || needsPathFix) {
      const url = new URL(rebuilt, request.nextUrl);
      url.search = request.nextUrl.search;
      removeControlParams(url);
      return setPreferenceCookies(
        NextResponse.redirect(url),
        canonicalLocale,
        normalizeTheme(queryTheme ?? undefined),
      );
    }

    return setPreferenceCookies(
      NextResponse.next(),
      canonicalLocale,
      normalizeTheme(queryTheme ?? undefined),
    );
  }

  const detectedLang = resolvePreferredLocale(request, queryLocale);
  const normalizedDetected = normalizeLocale(detectedLang) ?? ('en' as SupportedLocale);

  const redirectPath =
    pathname === '/' ? `/${normalizedDetected}` : `/${normalizedDetected}${pathname}`;
  const url = new URL(redirectPath, request.nextUrl);
  url.search = request.nextUrl.search;
  removeControlParams(url);

  return setPreferenceCookies(
    NextResponse.redirect(url),
    queryLocale ?? normalizedDetected,
    normalizeTheme(queryTheme ?? undefined),
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
