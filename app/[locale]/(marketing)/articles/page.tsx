import type { Locale } from '@/lib/i18n/config';
import { ArticlesPageContent } from '@/components/marketing/ArticlesPageContent';
import { getPublishedBlogs } from '@/lib/blogs';

function resolveLocale(locale: string): Locale {
  return locale === 'fr' || locale === 'en' ? locale : 'en';
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const posts = await getPublishedBlogs(resolveLocale(locale));

  return <ArticlesPageContent posts={posts} />;
}
