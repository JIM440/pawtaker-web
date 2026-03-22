'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('marketing.hero');

  // These remote images are used to match the provided landing/hero visual style.
  const featureImg1 =
    'https://cdn.dribbble.com/userupload/45443224/file/adfd3fc092d594ffd500d30f0657f8b5.png?resize=1504x1128&vertical=center';
  const featureImg2 =
    'https://cdn.dribbble.com/userupload/45443227/file/2f78ac04b725b7e223f7eafd5c80b28e.png?resize=1504x1128&vertical=center';
  const featureImg3 =
    'https://cdn.dribbble.com/userupload/40676171/file/original-04898716137bc190882ef796b3b7c491.png?resize=1504x1128&vertical=center';

  return (
    <section id="download" className="bg-[#f3dbe0] px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-white/40 px-6 py-10 sm:px-10 sm:py-14">
          <div className="pointer-events-none absolute right-[-140px] top-[-160px] h-[340px] w-[340px] rounded-full bg-[#8c4a60]/15 blur-2xl" />
          <div className="pointer-events-none absolute left-[-160px] bottom-[-200px] h-[380px] w-[380px] rounded-full bg-[#74565f]/10 blur-2xl" />

          <div className="relative flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 lg:max-w-[520px]">
              <p className="mb-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#8c4a60]">
                {t('badge')}
              </p>

              <h1 className="font-wobblite text-4xl font-black leading-[1.05] tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {t('title')}
              </h1>

              <p className="mt-4 max-w-[420px] text-base text-[#665459]">
                {t('subtitle')}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8c4a60] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#8c4a60]/20 hover:bg-[#7a3f53] transition-colors"
                >
                  {t('primaryCta')}
                </Link>
                <Link
                  href="#download"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[#74565f] bg-white px-6 py-3 text-sm font-semibold text-[#8c4a60] hover:bg-[#fff8f8] transition-colors"
                >
                  {t('secondaryCta')}
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl font-black text-[#22191c]">{t('stats.product')}</div>
                  <div className="mt-1 text-xs font-semibold text-[#665459]">
                    {t('stats.productLabel')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#22191c]">{t('stats.seller')}</div>
                  <div className="mt-1 text-xs font-semibold text-[#665459]">
                    {t('stats.sellerLabel')}
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-black text-[#22191c]">{t('stats.review')}</div>
                  <div className="mt-1 text-xs font-semibold text-[#665459]">
                    {t('stats.reviewLabel')}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-500">{t('storeNote')}</p>
            </div>

            <div className="relative flex-1 lg:min-h-[520px]">
              {/* Floating cards */}
              <div className="absolute left-0 top-12 w-[230px] overflow-hidden rounded-[24px] border border-[#837377]/20 bg-white/70 shadow-xl shadow-[#8c4a60]/10 backdrop-blur">
                <img
                  src={featureImg1}
                  alt={t('alt.feature1')}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="absolute left-[130px] top-0 w-[255px] overflow-hidden rounded-[30px] border border-[#837377]/20 bg-[#8c4a60]/5 p-2 shadow-xl shadow-[#8c4a60]/10 backdrop-blur">
                <img
                  src={featureImg2}
                  alt={t('alt.feature2')}
                  className="h-full w-full object-cover rounded-[24px]"
                />
              </div>

              {/* Phone mock */}
              <div className="absolute right-0 top-6 flex aspect-[9/16] w-[280px] flex-col rounded-[36px] border border-[#837377]/20 bg-white p-4 shadow-2xl shadow-[#8c4a60]/15">
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-4">
                  <span>{t('previewLabel')}</span>
                  <span className="rounded-full bg-[#8c4a60]/10 px-2 py-0.5 text-[10px] font-medium text-[#8c4a60]">
                    {t('previewBadge')}
                  </span>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-[28px] border border-[#837377]/20 bg-[#f5f0f0]">
                  <img
                    src={featureImg3}
                    alt={t('alt.appPreview')}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
