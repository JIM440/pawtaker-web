import type { ComponentType } from 'react';
import { BadgeCheck, HandHeart, Heart, History, ShieldCheck, Users } from 'lucide-react';

export default function AboutPage() {
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
              Connecting Pet Lovers Everywhere
            </h1>
            <p className="max-w-2xl text-lg text-white/90">
              Because every pet deserves a village of love and care, no matter where life
              takes you.
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
              Our Narrative
            </span>
          </div>
          <h2 className="text-3xl font-black text-slate-900 lg:text-4xl">Our Story</h2>
          <div className="space-y-4 text-lg leading-relaxed text-slate-600">
            <p>
              It all started with a simple realisation: every pet deserves a village. We
              founded PawTaker to bridge the gap between busy pet parents and passionate
              animal lovers.
            </p>
            <p>
              The idea was born when our founder, struggling to find reliable care for her
              rescue pup during an emergency, realised that her neighbours were eager to
              help but lacked a platform to connect safely and reliably.
            </p>
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
            Our Mission: Accessible Care
          </h2>
          <p className="text-lg text-slate-600">
            We&apos;re making quality pet care accessible through our unique Community
            Points system. By helping others in the community, you earn credits that can
            be used for your own pet&apos;s care.
          </p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <MissionCard
            icon={HandHeart}
            title="Give Love"
            body="Provide walks, feeding, or sitting for pets in your neighbourhood."
          />
          <MissionCard
            icon={Users}
            title="Earn Points"
            body="Accumulate points for every minute you spend caring for furry friends."
          />
          <MissionCard
            icon={Heart}
            title="Receive Care"
            body="Redeem points when you need someone to look after your own pet."
          />
        </div>
      </section>

      {/* Values */}
      <section className="mb-20">
        <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">
          The Values We Live By
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          <ValueCard
            icon={BadgeCheck}
            title="Uncompromising Safety"
            body="Every member undergoes thorough checks and identity verification because peace of mind is priceless."
          />
          <ValueCard
            icon={Users}
            title="Mutual Trust"
            body="Our community is built on transparency, honest reviews, and the shared responsibility of caring for each other's companions."
          />
          <ValueCard
            icon={ShieldCheck}
            title="Deep Love for Animals"
            body="Beyond just logic, we are driven by the connection between humans and their animals. We lead with heart."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="mb-16 border-t border-primary/10 py-10 text-center">
        <h2 className="mb-4 text-3xl font-bold text-slate-900">
          Ready to find your village?
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-slate-600">
          Join pet owners who are swapping stories, walks, and care in our growing
          community.
        </p>
        <div className="flex justify-center gap-4">
          <button className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white hover:shadow-lg">
            Get Started Today
          </button>
          <button className="rounded-lg border border-slate-300 px-8 py-3 text-sm font-bold hover:bg-slate-50">
            Browse Services
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

