'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from '@/lib/i18n/navigation';
import type { Locale } from '@/lib/i18n/config';
import { defaultLocale } from '@/lib/i18n/config';
import { getLocaleFromCookie } from '@/lib/i18n/localeCookie';
import { getStoredLocale, setStoredLocale } from '@/lib/i18n/localeStorage';
import { persistLocalePreference } from '@/lib/i18n/persistLocalePreference';

interface LocaleSyncProps {
  currentLocale: Locale;
}

/**
 * Persists language across visits:
 * - `setStoredLocale` also sets the `NEXT_LOCALE` cookie (next-intl middleware reads it).
 * - If the URL is the default locale but localStorage/cookie says otherwise, redirect after
 *   mount (client-only) so SSR still matches the first request — no hydration mismatch.
 * - If the URL is explicitly non-default (e.g. /fr/...), the URL wins and storage is updated.
 */
export default function LocaleSync({ currentLocale }: LocaleSyncProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let stored = getStoredLocale();

    if (!stored) {
      const fromCookie = getLocaleFromCookie();
      if (fromCookie) {
        setStoredLocale(fromCookie);
        void persistLocalePreference(fromCookie);
        stored = fromCookie;
      } else {
        setStoredLocale(currentLocale);
        void persistLocalePreference(currentLocale);
        return;
      }
    }

    if (stored === currentLocale) {
      void persistLocalePreference(currentLocale);
      return;
    }

    // Bookmark / shared link with a locale prefix → follow URL.
    if (currentLocale !== defaultLocale) {
      setStoredLocale(currentLocale);
      void persistLocalePreference(currentLocale);
      return;
    }

    // Default-locale URL (often unprefixed) but user chose another language → apply preference.
    router.replace(pathname, { locale: stored });
  }, [currentLocale, pathname, router]);

  return null;
}
