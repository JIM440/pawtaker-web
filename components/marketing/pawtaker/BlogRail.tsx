'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export function BlogRail({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0.24);

  function updateScrollState() {
    const rail = railRef.current;
    if (!rail) return;

    const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
    setCanScrollLeft(rail.scrollLeft > 8);
    setCanScrollRight(rail.scrollLeft < maxScrollLeft - 8);
    setScrollProgress(maxScrollLeft > 0 ? rail.scrollLeft / maxScrollLeft : 0);
    setThumbWidth(
      rail.scrollWidth > 0 ? Math.min(1, Math.max(0.18, rail.clientWidth / rail.scrollWidth)) : 1
    );
  }

  function scrollByAmount(direction: 'left' | 'right') {
    const rail = railRef.current;
    if (!rail) return;

    const amount = Math.max(rail.clientWidth * 0.82, 280);
    rail.scrollBy({
      left: direction === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  }

  useEffect(() => {
    updateScrollState();

    const rail = railRef.current;
    if (!rail) return;

    const handleScroll = () => updateScrollState();
    const handleResize = () => updateScrollState();

    rail.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      rail.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [children]);

  return (
    <div className="mx-auto max-w-[1440px]">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="font-wobblite text-[52px] leading-[0.8] tracking-[-0.5px] text-[#8c4a60] sm:text-[68px] xl:text-[100px]">
          {title}
        </h2>
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            aria-label="Scroll blogs left"
            onClick={() => scrollByAmount('left')}
            disabled={!canScrollLeft}
            className={`inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border transition-colors ${
              canScrollLeft
                ? 'border-[#837377] bg-white text-[#665459]'
                : 'border-[#d5c2c6] bg-[#ede6e7] text-[#b7a9ad]'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll blogs right"
            onClick={() => scrollByAmount('right')}
            disabled={!canScrollRight}
            className={`inline-flex h-[50px] w-[50px] items-center justify-center rounded-full border transition-colors ${
              canScrollRight
                ? 'border-[#837377] bg-white text-[#665459]'
                : 'border-[#d5c2c6] bg-[#ede6e7] text-[#b7a9ad]'
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-[#e4d8db]">
        <div
          className="h-full rounded-full bg-[#8c4a60] transition-transform duration-200"
          style={{
            width: `${thumbWidth * 100}%`,
            transform: `translateX(${scrollProgress * (100 / thumbWidth - 100)}%)`,
          }}
        />
      </div>
    </div>
  );
}
