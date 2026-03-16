import type { ComponentType } from 'react';
import { BadgeCheck, Coins, HeartHandshake, ShieldCheck, Users } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <main className="grow">
      {/* Hero */}
      <section className="bg-linear-to-b from-primary/5 to-transparent px-6 py-16 md:px-16 lg:px-32 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            How <span className="text-primary">PawTaker</span> Works
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Join our trusted community of pet lovers. We&apos;ve simplified pet care
            through a points-based exchange system that rewards your love for animals.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 py-12 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <Step
            step="STEP 01"
            icon={BadgeCheck}
            title="Sign up & Verify (KYC)"
            body="Create your personal profile and complete our secure identity check. We prioritise safety by ensuring every member of our community is verified through a standard KYC process."
          />
          <Step
            step="STEP 02"
            icon={Coins}
            title="Earn Points by Sitting"
            body="Ready to hang out with some furry friends? Browse local requests and offer your pet-sitting services. For every hour you spend caring for a pet, you accumulate PawPoints in your wallet."
          />
          <Step
            step="STEP 03"
            icon={HeartHandshake}
            title="Spend Points for Care"
            body="Planning a trip or need a helping hand? Use your earned PawPoints to book trusted sitters from the community. It&apos;s a cashless exchange built on mutual support and a shared love for pets."
          />
          <Step
            step="STEP 04"
            icon={BadgeCheck}
            title="Rate & Review"
            body="After every sitting session, share your experience. High ratings help members build trust, ensuring the PawTaker community remains a safe and high-quality environment for all our pets."
          />
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-slate-100 px-6 py-16 md:px-16 lg:px-32">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
            Why the Community Loves PawTaker
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Benefit
              icon={ShieldCheck}
              title="Secure & Trusted"
              body="Mandatory KYC verification for every single member of our ecosystem."
            />
            <Benefit
              icon={Coins}
              title="Zero Cash Cost"
              body="Forget expensive boarding fees. Exchange time and care instead of money."
            />
            <Benefit
              icon={Users}
              title="Pure Community"
              body="Built by passionate pet owners who understand exactly what your pet needs."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-16 lg:px-32">
        <div className="relative mx-auto max-w-3xl rounded-3xl bg-primary p-10 text-center text-white shadow-2xl">
          <h2 className="mb-4 text-3xl font-black md:text-4xl">
            Ready to join the pack?
          </h2>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/90">
            Join thousands of pet lovers today. Sign up and get your first 5 PawPoints
            free to start your journey.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button className="rounded-xl bg-white px-10 py-3 text-lg font-bold text-primary shadow-md hover:bg-slate-100">
              Get Started Now
            </button>
            <button className="rounded-xl border border-white/50 bg-primary/20 px-10 py-3 text-lg font-bold text-white hover:bg-primary/30">
              View Demo
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
            {step}
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


