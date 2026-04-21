import '../global.css';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { BlogPrefSync } from '../_components/blog-pref-sync';
import {
  LOCALE_COOKIE,
  THEME_COOKIE,
  normalizeTheme,
  type SupportedLocale,
  isSupportedLocale,
} from '@/lib/prefs';
import { blogI18nUI, baseOptions } from '@/lib/layout.shared';

const inter = Inter({
  subsets: ['latin'],
});

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const rawLang = (await params).lang;
  if (!isSupportedLocale(rawLang)) notFound();
  const lang: SupportedLocale = rawLang;

  const cookieStore = await cookies();
  const preferredTheme = normalizeTheme(cookieStore.get(THEME_COOKIE)?.value);

  const htmlLang = lang === 'zh-cn' ? 'zh-CN' : lang === 'zh-tw' ? 'zh-TW' : 'en';

  return (
    <html lang={htmlLang} className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          i18n={blogI18nUI.provider(lang)}
          theme={{
            defaultTheme: preferredTheme ?? 'system',
            enableSystem: preferredTheme ? preferredTheme === 'system' : true,
            storageKey: THEME_COOKIE,
          }}
        >
          <BlogPrefSync />
          <HomeLayout {...baseOptions(lang)}>{children}</HomeLayout>
        </RootProvider>
      </body>
    </html>
  );
}
