import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PawTaker — Community Pet Care',
  description: 'Connect with trusted pet sitters in your neighbourhood. Points-based, no money.',
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-frame-stroke px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <a href="/" className="text-xl font-bold text-primary">PawTaker</a>
        <div className="flex items-center gap-6">
          <a href="/how-it-works" className="text-on-surface/80 hover:text-primary text-sm">How It Works</a>
          <a href="/about" className="text-on-surface/80 hover:text-primary text-sm">About</a>
          <a href="/terms" className="text-on-surface/80 hover:text-primary text-sm">Terms of Service</a>
          <a href="/privacy" className="text-on-surface/80 hover:text-primary text-sm">Privacy Policy</a>
          <a href="/admin/login" className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">Admin</a>
        </div>
      </nav>
      {children}
      <footer className="border-t border-frame-stroke px-6 py-8 text-center text-on-surface/70 text-sm">
        <p className="font-medium text-primary mb-1">PawTaker</p>
        <p className="mb-2">Community pet care for everyone. © {new Date().getFullYear()} All rights reserved.</p>
        <p className="flex items-center justify-center gap-4 flex-wrap">
          <a href="/terms" className="hover:text-primary">Terms of Service</a>
          <span>·</span>
          <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}
