import { Apple, Smartphone } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function AppPreview() {
  const t = await getTranslations('marketing.appPreview');

  return (
    <section id="app-download" className="bg-[#f5f0f0] py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {t('heading')}
          </h2>
          <p className="mt-3 max-w-md text-sm text-slate-500 sm:text-base">
            {t('subtitle')}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8c4a60] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#8c4a60]/20 hover:bg-[#7a3f53]"
            >
              <Apple className="h-5 w-5 shrink-0" aria-hidden />
              {t('cta.ios')}
            </button>
            <button
              type="button"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#74565f] bg-white px-4 py-3 text-sm font-semibold text-[#8c4a60] hover:bg-[#f5f0f0]"
            >
              <Smartphone className="h-5 w-5 shrink-0" aria-hidden />
              {t('cta.android')}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-400">{t('storeNote')}</p>
        </div>

        <div className="flex-1">
          <div className="mx-auto aspect-9/16 max-w-xs rounded-[32px] border border-[#837377]/20 bg-white p-4 shadow-xl shadow-[#8c4a60]/10">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{t('phoneTabs.home')}</span>
              <span>{t('phoneTabs.myCare')}</span>
              <span className="font-semibold text-[#8c4a60]">
                {t('phoneTabs.messages')}
              </span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="rounded-lg border border-[#837377]/20 bg-[#f5f0f0] p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  {t('messages.owner')}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{t('messages.body')}</p>
              </div>
              <div className="rounded-lg border border-[#837377]/20 bg-[#f5f0f0] p-3">
                <p className="text-[11px] font-semibold text-slate-800">
                  {t('checkins.title')}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {t('checkins.body')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
