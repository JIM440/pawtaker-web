import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';
import { MarketingFooter } from '@/components/marketing/Footer';

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
      </div>
    </div>
  );
}

export default function BlogDetailsLoading() {
  return (
    <>
      <LandingNavbar />
      <main className="overflow-x-clip bg-[#f5f0f0]">
        <section className="bg-[#ede6e7] px-5 py-14 sm:px-8 lg:px-[80px] lg:py-16">
          <div className="mx-auto max-w-[800px] space-y-8 sm:space-y-10">
            <div className="space-y-6 px-1">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="h-11 w-56 animate-pulse rounded-full bg-[#eadedf]" />
                <div className="h-11 w-32 animate-pulse rounded-full bg-[#eadedf]" />
              </div>
              <div className="space-y-4">
                <div className="h-16 w-11/12 animate-pulse rounded-[20px] bg-[#eadedf]" />
                <div className="h-16 w-8/12 animate-pulse rounded-[20px] bg-[#eadedf]" />
                <div className="h-6 w-full animate-pulse rounded-full bg-[#eadedf]" />
                <div className="h-6 w-10/12 animate-pulse rounded-full bg-[#eadedf]" />
                <div className="h-6 w-32 animate-pulse rounded-full bg-[#eadedf]" />
              </div>
            </div>

            <div className="h-[420px] w-full animate-pulse rounded-[24px] bg-[#eadedf]" />

            <div className="space-y-4 px-1">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-5 w-full animate-pulse rounded-full bg-[#eadedf]" />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f5f0f0] px-5 py-16 sm:px-8 lg:px-[80px] lg:py-16">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-10 h-16 w-64 animate-pulse rounded-[20px] bg-[#eadedf]" />
            <div className="flex gap-5 overflow-hidden">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </>
  );
}
