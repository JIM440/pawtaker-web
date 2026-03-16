import { getTranslations } from 'next-intl/server';

const mockTakers = [
  { nameKey: 'lena', petsKey: 'smallDogs', points: 420 },
  { nameKey: 'amir', petsKey: 'catsIndoor', points: 610 },
  { nameKey: 'chloe', petsKey: 'largeDogs', points: 980 },
  { nameKey: 'marc', petsKey: 'mixed', points: 300 },
];

export async function TakersPreview() {
  const t = await getTranslations('marketing.takers');

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {t('heading')}
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-500 sm:text-base">
              {t('subtitle')}
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2">
          {mockTakers.map((taker) => (
            <article
              key={taker.nameKey}
              className="min-w-[220px] rounded-xl border border-[#837377]/20 bg-[#f5f0f0] p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8c4a60]/10 text-sm font-semibold text-[#8c4a60]">
                  {t('initials', { name: t(`cards.${taker.nameKey}.name`) })}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {t(`cards.${taker.nameKey}.name`)}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {t(`cards.${taker.nameKey}.pets`)}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-[#74565f]/10 px-2 py-0.5 text-[11px] font-semibold text-[#74565f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#74565f]" />
                  {t('verifiedBadge')}
                </span>
                <span className="text-slate-500">
                  {t('points', { value: taker.points })}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
