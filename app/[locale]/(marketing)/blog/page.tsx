'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';
import { SectionReveal } from '@/components/marketing/landing/SectionReveal';
import { MarketingScrollToTop } from '@/components/marketing/MarketingScrollToTop';
import { FlexibleBlogCard } from '@/components/marketing/blog/FlexibleBlogCard';
import { FlexibleBlogCardSkeleton } from '@/components/marketing/blog/FlexibleBlogCardSkeleton';
import { getBlogContent } from '@/components/marketing/pawtaker/content';
import { getPublishedBlogs } from '@/lib/blogs';
import type { PublicBlogSummary } from '@/lib/blogs';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://pawtaker-web.vercel.app';

function resolveLocale(locale: string): Locale {
  return locale === 'fr' || locale === 'en' ? locale : 'en';
}

type SortOption = 'newest' | 'oldest';

function toTimestamp(value: string) {
  return new Date(value).getTime();
}

export default function BlogListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [blogPosts, setBlogPosts] = useState<PublicBlogSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedLocale, setResolvedLocale] = useState<Locale>('en');
  const [fallbackLabels, setFallbackLabels] = useState(getBlogContent('en'));

  // Scroll to top immediately when page loads
  useScrollToTop();

  const searchLabel = resolvedLocale === 'fr' ? 'Rechercher' : 'Search';
  const searchPlaceholder =
    resolvedLocale === 'fr'
      ? 'Rechercher par titre ou extrait...'
      : 'Search by title or excerpt...';
  const noSearchResults =
    resolvedLocale === 'fr'
      ? 'Aucun blog ne correspond à votre recherche.'
      : 'No blogs match your search.';

  const sortedPosts = useMemo(() => {
    const query = search.trim().toLowerCase();
    const next = blogPosts.filter((post) => {
      if (!query) return true;
      const haystack = [post.title, post.excerpt, post.slug].join(' ').toLowerCase();
      return haystack.includes(query);
    });
    next.sort((a, b) =>
      sort === 'newest' ? toTimestamp(b.date) - toTimestamp(a.date) : toTimestamp(a.date) - toTimestamp(b.date)
    );
    return next;
  }, [blogPosts, search, sort]);

  useEffect(() => {
    async function initializePage() {
      try {
        const { locale } = await params;
        const resolved = resolveLocale(locale);
        setResolvedLocale(resolved);
        setFallbackLabels(getBlogContent(resolved));
        
        const posts = await getPublishedBlogs(resolved);
        setBlogPosts(posts);
      } catch (error) {
        console.error('Failed to initialize page:', error);
      } finally {
        setLoading(false);
      }
    }
    
    initializePage();
  }, [params]);

  if (loading) {
    return (
      <>
        <LandingNavbar />
        <main className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px]">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[760px]">
                <div className="h-12 w-64 bg-[#d5c2c6] rounded mb-4 animate-pulse"></div>
                <div className="h-6 w-96 bg-[#d5c2c6] rounded mb-12 animate-pulse"></div>
              </div>
            <div className="grid w-full gap-4 md:min-w-[320px] md:max-w-[520px] md:grid-cols-[1fr_180px]">
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-[#d5c2c6] rounded animate-pulse"></div>
                <div className="h-12 w-full bg-[#d5c2c6] rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="h-4 w-24 bg-[#d5c2c6] rounded animate-pulse"></div>
                <div className="h-12 w-full bg-[#d5c2c6] rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex min-w-0">
                  <FlexibleBlogCardSkeleton />
                </div>
              ))}
            </div>
          </div>
        </main>
        <MarketingScrollToTop />
      </>
    );
  }

  return (
    <>
      <LandingNavbar />
      <main className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px]">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[760px]">
              <h1 className="font-wobblite text-[52px] leading-[0.82] tracking-[-0.5px] text-[#665459] sm:text-[68px] xl:text-[100px]">
                {fallbackLabels.allBlogs}
              </h1>
            </div>

            <div className="grid w-full gap-4 md:min-w-[320px] md:max-w-[520px] md:grid-cols-[1fr_180px]">
              <div className="flex flex-col gap-2">
                <label htmlFor="blog-search" className="text-xs font-semibold uppercase tracking-wide text-[#665459]/75">
                  {searchLabel}
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#665459]/45"
                    aria-hidden="true"
                  />
                  <input
                    id="blog-search"
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full rounded-full border border-[#d5c2c6] bg-white py-3 pl-11 pr-4 text-sm font-medium text-[#665459] outline-none ring-[#8c4a60]/20 placeholder:text-[#665459]/55 focus-visible:ring-2"
                  />
                </div>
              </div>
              <div className="flex min-w-[180px] flex-col gap-2">
                <label htmlFor="blog-sort" className="text-xs font-semibold uppercase tracking-wide text-[#665459]/75">
                  {fallbackLabels.sortByDate}
                </label>
                <select
                  id="blog-sort"
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortOption)}
                  className="rounded-full border border-[#d5c2c6] bg-white px-4 py-3 text-sm font-medium text-[#665459] outline-none ring-[#8c4a60]/20 focus-visible:ring-2"
                >
                  <option value="newest">{fallbackLabels.newestFirst}</option>
                  <option value="oldest">{fallbackLabels.oldestFirst}</option>
                </select>
              </div>
            </div>
          </div>

          {sortedPosts.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedPosts.map((post) => (
                <div key={post.slug} className="flex min-w-0">
                  <FlexibleBlogCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[28px] border border-dashed border-[#d5c2c6] bg-[#fffafa] px-6 py-16 text-center text-[#665459]">
              {search.trim() ? noSearchResults : fallbackLabels.noBlogs}
            </div>
          )}
        </div>
      </main>
      <MarketingScrollToTop />
    </>
  );
}
