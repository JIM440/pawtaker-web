'use client';

import { useEffect } from 'react';

export function useScrollToTop() {
  useEffect(() => {
    // Scroll to top immediately when component mounts
    // Use timeout to ensure it works after page content is rendered
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 100);

    return () => clearTimeout(timer);
  }, []);
}
