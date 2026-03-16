import { getTranslations } from 'next-intl/server';

export async function Features() {
  const t = await getTranslations('marketing.features');

  const items = [
    {
      key: 'zeroCost',
      icon: '💸',
      title: t('zeroCost.title'),
      body: t('zeroCost.body'),
    },
    {
      key: 'verified',
      icon: '🛡️',
      title: t('verified.title'),
      body: t('verified.body'),
    },
    {
      key: 'safety',
      icon: '📲',
      title: t('safety.title'),
      body: t('safety.body'),
    },
  ];

  return (
    <section className="bg-[#f5f0f0] py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
          {t('heading')}
        </h2>
        <p className="mt-3 text-center text-sm text-slate-500 sm:text-base">
          {t('subtitle')}
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article
              key={item.key}
              className="rounded-xl border border-[#837377]/20 bg-white p-6 shadow-sm"
            >
              <div className="mb-3 text-3xl">{item.icon}</div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
