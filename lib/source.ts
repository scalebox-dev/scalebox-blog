import { blog as blogPosts } from 'collections/server';
import { loader } from 'fumadocs-core/source';
import { toFumadocsSource } from 'fumadocs-mdx/runtime/server';
import { i18n } from '@/lib/i18n';

export const blog = loader(toFumadocsSource(blogPosts, []), {
  baseUrl: '/',
  i18n,
});
