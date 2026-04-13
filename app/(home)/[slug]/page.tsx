import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blog } from '@/lib/source';
import { getMDXComponents } from '@/components/mdx';
import { InlineTOC } from 'fumadocs-ui/components/inline-toc';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { cookies } from 'next/headers';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  normalizeLocale,
  toBcp47Locale,
  type SupportedLocale,
} from '@/lib/prefs';

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  const cookieStore = await cookies();
  const preferredLocale: SupportedLocale =
    normalizeLocale(cookieStore.get(LOCALE_COOKIE)?.value) ?? DEFAULT_LOCALE;
  const intlLocale = toBcp47Locale(preferredLocale);

  const { body: Mdx, toc } = await page.data.load();

  return (
    <article className="mx-auto flex w-full max-w-[800px] flex-col px-4 py-8 md:py-12">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground transition-colors hover:text-fd-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Back to Blog
      </Link>

      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <User className="size-3.5" />
          {page.data.author}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          {new Date(page.data.date).toLocaleDateString(intlLocale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </span>
      </div>

      <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        {page.data.title}
      </h1>
      <p className="mb-8 text-lg text-fd-muted-foreground">
        {page.data.description}
      </p>

      <div className="prose min-w-0 flex-1">
        <InlineTOC items={toc} />
        <Mdx components={getMDXComponents()} />
      </div>
    </article>
  );
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blog.getPage([params.slug]);

  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}

export function generateStaticParams(): { slug: string }[] {
  return blog.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
