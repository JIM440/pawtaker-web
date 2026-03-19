'use client';

import { useEffect, useState } from 'react';

interface KycImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function KycImageModal({ images, initialIndex, onClose }: KycImageModalProps) {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setCurrent((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setCurrent((i) => Math.min(images.length - 1, i + 1));
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [images.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/75 backdrop-blur-[1px] px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <span className="text-sm font-medium text-slate-700">
            {current + 1} / {images.length}
          </span>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Image */}
        <div className="relative bg-black aspect-video flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`Document ${current + 1}`}
            className="max-h-full max-w-full object-contain"
          />

          {/* Left arrow */}
          {current > 0 && (
            <button
              onClick={() => setCurrent((i) => i - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ‹
            </button>
          )}

          {/* Right arrow */}
          {current < images.length - 1 && (
            <button
              onClick={() => setCurrent((i) => i + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ›
            </button>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 py-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`size-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-outline/40 hover:bg-outline/70'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
