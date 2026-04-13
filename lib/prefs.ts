export const THEME_COOKIE = 'DOCS_THEME';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

// 与 docs 站点保持一致：用于 URL `?lang=` 的可选值集合。
export const SUPPORTED_LOCALES = ['en', 'zh-cn', 'zh-tw'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const SUPPORTED_THEMES = ['light', 'dark', 'system'] as const;
export type SupportedTheme = (typeof SUPPORTED_THEMES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en';

export function normalizeLocale(value: string | null | undefined): SupportedLocale | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return SUPPORTED_LOCALES.find((locale) => locale.toLowerCase() === normalized) ?? null;
}

export function normalizeTheme(value: string | null | undefined): SupportedTheme | null {
  if (!value) return null;
  const normalized = value.trim().toLowerCase();
  return SUPPORTED_THEMES.find((theme) => theme === normalized) ?? null;
}

export function isSupportedLocale(value: string): value is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * 将站点 locale（如 zh-cn）映射为 `Intl`/`toLocaleDateString` 更友好的 BCP 47 标签。
 */
export function toBcp47Locale(locale: SupportedLocale): string {
  if (locale === 'zh-cn') return 'zh-CN';
  if (locale === 'zh-tw') return 'zh-TW';
  return 'en-US';
}
