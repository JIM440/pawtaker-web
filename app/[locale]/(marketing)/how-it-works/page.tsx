import type { ComponentType } from 'react';
import { BadgeCheck, Coins, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function HowItWorksPage() {
  const tSteps = await getTranslations('marketing.how.steps');
  const tFaq = await getTranslations('marketing.how.faq');

  return (
    <main className="grow">
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 to-transparent px-6 py-16 md:px-16 lg:px-32 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            {tSteps('heading')}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {tSteps('subtitle')}
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-12 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <Step
            step="01"
            icon={BadgeCheck}
            title={tSteps('join.title')}
            body={tSteps('join.body')}
          />
          <Step
            step="02"
            icon={Coins}
            title={tSteps('postOrTake.title')}
            body={tSteps('postOrTake.body')}
          />
          <Step
            step="03"
            icon={HeartHandshake}
            title={tSteps('earnPoints.title')}
            body={tSteps('earnPoints.body')}
          />
          <Step
            step="04"
            icon={BadgeCheck}
            title={tSteps('peaceOfMind.title')}
            body={tSteps('peaceOfMind.body')}
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-100 px-6 py-16 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            {tFaq('heading')}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Benefit
              icon={ShieldCheck}
              title={tFaq('kyc.question')}
              body={tFaq('kyc.answer')}
            />
            <Benefit
              icon={Coins}
              title={tFaq('points.question')}
              body={tFaq('points.answer')}
            />
            <Benefit
              icon={Users}
              title={tFaq('emergencies.question')}
              body={tFaq('emergencies.answer')}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-16 lg:px-32">
        <div className="relative mx-auto max-w-3xl rounded-3xl bg-primary p-10 text-center text-white shadow-2xl">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">
            {tFaq('cta.heading')}
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/90">
            {tFaq('cta.subtitle')}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-10 py-3 text-lg font-bold text-primary shadow-md hover:bg-slate-100">
              {tFaq('cta.primary')}
            </button>
            <button className="rounded-xl border border-white/50 bg-primary/20 px-10 py-3 text-lg font-bold text-white hover:bg-primary/30">
              {tFaq('cta.secondary')}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

type StepProps = {
  step: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  body: string;
};

function Step({ step, icon, title, body }: StepProps) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-primary/10 bg-white p-8 shadow-sm md:flex-row md:items-center">
      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-10 w-10" aria-hidden />
      </div>
      <div className="flex-1 text-center md:text-left">
        <div className="mb-2 flex items-center justify-center gap-3 md:justify-start">
          <span className="rounded bg-primary px-2 py-1 text-xs font-bold text-white">
            STEP {step}
          </span>
          <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
        </div>
        <p className="text-lg leading-relaxed text-slate-600">{body}</p>
      </div>
    </div>
  );
}

type BenefitProps = {
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  title: string;
  body: string;
};

function Benefit({ icon, title, body }: BenefitProps) {
  const Icon = icon;
  return (
    <div className="flex flex-col items-center rounded-xl border border-primary/10 bg-white p-8 text-center shadow-sm">
      <Icon className="mb-4 h-10 w-10 text-primary" aria-hidden />
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-sm text-slate-600">{body}</p>
    </div>
  );
}


