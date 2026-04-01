import { LandingHero } from '@/components/marketing/landing/LandingHero';
import { LandingCareGap } from '@/components/marketing/landing/LandingCareGap';
import { LandingWhyPawtaker } from '@/components/marketing/landing/LandingWhyPawtaker';
import { LandingCtaBand } from '@/components/marketing/landing/LandingCtaBand';
import { SectionReveal } from '@/components/marketing/landing/SectionReveal';

export function MarketingLandingPage() {
  return (
    <main className="w-full overflow-x-clip">
      <SectionReveal>
        <LandingHero />
      </SectionReveal>
      <SectionReveal delayMs={70}>
        <LandingCareGap />
      </SectionReveal>
      <SectionReveal delayMs={120}>
        <LandingWhyPawtaker />
      </SectionReveal>
      <SectionReveal delayMs={170}>
        <LandingCtaBand />
      </SectionReveal>
    </main>
  );
}
