'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  Flag,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  PawPrint,
  ShieldCheck,
  Star,
  UserX,
  Users,
  X,
} from 'lucide-react';
import { Link, usePathname, useRouter } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from './ConfirmationModal';

interface AdminSidebarProps {
  /** Initial path from the server; `usePathname()` is used on the client so active state stays correct after navigations. */
  pathname: string;
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
  { href: '/admin/blocks', labelKey: 'blocks', icon: UserX },
  { href: '/admin/blogs', labelKey: 'blogs', icon: FileText },
  { href: '/admin/contact', labelKey: 'contact', icon: Mail },
] satisfies { href: string; labelKey: string; icon: LucideIcon }[];

/** Longest href wins so overlapping prefixes (e.g. future `/admin` vs `/admin/users`) behave correctly. */
function getActiveNavHref(path: string, items: { href: string }[]): string | null {
  const sorted = [...items].sort((a, b) => b.href.length - a.href.length);
  for (const item of sorted) {
    if (path === item.href || path.startsWith(`${item.href}/`)) {
      return item.href;
    }
  }
  return null;
}

export default function AdminSidebar({ pathname: pathnameFromServer, adminEmail: _adminEmail }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const router = useRouter();
  const pathnameFromClient = usePathname();
  const tNav = useTranslations('admin.nav');
  const tSidebar = useTranslations('admin.sidebar');
  const tProfile = useTranslations('admin.profile');
  const tModal = useTranslations('admin.modal');

  // next-intl's usePathname is locale-aware and updates on client navigation; middleware header can be stale.
  const pathWithoutLocale =
    pathnameFromClient ||
    pathnameFromServer.replace(/^\/(en|fr)(?=\/|$)/, '') ||
    pathnameFromServer;

  const activeHref = getActiveNavHref(pathWithoutLocale, navItems);

  const handleSignOut = async () => {
    setSignOutOpen(false);
    setIsMobileOpen(false);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const renderSidebar = (options?: { onMobileClose?: () => void }) => {
    const onMobileClose = options?.onMobileClose;

    return (
      <aside className="flex h-full w-64 flex-col border-r border-white/20 bg-primary text-white">
        <div className="flex items-center justify-between gap-3 border-b border-white/20 px-6 py-6">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Image
              src="/logos/logomark-electric-pear.svg"
              alt={tSidebar('logoAlt')}
              width={32}
              height={32}
              className="size-8 shrink-0"
              priority
            />
            <div className="min-w-0">
              <span className="block font-wobblite text-2xl font-bold tracking-tight text-electric-pear">
                {tSidebar('brand')}
              </span>
            </div>
          </div>
          {onMobileClose ? (
            <button
              type="button"
              onClick={onMobileClose}
              className="shrink-0 cursor-pointer rounded-full p-2 text-white transition-colors hover:bg-white/15"
              aria-label={tSidebar('closeMenu')}
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-white hover:bg-white/15 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{tNav(item.labelKey)}</span>
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={() => setSignOutOpen(true)}
          className="flex w-full cursor-pointer items-center justify-center gap-2 border-t border-white/20 px-6 py-4 text-sm font-semibold text-white/90 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {tProfile('signOut')}
        </button>
      </aside>
    );
  };

  return (
    <>
      <button
        type="button"
        className="fixed left-4 top-4 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-on-surface shadow-md md:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label={tSidebar('openNavigation')}
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="hidden shrink-0 md:flex">{renderSidebar()}</div>

      {isMobileOpen ? (
        <div className="fixed inset-0 z-60 flex md:hidden">
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-black/50"
            aria-label={tSidebar('closeMenu')}
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative z-10 flex h-full w-64 max-w-[85vw] flex-col shadow-2xl">
            {renderSidebar({ onMobileClose: () => setIsMobileOpen(false) })}
          </div>
        </div>
      ) : null}

      <ConfirmationModal
        isOpen={signOutOpen}
        title={tProfile('signOutConfirmTitle')}
        description={tProfile('signOutConfirmDesc')}
        confirmLabel={tProfile('signOutConfirmLabel')}
        cancelLabel={tModal('cancel')}
        tone="danger"
        onConfirm={handleSignOut}
        onCancel={() => setSignOutOpen(false)}
      />
    </>
  );
}
