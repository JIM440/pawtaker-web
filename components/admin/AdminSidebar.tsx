'use client';

import { useState } from 'react';
import ProfileModal from './ProfileModal';

interface AdminSidebarProps {
  pathname: string;
  locale: string;
}

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/kyc', label: 'KYC Reviews', icon: '🪪' },
  { href: '/admin/requests', label: 'Care Requests', icon: '🐾' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/pets', label: 'Pets', icon: '🐶' },
  { href: '/admin/reports', label: 'Reports', icon: '🚩' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/admin/contact', label: 'Contact', icon: '✉️' },
];

export default function AdminSidebar({ pathname, locale }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || pathname;

  const sidebarContent = (
    <aside className="w-64 bg-primary text-on-primary flex flex-col h-full">
      <div className="px-6 py-6 border-b border-white/10 flex items-center gap-3">
        <div className="size-10 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold shrink-0">
          PT
        </div>
        <div>
          <span className="block text-xl font-bold">PawTaker</span>
          <span className="block text-xs text-white/70 mt-0.5">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathWithoutLocale === item.href ||
            pathWithoutLocale.startsWith(item.href + '/');
          return (
            <a
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <button
        onClick={() => setIsProfileOpen(true)}
        className="px-6 py-4 border-t border-white/10 text-xs text-white/70 flex items-center justify-between hover:bg-white/10 transition-colors w-full text-left"
      >
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold shrink-0">
            AA
          </div>
          <div>
            <p className="font-semibold text-white text-sm">Alex Admin</p>
            <p className="text-white/60 text-[11px]">Super Admin</p>
          </div>
        </div>
        <span className="text-white/60 text-base">›</span>
      </button>
    </aside>
  );

  return (
    <>
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-white shadow-md"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation"
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
          <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Desktop sidebar */}
      <div className="hidden md:flex shrink-0">
        {sidebarContent}
      </div>

      {/* Mobile sidebar overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex flex-col w-64 h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        locale={locale}
      />
    </>
  );
}
