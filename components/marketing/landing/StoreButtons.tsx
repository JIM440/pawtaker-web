'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { externalLinkProps, getAppStoreUrls } from '@/lib/app-store-urls';

/** 16px horizontal padding (`px-4`); filled iOS — max 340px width when not in a grid cell */
const filledClass =
  'inline-flex min-h-[48px] w-full max-w-[340px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#ffd9e2] px-4 py-3 text-sm font-medium leading-5 tracking-[-0.2px] text-[#703348] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/40';

const filledGridClass =
  'inline-flex min-h-[48px] w-full min-w-0 max-w-none shrink-0 items-center justify-center gap-2 rounded-full bg-[#ffd9e2] px-4 py-3 text-sm font-medium leading-5 tracking-[-0.2px] text-[#703348] transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/40';

const outlineOnPrimaryClass =
  'inline-flex min-h-[52px] w-full max-w-[340px] shrink-0 items-center justify-center gap-2 rounded-full border border-[#d5c2c6] border-solid bg-transparent px-4 py-3.5 text-sm font-medium leading-5 tracking-[-0.2px] text-[#e1e2c7] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/35';

const outlineGridClass =
  'inline-flex min-h-[52px] w-full min-w-0 max-w-none shrink-0 items-center justify-center gap-2 rounded-full border border-[#d5c2c6] border-solid bg-transparent px-4 py-3.5 text-sm font-medium leading-5 tracking-[-0.2px] text-[#e1e2c7] transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e1e2c7]/35';

export function StoreLinkIos({
  className,
  gridCell,
}: {
  className?: string;
  /** Hero / CTA grid: one button per row on narrow viewports; two columns from `sm` up */
  gridCell?: boolean;
}) {
  const t = useTranslations('marketing.landing');
  const { ios } = getAppStoreUrls();
  const base = gridCell ? filledGridClass : filledClass;
  return (
    <a href={ios} {...externalLinkProps(ios)} className={className ?? base}>
      <Image src="/images/ios-icon.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
      {t('storeIos')}
    </a>
  );
}

export function StoreLinkAndroidOnPrimary({
  className,
  gridCell,
}: {
  className?: string;
  gridCell?: boolean;
}) {
  const t = useTranslations('marketing.landing');
  const { android } = getAppStoreUrls();
  const base = gridCell ? outlineGridClass : outlineOnPrimaryClass;
  return (
    <a href={android} {...externalLinkProps(android)} className={className ?? base}>
      <Image src="/images/playstore-icon.svg" alt="" width={18} height={18} className="size-[18px] shrink-0" />
      {t('storeAndroid')}
    </a>
  );
}

export function LandingCtaStoreRow() {
  return (
    <div className="mx-auto grid w-full max-w-[688px] grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-2">
      <StoreLinkIos gridCell />
      <StoreLinkAndroidOnPrimary gridCell />
    </div>
  );
}
