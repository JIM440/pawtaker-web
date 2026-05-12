'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

interface SectionRevealProps {
  children: ReactNode;
  delayMs?: number;
}

export function SectionReveal({ children, delayMs = 0 }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          // Defer one tick so initial hidden state paints before reveal transition.
          window.setTimeout(() => setVisible(true), 40);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 20% 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      className={`reveal-on-scroll ${visible ? 'is-visible' : ''}`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </div>
  );
}
