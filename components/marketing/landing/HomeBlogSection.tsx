'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/lib/i18n/navigation';
import { BlogRail } from '@/components/marketing/pawtaker/BlogRail';
import { PawtakerBlogCard } from '@/components/marketing/pawtaker/PawtakerMarketingPrimitives';
import { getBlogContent } from '@/components/marketing/pawtaker/content';
import type { PublicBlogSummary } from '@/lib/blogs';
import type { Locale } from '@/lib/i18n/config';
import { ArrowRight } from 'lucide-react';

function BlogCardSkeleton() {
  return (
    <div className="w-[300px] shrink-0 rounded-[20px] bg-[#fffafa] p-1 min-[500px]:w-[280px] sm:w-[320px] lg:w-[360px]">
      <div className="overflow-hidden rounded-[16px] bg-[#eadedf]">
        <div className="h-[236px] w-full animate-pulse bg-[#e7d9dd]" />
      </div>
      <div className="space-y-3 px-5 py-5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 animate-pulse rounded-full bg-[#eadedf]" />
          <div className="h-4 w-32 animate-pulse rounded-full bg-[#eadedf]" />
        </div>
        <div className="h-7 w-11/12 animate-pulse rounded-full bg-[#eadedf]" />
        <div className="h-7 w-8/12 animate-pulse rounded-full bg-[#eadedf]" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded-full bg-[#eadedf]" />
          <div className="h-4 w-10/12 animate-pulse rounded-full bg-[#eadedf]" />
          <div className="h-4 w-8/12 animate-pulse rounded-full bg-[#eadedf]" />
        </div>
        <div className="h-4 w-24 animate-pulse rounded-full bg-[#eadedf]" />
      </div>
    </div>
  );
}

export function HomeBlogSection({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const [blogs, setBlogs] = useState<PublicBlogSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fallbackLabels = getBlogContent(locale);

  useEffect(() => {
    let isActive = true;

    async function loadBlogs() {
      setError(null);
      try {
        const res = await fetch(`/api/blogs?locale=${locale}`, { credentials: 'same-origin' });
        const json = (await res.json()) as { blogs?: PublicBlogSummary[]; error?: string };
        if (!res.ok) {
          throw new Error(json.error ?? 'Failed to fetch blogs.');
        }

        if (isActive) {
          setBlogs(json.blogs ?? []);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch blogs.');
          setBlogs([]);
        }
      }
    }

    void loadBlogs();

    return () => {
      isActive = false;
    };
  }, [locale]);

  if (blogs?.length === 0 && !error) {
    return null;
  }

  return (
    <section className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px]">
      <BlogRail title={title}>
        {error ? (
          <div className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d5c2c6] bg-[#fffafa] px-6 text-center">
            <p className="text-[18px] font-medium text-[#665459]">{error}</p>
          </div>
        ) : blogs === null ? (
          <>
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
            <BlogCardSkeleton />
          </>
        ) : (
          blogs.map((post) => <PawtakerBlogCard key={post.slug} post={post} />)
        )}
      </BlogRail>
      
      {blogs && blogs.length > 0 && (
        <div className="mt-8 mx-auto max-w-[1440px]">
              <Link
                href="/blog"
                className="text-[22px] underline font-bold tracking-[-0.2px] text-[#665459] hover:text-[#8c4a60] transition-colors inline-flex items-center gap-2"
              >
                <p>{fallbackLabels.seeAllBlogs}</p>
                <ArrowRight color="#665459" size={22} />
              </Link>
        </div>
      )}
    </section>
  );
}
