import type { ComponentType } from 'react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Apple, BadgeCheck, HandHeart, Heart, PlayCircle, Stars, Users, Zap } from 'lucide-react';

import { externalLinkProps, getAppStoreUrls } from '@/lib/app-store-urls';

export default async function LandingPage() {
  const t = await getTranslations('marketing.landing');
  const { ios: iosUrl, android: androidUrl } = getAppStoreUrls();

  return (
    <main className="flex flex-col items-center">
      {/* Hero — min viewport height below fixed nav; content vertically centered */}
      <section className="mx-auto flex w-full max-w-[1300px] min-h-[calc(100vh-4rem)] flex-col justify-center px-6 md:px-10">
        <div className="flex flex-col items-center gap-8 py-8 lg:flex-row lg:items-center lg:gap-10 lg:py-0">
          {/* Mobile: text first, image second; desktop: text left, image right */}
          <div className="order-1 flex w-full flex-col items-center gap-6 text-center lg:w-1/2 lg:items-start lg:text-left">
            <div className="flex flex-col items-center gap-4 lg:items-start lg:text-left">
              <h1 className="font-wobblite text-4xl font-black leading-[1.1] tracking-tight text-primary md:text-6xl">
                {t('title')}
              </h1>
              <p className="max-w-[520px] text-lg font-normal leading-relaxed text-slate-600 md:text-xl">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-4 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              <a
                href={iosUrl}
                {...externalLinkProps(iosUrl)}
                className="inline-flex h-14 min-h-[56px] min-w-[200px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-transparent bg-primary-container px-4 text-base font-bold text-on-primary-container shadow-none transition-colors hover:bg-primary-container/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:flex-initial"
              >
                <Apple className="h-5 w-5 shrink-0" aria-hidden />
                <span>{t('cta.downloadIos')}</span>
              </a>
              <a
                href={androidUrl}
                {...externalLinkProps(androidUrl)}
                className="inline-flex h-14 min-h-[56px] min-w-[200px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-primary bg-transparent px-4 text-base font-bold text-primary shadow-none transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:flex-initial"
              >
                <PlayCircle className="h-5 w-5 shrink-0" aria-hidden />
                <span>{t('cta.downloadAndroid')}</span>
              </a>
            </div>
          </div>
          <div className="relative order-2 aspect-[282/328] w-full max-w-[min(100%,420px)] lg:max-w-none lg:w-1/2 lg:flex-1">
            <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-2xl shadow-primary/15 sm:min-h-[360px]">
              <Image
                src="/hero_img_1.svg"
                alt={t('heroImageAriaLabel')}
                fill
                priority
                className="object-contain object-center p-2 sm:p-4"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="w-full bg-primary/5 py-16">
        <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-8 px-6 md:grid-cols-3 md:px-10">
          <Stat icon={Users} label={t('stats.activeMembers')} value="12,000+" />
          <Stat icon={Heart} label={t('stats.pets')} value="45,000+" />
          <Stat icon={Stars} label={t('stats.points')} value="1.2M+" />
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="w-full max-w-[1300px] px-6 py-20 md:px-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-wobblite max-w-[720px] text-3xl font-black tracking-tight text-primary md:text-5xl">
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
      <section id="download" className="w-full max-w-[1300px] px-6 py-20">
        <div className="relative flex flex-col items-center gap-8 overflow-hidden rounded-[3rem] bg-primary px-8 py-16 text-center md:py-24">
          <div className="absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-black/10 blur-3xl" />
          <h2 className="font-wobblite relative z-10 max-w-[800px] text-4xl font-black tracking-tight text-white md:text-6xl">
            {t('cta.heading')}
          </h2>
          <p className="relative z-10 max-w-[600px] text-xl text-white/90">
            {t('cta.subtitle')}
          </p>
          <div className="relative z-10 flex w-full max-w-lg flex-col gap-4 sm:max-w-none sm:flex-row sm:justify-center">
            <a
              href={iosUrl}
              {...externalLinkProps(iosUrl)}
              className="inline-flex h-14 min-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-base font-black text-primary shadow-2xl transition-all hover:bg-slate-50 sm:flex-initial"
            >
              <Apple className="h-5 w-5 shrink-0" aria-hidden />
              <span>{t('cta.downloadIos')}</span>
            </a>
            <a
              href={androidUrl}
              {...externalLinkProps(androidUrl)}
              className="inline-flex h-14 min-w-[220px] flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 text-base font-black text-primary shadow-2xl transition-all hover:bg-slate-50 sm:flex-initial"
            >
              <PlayCircle className="h-5 w-5 shrink-0" aria-hidden />
              <span>{t('cta.downloadAndroid')}</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
type Icon = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;

function Stat({ icon: Icon, label, value }: { icon: Icon; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-3 p-8 text-center">
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


