import Link from 'next/link';
import { blog } from '@/lib/source';
import { Calendar, User } from 'lucide-react';
import { cookies } from 'next/headers';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  normalizeLocale,
  toBcp47Locale,
  type SupportedLocale,
} from '@/lib/prefs';

function getName(path: string): string {
  const base = path.split('/').pop() ?? '';
  return base.replace(/\.mdx?$/, '');
}

export default async function BlogPage() {
  const cookieStore = await cookies();
  const preferredLocale: SupportedLocale =
    normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? DEFAULT_LOCALE;
  const intlLocale = toBcp47Locale(preferredLocale);

  const posts = [...blog.getPages()].sort(
    (a, b) =>
      new Date(b.data.date ?? getName(b.path)).getTime() -
      new Date(a.data.date ?? getName(a.path)).getTime(),
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-8 md:pt-12">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight">Blog</h1>
        <p className="text-fd-muted-foreground text-lg">
          Latest news, updates, and insights from the ScaleBox team.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="group flex flex-col rounded-xl border border-fd-border bg-fd-card p-5 shadow-sm transition-all hover:shadow-md hover:bg-fd-accent/50 hover:-translate-y-0.5"
          >
            <h2 className="mb-2 text-lg font-semibold group-hover:text-fd-primary transition-colors">
              {post.data.title}
            </h2>
            <p className="mb-4 flex-1 text-sm text-fd-muted-foreground line-clamp-2">
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
