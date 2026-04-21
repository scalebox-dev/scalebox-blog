import Link from 'next/link';
import { notFound } from 'next/navigation';
import { blog } from '@/lib/source';
import { Calendar, User } from 'lucide-react';
import {
  isSupportedLocale,
  toBcp47Locale,
  type SupportedLocale,
} from '@/lib/prefs';

function getName(path: string): string {
  const base = path.split('/').pop() ?? '';
  return base.replace(/\.mdx?$/, '');
}

const copy: Record<
  SupportedLocale,
  { heading: string; subtitle: string }
> = {
  en: {
    heading: 'Blog',
    subtitle: 'Latest news, updates, and insights from the ScaleBox team.',
  },
  'zh-cn': {
    heading: '博客',
    subtitle: '来自 ScaleBox 团队的最新动态、更新与见解。',
  },
  'zh-tw': {
    heading: '部落格',
    subtitle: '來自 ScaleBox 團隊的最新消息、更新與見解。',
  },
};

export default async function BlogHomePage(props: {
  params: Promise<{ lang: string }>;
}) {
  const rawLang = (await props.params).lang;
  if (!isSupportedLocale(rawLang)) notFound();
  const lang = rawLang;
  const intlLocale = toBcp47Locale(lang);
  const t = copy[lang];

  const posts = [...blog.getPages(lang)].sort(
    (a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() -
      new Date(a.data.date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:pt-12">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">{t.heading}</h1>
        <p className="text-lg text-fd-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex flex-col rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-fd-accent/50 hover:shadow-md"
          >
            <h2 className="mb-2 text-lg font-semibold transition-colors group-hover:text-fd-primary">
              {post.data.title}
            </h2>
            <p className="mb-4 line-clamp-2 flex-1 text-sm text-fd-muted-foreground">
              {post.data.description}
            </p>
            <div className="flex items-center gap-4 border-t border-fd-border pt-4 text-xs text-fd-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <User className="size-3" />
                {post.data.author}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(post.data.date ?? getName(post.path)).toLocaleDateString(intlLocale, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export function generateStaticParams(): { lang: SupportedLocale }[] {
  return [{ lang: 'en' }, { lang: 'zh-cn' }, { lang: 'zh-tw' }];
}
