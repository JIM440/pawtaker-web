'use client';

import { useEffect } from 'react';
import type { Locale } from '@/lib/i18n/config';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import { getStoredLocale } from '@/lib/i18n/localeStorage';

interface LocaleSyncProps {
  currentLocale: Locale;
}

/**
 * Ensures the marketing pages render in the language chosen in localStorage.
 * If the stored locale differs from the URL `[locale]` segment, we navigate.
 */
export default function LocaleSync({ currentLocale }: LocaleSyncProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedLocale = getStoredLocale();
    if (!storedLocale) return;
    if (storedLocale === currentLocale) return;

    router.push(pathname, { locale: storedLocale });
  }, [currentLocale, pathname, router]);

  return null;
}

