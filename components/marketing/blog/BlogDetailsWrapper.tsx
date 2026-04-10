'use client';

import { useEffect } from 'react';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export function BlogDetailsWrapper({ children }: { children: React.ReactNode }) {
  // Scroll to top immediately when component mounts
  useScrollToTop();
  
  // Also scroll immediately on mount for extra reliability
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return <>{children}</>;
}
