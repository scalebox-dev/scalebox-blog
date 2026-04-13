import { NextRequest, NextResponse } from 'next/server';
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  normalizeLocale,
  normalizeTheme,
} from '@/lib/prefs';

function removeControlParams(url: URL): void {
  url.searchParams.delete('lang');
  url.searchParams.delete('theme');
}

function setPreferenceCookies(
  response: NextResponse,
  locale: ReturnType<typeof normalizeLocale>,
  theme: ReturnType<typeof normalizeTheme>,
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

// Next.js 16 推荐使用 proxy 文件约定
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // RSS/Atom 等机器可读路由：避免 query 触发重定向影响抓取。
  if (pathname.endsWith('.xml')) {
    return NextResponse.next();
  }

  const queryLocale = normalizeLocale(request.nextUrl.searchParams.get('lang'));
  const queryTheme = normalizeTheme(request.nextUrl.searchParams.get('theme'));

  if (!queryLocale && !queryTheme) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  removeControlParams(url);

  return setPreferenceCookies(NextResponse.redirect(url), queryLocale, queryTheme);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
