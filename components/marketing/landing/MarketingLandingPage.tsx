import { LandingHero } from '@/components/marketing/landing/LandingHero';
import { LandingCareGap } from '@/components/marketing/landing/LandingCareGap';
import { LandingWhyPawtaker } from '@/components/marketing/landing/LandingWhyPawtaker';
import { LandingCtaBand } from '@/components/marketing/landing/LandingCtaBand';

export function MarketingLandingPage() {
  return (
    <main className="w-full overflow-x-clip">
      <LandingHero />
      <LandingCareGap />
      <LandingWhyPawtaker />
      <LandingCtaBand />
    </main>
  );
}
