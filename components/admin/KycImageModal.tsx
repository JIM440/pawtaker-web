'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';

interface KycImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function KycImageModal({ images, initialIndex, onClose }: KycImageModalProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);

  const clampZoom = (z: number) => Math.max(1, Math.min(3, z));
  const zoomIn = () => setZoom((z) => clampZoom(z + 0.25));
  const zoomOut = () => setZoom((z) => clampZoom(z - 0.25));
  const resetZoom = () => setZoom(1);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        setZoom(1);
        setCurrent((i) => Math.max(0, i - 1));
      }
      if (e.key === 'ArrowRight') {
        setZoom(1);
        setCurrent((i) => Math.min(images.length - 1, i + 1));
      }

      // Zoom controls
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') resetZoom();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [images.length, onClose, zoomIn, zoomOut, resetZoom]);

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/75 backdrop-blur-[1px] px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <span className="text-sm font-medium text-slate-700">
            {current + 1} / {images.length}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={zoomOut}
              className="size-8 flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="size-8 flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="size-8 flex items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={onClose}
              className="size-8 flex items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="relative bg-black h-[70vh] max-h-[85vh] min-h-[450px] flex items-center justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[current]}
            alt={`Document ${current + 1}`}
            className="max-h-full max-w-full object-contain transition-transform duration-150 ease-out will-change-transform"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'center center',
            }}
          />

          {/* Left arrow */}
          {current > 0 && (
            <button
              onClick={() => {
                setZoom(1);
                setCurrent((i) => i - 1);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {/* Right arrow */}
          {current < images.length - 1 && (
            <button
              onClick={() => {
                setZoom(1);
                setCurrent((i) => i + 1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {/* Dots (overlay on the image, bottom center) */}
          <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setZoom(1);
                  setCurrent(i);
                }}
                aria-label={`Show image ${i + 1}`}
                className={`size-2 rounded-full transition-colors ${
                  i === current ? 'bg-primary' : 'bg-white/75 hover:bg-white/95'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
