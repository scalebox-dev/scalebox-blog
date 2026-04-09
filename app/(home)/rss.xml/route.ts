import { Feed } from 'feed';
import { blog } from '@/lib/source';
import { NextResponse } from 'next/server';

export const revalidate = false;

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog.scalebox.dev';

export function GET() {
  const feed = new Feed({
    title: 'ScaleBox Blog',
    id: `${baseUrl}`,
    link: `${baseUrl}`,
    language: 'en',
    copyright: `All rights reserved ${new Date().getFullYear()}, ScaleBox`,
  });

  for (const page of [...blog.getPages()].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )) {
    feed.addItem({
      id: page.url,
      title: page.data.title,
      description: page.data.description ?? '',
      link: `${baseUrl}${page.url}`,
      date: new Date(page.data.date),
      author: [{ name: page.data.author }],
    });
  }

  return new NextResponse(feed.rss2(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
    },
  });
}
