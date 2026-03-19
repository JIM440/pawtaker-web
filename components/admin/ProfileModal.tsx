'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
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

  const handleSignOut = () => {
    setIsSignOutConfirmOpen(false);
    onClose();
    console.log('signed out');
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
        onClick={onClose}
      >
        <div
          className="bg-surface-container-lowest rounded-2xl shadow-xl p-6 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Avatar + info */}
          <div className="flex items-center gap-4 mb-5">
            <div className="size-14 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-lg shrink-0">
              AA
            </div>
            <div>
              <p className="font-semibold text-on-surface text-sm">Alex Admin</p>
              <p className="text-xs text-on-surface/60">alex@pawtaker.com</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                Super Admin
              </span>
            </div>
          </div>

          <div className="border-t border-outline/20 pt-4 mb-4">
            <p className="text-xs font-medium text-on-surface/50 uppercase tracking-wide mb-2">
              Language
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleLocaleChange('en')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  locale === 'en'
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => handleLocaleChange('fr')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  locale === 'fr'
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline/30 text-on-surface hover:bg-surface-container'
                }`}
              >
                FR
              </button>
            </div>
          </div>

          <div className="border-t border-outline/20 pt-4">
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
