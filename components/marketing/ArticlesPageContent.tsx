'use client';

import { useMemo, useState } from 'react';
import { PawtakerBlogCard } from '@/components/marketing/pawtaker/PawtakerMarketingPrimitives';
import type { PublicBlogSummary } from '@/lib/blogs';
import { LandingNavbar } from './landing/LandingNavbar';

type SortOption = 'newest' | 'oldest';

function toTimestamp(value: string) {
  return new Date(value).getTime();
}

export function ArticlesPageContent({
  posts,
}: {
  posts: PublicBlogSummary[];
}) {
  const [sort, setSort] = useState<SortOption>('newest');

  const sortedPosts = useMemo(() => {
    const next = [...posts];
    next.sort((a, b) =>
      sort === 'newest' ? toTimestamp(b.date) - toTimestamp(a.date) : toTimestamp(a.date) - toTimestamp(b.date)
    );
    return next;
  }, [posts, sort]);

  return (
    <>
    <LandingNavbar />
    <main className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-10 xl:px-[80px]">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[760px]">
            <h1 className="font-wobblite text-[52px] leading-[0.82] tracking-[-0.5px] text-[#8c4a60] sm:text-[68px] xl:text-[100px]">
              articles
            </h1>
            <p className="mt-4 text-[18px] leading-7 tracking-[-0.1px] text-[#665459] xl:text-[22px]">
              Browse every PawTaker article and sort them by date.
            </p>
          </div>

          <div className="flex min-w-[180px] flex-col gap-2">
            <label htmlFor="articles-sort" className="text-xs font-semibold uppercase tracking-wide text-[#665459]/75">
              Sort by date
            </label>
            <select
              id="articles-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="rounded-full border border-[#d5c2c6] bg-white px-4 py-3 text-sm font-medium text-[#665459] outline-none ring-[#8c4a60]/20 focus-visible:ring-2"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>

        {sortedPosts.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sortedPosts.map((post) => (
              <div key={post.slug} className="min-w-0">
                <PawtakerBlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12 rounded-[28px] border border-dashed border-[#d5c2c6] bg-[#fffafa] px-6 py-16 text-center text-[#665459]">
            No articles yet.
          </div>
        )}
      </div>
    </main>
    </>
  );
}
