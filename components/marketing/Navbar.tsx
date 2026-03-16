'use client';

import { Link, usePathname } from '@/lib/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

const navLinks = [
  { href: '/', key: 'nav.about', labelKey: 'about' as const, anchor: '#about' },
  { href: '/how-it-works', key: 'nav.howItWorks', labelKey: 'howItWorks' as const },
  { href: '/about', key: 'nav.story', labelKey: 'story' as const },
];

export function MarketingNavbar() {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('marketing');

  return (
    <header className="border-b border-[#837377]/20 bg-white/80 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#8c4a60] text-white text-lg">
            🐾
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-bold text-[#8c4a60]">PawTaker</span>
            <span className="text-[11px] font-medium text-slate-500">
              {t('nav.tagline')}
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-slate-500 md:flex">
          {navLinks.map((item) => {
            const href = item.anchor ? `${item.href}${item.anchor}` : item.href;

            return (
              <Link
                key={item.key}
                href={href}
                className="transition-colors hover:text-[#8c4a60]"
              >
                {t(`nav.${item.labelKey}`)}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1 rounded-full border border-[#837377]/25 bg-white px-1 py-1">
            <Link
              href={pathname}
              locale="en"
              className={`px-2 py-1 text-[11px] font-bold rounded-full transition-colors ${
                locale === 'en' ? 'bg-[#8c4a60] text-white' : 'text-slate-600 hover:text-[#8c4a60]'
              }`}
              aria-label="Switch language to English"
            >
              EN
            </Link>
            <Link
              href={pathname}
              locale="fr"
              className={`px-2 py-1 text-[11px] font-bold rounded-full transition-colors ${
                locale === 'fr' ? 'bg-[#8c4a60] text-white' : 'text-slate-600 hover:text-[#8c4a60]'
              }`}
              aria-label="Switch language to French"
            >
              FR
            </Link>
          </div>
          <Link
            href="#download"
            className="hidden rounded-full bg-[#8c4a60] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#7a3f53] md:inline-flex"
          >
            {t('nav.download')}
          </Link>
        </div>
      </nav>
    </header>
  );
}
