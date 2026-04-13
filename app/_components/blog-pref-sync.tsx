'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  normalizeLocale,
  normalizeTheme,
  type SupportedLocale,
  type SupportedTheme,
} from '@/lib/prefs';

function applyThemeClass(value: SupportedTheme) {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');

  if (value === 'light' || value === 'dark') {
    root.classList.add(value);
    root.style.colorScheme = value;
    return;
  }

  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = prefersDark ? 'dark' : 'light';
  root.classList.add(resolved);
  root.style.colorScheme = resolved;
}

function setHtmlLang(locale: SupportedLocale) {
  if (locale === 'zh-cn') {
    document.documentElement.lang = 'zh-CN';
    return;
  }
  if (locale === 'zh-tw') {
    document.documentElement.lang = 'zh-TW';
    return;
  }
  document.documentElement.lang = 'en';
}

export function BlogPrefSync() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const locale = normalizeLocale(searchParams.get('lang'));
    const theme = normalizeTheme(searchParams.get('theme'));

    if (!locale && !theme) return;

    if (theme) {
      applyThemeClass(theme);
      localStorage.setItem(THEME_COOKIE, theme);
      document.cookie = `${THEME_COOKIE}=${theme}; path=/; max-age=31536000`;
    }

    if (locale) {
      setHtmlLang(locale);
      document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000`;
    }

    // 参数消费后清理 URL，避免分享链接时反复覆盖用户偏好。
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    url.searchParams.delete('theme');
    const nextUrl = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, '', nextUrl);
  }, [searchParams]);

  return null;
}
