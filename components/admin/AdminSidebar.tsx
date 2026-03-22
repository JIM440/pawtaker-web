'use client';

import { useState } from 'react';
import Image from 'next/image';
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
    <aside className="flex h-full w-64 flex-col border-r border-white/20 bg-primary text-white">
      <div className="flex items-center gap-3 border-b border-white/20 px-6 py-6">
        <Image
          src="/logos/logomark-electric-pear.png"
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0"
          priority
        />
        <div className="min-w-0">
          <span className="block text-xl font-bold tracking-tight text-white">{tSidebar('brand')}</span>
          <span className="mt-0.5 block text-xs text-white/90">{tSidebar('brandSub')}</span>
          <span className="mt-1 block truncate text-[11px] text-white/60">{adminEmail}</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathWithoutLocale === item.href || pathWithoutLocale.startsWith(item.href + '/');
          return (
            <a
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white hover:bg-white/15 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{tNav(item.labelKey)}</span>
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => setSignOutOpen(true)}
        className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-white/20 px-6 py-4 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
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
        className="fixed left-4 top-4 z-50 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-on-surface shadow-md md:hidden"
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
