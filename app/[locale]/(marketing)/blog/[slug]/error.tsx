'use client';

import { LandingNavbar } from '@/components/marketing/landing/LandingNavbar';

export default function BlogDetailsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <>
      <LandingNavbar />
      <main className="overflow-x-clip bg-[#f5f0f0]">
        <section className="bg-[#ede6e7] px-5 py-20 sm:px-8 lg:px-[80px]">
          <div className="mx-auto max-w-[800px] rounded-[28px] bg-[#fffafa] px-6 py-14 text-center shadow-sm sm:px-10">
            <h1 className="font-wobblite text-[42px] leading-[0.9] text-[#8c4a60] sm:text-[56px]">
              blog unavailable
            </h1>
            <p className="mt-5 text-[18px] leading-7 text-[#665459]">
              {error.message || 'We could not load this blog right now.'}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-8 inline-flex rounded-full bg-[#8c4a60] px-6 py-3 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
