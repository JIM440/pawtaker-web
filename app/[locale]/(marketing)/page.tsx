import type { ComponentType } from 'react';
import { getTranslations } from 'next-intl/server';
import { BadgeCheck, HandHeart, Heart, Stars, Users, Zap } from 'lucide-react';

export default async function LandingPage() {
  const t = await getTranslations('marketing.landing');

  return (
    <main className="flex flex-col items-center">
      {/* Hero */}
      <section className="w-full max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col items-center gap-8 py-12 md:py-20 lg:flex-row">
          <div className="flex flex-col gap-6 lg:w-1/2">
            <div className="flex flex-col gap-4 text-left">
              <span className="w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
                {t('badge')}
              </span>
              <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-6xl">
                {t('title')}
              </h1>
              <p className="max-w-[520px] text-lg font-normal leading-relaxed text-slate-600 md:text-xl">
                {t('subtitle')}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button className="flex h-14 min-w-[200px] cursor-pointer items-center justify-center rounded-xl bg-primary px-8 text-lg font-bold text-white shadow-xl shadow-primary/25 transition-all hover:translate-y-[-2px]">
                <span>{t('primaryCta')}</span>
              </button>
              <button className="flex h-14 min-w-[160px] cursor-pointer items-center justify-center rounded-xl border-2 border-primary/20 px-8 text-lg font-bold text-primary transition-all hover:bg-primary/5">
                <span>{t('secondaryCta')}</span>
              </button>
            </div>
          </div>
          <div
            className="aspect-4/3 w-full rounded-3xl border-8 border-white bg-slate-200 bg-cover bg-center bg-no-repeat shadow-2xl lg:w-1/2"
            aria-label={t('heroImageAriaLabel')}
          />
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="w-full bg-primary/5 py-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-8 px-6 md:grid-cols-3 md:px-10">
          <Stat icon={Users} label={t('stats.activeMembers')} value="12,000+" />
          <Stat icon={Heart} label={t('stats.pets')} value="45,000+" />
          <Stat icon={Stars} label={t('stats.points')} value="1.2M+" />
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="w-full max-w-[1200px] px-6 py-20 md:px-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="max-w-[720px] text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
            {t('benefits.heading')}
          </h2>
          <p className="max-w-[600px] text-lg text-slate-600">
            {t('benefits.subtitle')}
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <BenefitCard
            icon={BadgeCheck}
            title={t('benefits.cards.trust.title')}
            body={t('benefits.cards.trust.body')}
          />
          <BenefitCard
            icon={Zap}
            title={t('benefits.cards.simplicity.title')}
            body={t('benefits.cards.simplicity.body')}
          />
          <BenefitCard
            icon={HandHeart}
            title={t('benefits.cards.petFirst.title')}
            body={t('benefits.cards.petFirst.body')}
          />
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-[1100px] px-6 py-20">
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[3rem] bg-primary px-8 py-16 text-center md:py-24">
          <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-3xl" />
          <h2 className="relative z-10 max-w-[800px] text-4xl font-black tracking-tight text-white md:text-6xl">
            {t('cta.heading')}
          </h2>
          <p className="relative z-10 max-w-[600px] text-xl text-white/90">
            {t('cta.subtitle')}
          </p>
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row">
            <button className="flex h-14 min-w-[220px] cursor-pointer items-center justify-center rounded-full bg-white px-10 text-lg font-black text-primary shadow-2xl transition-all hover:bg-slate-50">
              <span>{t('cta.primary')}</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

function Stat({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/10 bg-white p-8 text-center shadow-sm">
      <Icon className="h-10 w-10 text-primary" aria-hidden />
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-4xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function BenefitCard({
  icon,
  title,
  body,
}: {
  icon: Icon;
  title: string;
  body: string;
}) {
  const Icon = icon;
  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-10 shadow-sm transition-shadow hover:shadow-xl">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Icon className="h-7 w-7" aria-hidden />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        <p className="leading-relaxed text-slate-600">{body}</p>
      </div>
    </div>
  );
}

