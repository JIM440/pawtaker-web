'use client';

import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Flag,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PawPrint,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from './ConfirmationModal';

interface AdminSidebarProps {
  pathname: string;
  locale: string;
  adminEmail: string;
}

const navItems = [
  { href: '/admin/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/admin/kyc', labelKey: 'kyc', icon: ShieldCheck },
  { href: '/admin/requests', labelKey: 'requests', icon: PawPrint },
  { href: '/admin/users', labelKey: 'users', icon: Users },
  { href: '/admin/pets', labelKey: 'pets', icon: PawPrint },
  { href: '/admin/reports', labelKey: 'reports', icon: Flag },
  { href: '/admin/reviews', labelKey: 'reviews', icon: Star },
  { href: '/admin/contact', labelKey: 'contact', icon: Mail },
] satisfies { href: string; labelKey: string; icon: LucideIcon }[];

export default function AdminSidebar({ pathname, locale, adminEmail }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const router = useRouter();
  const tNav = useTranslations('admin.nav');
  const tSidebar = useTranslations('admin.sidebar');

  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || pathname;

  const handleSignOut = async () => {
    setSignOutOpen(false);
    setIsMobileOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  };

  const sidebarContent = (
    <aside className="flex h-full w-64 flex-col bg-primary text-on-primary">
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
        <div className="size-10 shrink-0 rounded-full bg-white/20 flex items-center justify-center">
          <PawPrint className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <span className="block text-xl font-bold">{tSidebar('brand')}</span>
          <span className="mt-0.5 block text-xs text-white/70">{tSidebar('brandSub')}</span>
          <span className="mt-1 block text-[11px] text-white/60 truncate">{adminEmail}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathWithoutLocale === item.href || pathWithoutLocale.startsWith(item.href + '/');
          return (
            <a
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>{tNav(item.labelKey)}</span>
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setSignOutOpen(true)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-white/10 px-6 py-4 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10"
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        Sign out
      </button>
    </aside>
  );

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg bg-white text-on-surface shadow-md md:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="hidden shrink-0 md:flex">{sidebarContent}</div>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileOpen(false)} />
          <div className="relative flex h-full w-64 flex-col">{sidebarContent}</div>
        </div>
      )}

      <ConfirmationModal
        isOpen={signOutOpen}
        title="Sign out?"
        description="You will be returned to the login screen."
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
    </>
  );
}
