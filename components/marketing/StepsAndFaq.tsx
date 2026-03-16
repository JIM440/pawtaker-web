import { getTranslations } from 'next-intl/server';

export async function StepsSection() {
  const t = await getTranslations('marketing.how.steps');

  const steps = [
    { key: 'join', number: '01' },
    { key: 'postOrTake', number: '02' },
    { key: 'earnPoints', number: '03' },
    { key: 'peaceOfMind', number: '04' },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="mb-3 text-3xl font-bold text-slate-900 sm:text-4xl">
        {t('heading')}
      </h1>
      <p className="mb-10 text-sm text-slate-500 sm:text-base">{t('subtitle')}</p>
      <div className="space-y-8">
        {steps.map((step) => (
          <div key={step.key} className="flex items-start gap-5">
            <span className="mt-0.5 w-10 shrink-0 text-2xl font-bold text-[#8c4a60]">
              {step.number}
            </span>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {t(`${step.key}.title`)}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {t(`${step.key}.body`)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export async function FaqSection() {
  const t = await getTranslations('marketing.how.faq');

  const items = ['kyc', 'points', 'emergencies'] as const;

  return (
    <section className="bg-[#f5f0f0] py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t('heading')}
        </h2>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          {t('subtitle')}
        </p>
        <div className="mt-8 space-y-4">
          {items.map((id) => (
            <details
              key={id}
              className="group rounded-lg border border-[#837377]/20 bg-white p-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-slate-900">
                <span>{t(`${id}.question`)}</span>
                <span className="text-slate-400 transition group-open:rotate-90">
                  ›
                </span>
              </summary>
              <p className="mt-2 text-sm text-slate-500">
                {t(`${id}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
