'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from '@/lib/i18n/navigation';

/** Same routes as `app/[locale]/admin/layout.tsx` — longest match wins. */
const ADMIN_TITLES: Record<string, string> = {
  '/admin/dashboard': 'dashboard',
  '/admin/users': 'users',
  '/admin/kyc': 'kyc',
  '/admin/requests': 'requests',
  '/admin/reports': 'reports',
  '/admin/settings': 'settings',
  '/admin/profile': 'profile',
  '/admin/pets': 'pets',
  '/admin/reviews': 'reviews',
  '/admin/blocks': 'blocks',
  '/admin/blogs': 'blogs',
  '/admin/contact': 'contact',
};

function resolveNavKey(path: string): string {
  const entries = Object.entries(ADMIN_TITLES).sort((a, b) => b[0].length - a[0].length);
  const hit = entries.find(
    ([route]) => path === route || path.startsWith(`${route}/`),
  );
  return hit?.[1] ?? 'dashboard';
}

export default function AdminPageHeading() {
  const pathname = usePathname() ?? '';
  const tNav = useTranslations('admin.nav');
  const key = resolveNavKey(pathname);
  return (
    <h1 className="text-lg font-bold tracking-tight text-on-surface md:text-xl">{tNav(key)}</h1>
  );
}
