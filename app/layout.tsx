import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { BlogPrefSync } from './_components/blog-pref-sync';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  THEME_COOKIE,
  normalizeLocale,
  normalizeTheme,
  type SupportedLocale,
} from '@/lib/prefs';

const inter = Inter({
  subsets: ['latin'],
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const preferredTheme = normalizeTheme(cookieStore.get(THEME_COOKIE)?.value);
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const preferredLocale: SupportedLocale = cookieLocale ?? DEFAULT_LOCALE;

  const htmlLang = preferredLocale === 'zh-cn' ? 'zh-CN' : preferredLocale === 'zh-tw' ? 'zh-TW' : 'en';

  return (
    <html lang={htmlLang} className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          i18n={{
            locale: preferredLocale,
            locales: SUPPORTED_LOCALES.map((locale) => ({
              locale,
              name:
                locale === 'en'
                  ? 'English'
                  : locale === 'zh-cn'
                    ? '简体中文'
                    : '繁體中文',
            })),
          }}
          theme={{
            defaultTheme: preferredTheme ?? 'system',
            enableSystem: preferredTheme ? preferredTheme === 'system' : true,
            storageKey: THEME_COOKIE,
          }}
        >
          <BlogPrefSync />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
