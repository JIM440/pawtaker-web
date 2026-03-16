import type { ComponentType } from 'react';
import { BadgeCheck, HandHeart, Heart, History, ShieldCheck, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('marketing.about');

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 lg:px-16">
      {/* Hero */}
      <section className="mb-16">
        <div
          className="relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-xl bg-slate-200"
          aria-label="Happy dog and human in nature"
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <div className="relative z-10 p-8 lg:p-12">
            <h1 className="mb-4 text-4xl font-black leading-tight text-white lg:text-5xl">
              {t('heroTitle')}
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              {t('heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-20 grid items-center gap-10 md:grid-cols-2">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 text-primary">
            <History className="h-4 w-4" aria-hidden />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">
              {t('narrativeLabel')}
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 lg:text-4xl">
            {t('heading')}
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-slate-600">
            <p>{t('mission')}</p>
            <p>{t('pointsOverProfit')}</p>
          </div>
        </div>
        <div className="aspect-4/3 overflow-hidden rounded-xl border-2 border-primary/10 bg-primary/5">
          <div className="h-full w-full bg-cover bg-center" />
        </div>
      </section>

      {/* Mission & Points */}
      <section className="mb-20 rounded-2xl bg-primary/5 p-8 lg:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            {t('missionHeading')}
          </h2>
          <p className="text-lg text-slate-600">
            {t('missionBody')}
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <MissionCard
            icon={HandHeart}
            title={t('missionCards.give.title')}
            body={t('missionCards.give.body')}
          />
          <MissionCard
            icon={Users}
            title={t('missionCards.earn.title')}
            body={t('missionCards.earn.body')}
          />
          <MissionCard
            icon={Heart}
            title={t('missionCards.receive.title')}
            body={t('missionCards.receive.body')}
          />
        </div>
      </section>

      {/* Values */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
          {t('values.heading')}
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          <ValueCard
            icon={BadgeCheck}
            title={t('values.safety.title')}
            body={t('values.safety.body')}
          />
          <ValueCard
            icon={Users}
            title={t('values.trust.title')}
            body={t('values.trust.body')}
          />
          <ValueCard
            icon={ShieldCheck}
            title={t('values.love.title')}
            body={t('values.love.body')}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mb-16 border-t border-primary/10 py-10 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900">
          {t('cta.heading')}
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-slate-600">
          {t('cta.subtitle')}
        </p>
        <div className="flex justify-center gap-4">
          <button className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white hover:shadow-lg">
            {t('cta.primary')}
          </button>
          <button className="rounded-lg border border-slate-300 px-8 py-3 text-sm font-bold hover:bg-slate-50">
            {t('cta.secondary')}
          </button>
        </div>
      </section>
    </main>
  );
}

type CardProps = {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  body: string;
};

function MissionCard({ icon, title, body }: CardProps) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center rounded-xl border border-primary/10 bg-white p-8 text-center shadow-sm">
      <Icon className="mb-4 h-10 w-10 text-primary" aria-hidden />
      <h3 className="mb-2 text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{body}</p>
    </div>
  );
}

function ValueCard({ icon, title, body }: CardProps) {
  const Icon = icon;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
        <Icon className="h-6 w-6 text-white" aria-hidden />
      </div>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-600">{body}</p>
    </div>
  );
}

