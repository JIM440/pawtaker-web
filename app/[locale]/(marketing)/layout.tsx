import type { Metadata } from 'next';
import { MarketingNavbar } from '@/components/marketing/Navbar';
import { MarketingFooter } from '@/components/marketing/Footer';

export const metadata: Metadata = {
  title: 'PawTaker — Community Pet Care',
  description:
    'Community-driven, points-based pet sitting. Earn and spend trust instead of money.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <MarketingNavbar />
      {children}
      <MarketingFooter />
    </div>
  );
}

