'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('marketing.hero');

  return (
    <section className="bg-gradient-to-b from-[#f5f0f0] to-white px-4 py-16 sm:py-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 md:flex-row md:items-start">
        <div className="flex-1 text-center md:text-left">
          <p className="mb-3 inline-flex rounded-full bg-[#8c4a60]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8c4a60]">
            {t('badge')}
          </p>
          <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            {t('title')}
          </h1>
          <p className="mb-8 max-w-xl text-base text-slate-500 sm:text-lg">
            {t('subtitle')}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#download"
              className="inline-flex items-center justify-center rounded-full bg-[#8c4a60] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#8c4a60]/30 hover:bg-[#7a3f53]"
            >
              {t('primaryCta')}
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center rounded-full border border-[#74565f] px-6 py-3 text-sm font-semibold text-[#8c4a60] hover:bg-[#f5f0f0]"
            >
              {t('secondaryCta')}
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-400">{t('storeNote')}</p>
        </div>

        <div className="flex-1">
          <div className="mx-auto aspect-[9/16] max-w-xs rounded-[32px] border border-[#837377]/20 bg-white p-4 shadow-xl shadow-[#8c4a60]/10">
            <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
              <span>{t('previewLabel')}</span>
              <span className="rounded-full bg-[#8c4a60]/10 px-2 py-0.5 text-[10px] font-medium text-[#8c4a60]">
                {t('previewBadge')}
              </span>
            </div>
            <div className="space-y-3 text-xs">
              <div className="rounded-2xl bg-[#8c4a60] p-3 text-white">
                <p className="text-[11px] uppercase tracking-wide text-white/70">
                  {t('cardActiveCare.label')}
                </p>
                <p className="mt-1 text-sm font-semibold">{t('cardActiveCare.title')}</p>
                <p className="mt-1 text-[11px] text-white/80">{t('cardActiveCare.meta')}</p>
              </div>
              <div className="rounded-2xl border border-[#837377]/20 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  {t('cardCheckins.title')}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{t('cardCheckins.caption')}</p>
              </div>
              <div className="rounded-2xl border border-[#837377]/20 p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  {t('cardMessages.title')}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{t('cardMessages.caption')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
