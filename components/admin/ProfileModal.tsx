'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import ConfirmationModal from './ConfirmationModal';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function ProfileModal({ isOpen, onClose, locale }: ProfileModalProps) {
  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  if (!isOpen) return null;

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    // Replace locale prefix in path
    const newPath = pathname.replace(/^\/(en|fr)/, `/${newLocale}`);
    router.push(newPath);
  };

  const handleSignOut = async () => {
    setIsSignOutConfirmOpen(false);
    onClose();
    const supabase = createClient();
    await supabase.auth.signOut(); // clears the session cookies
    router.push(`/${locale}/admin/login`);
    router.refresh(); // forces the server to re-evaluate — layout guard picks it up
  };

  return (
    <>
      <div
        className="fixed inset-0 z-70 flex items-center justify-center bg-black/55 backdrop-blur-[1px] px-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Avatar + info */}
          <div className="flex items-center gap-4 mb-5">
            <div className="size-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-lg shrink-0">
              AA
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Alex Admin</p>
              <p className="text-xs text-slate-600">alex@pawtaker.com</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                Super Admin
              </span>
            </div>
          </div>

          <div className="mb-4 border-t border-slate-200 pt-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Language
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleLocaleChange('en')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-primary text-on-primary'
                    : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLocaleChange('fr')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  locale === 'fr'
                    ? 'bg-primary text-on-primary'
                    : 'border border-slate-300 text-slate-800 hover:bg-slate-50'
                }`}
              >
                FR
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4">
            <button
              onClick={() => setIsSignOutConfirmOpen(true)}
              className="w-full px-4 py-2.5 rounded-xl bg-error/10 text-error text-sm font-medium hover:bg-error/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isSignOutConfirmOpen}
        title="Sign out?"
        description="You will be returned to the login screen."
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
        tone="danger"
        onConfirm={handleSignOut}
        onCancel={() => setIsSignOutConfirmOpen(false)}
      />
    </>
  );
}
