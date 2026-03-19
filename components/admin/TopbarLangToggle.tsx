'use client';

import { useRouter, usePathname } from 'next/navigation';

interface TopbarLangToggleProps {
  locale: string;
}

export default function TopbarLangToggle({ locale }: TopbarLangToggleProps) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (newLocale: string) => {
    if (newLocale === locale) return;
    const newPath = pathname.replace(/^\/(en|fr)/, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 bg-background-base border border-outline/30 rounded-lg p-0.5">
      <button
        onClick={() => switchTo('en')}
        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
          locale === 'en'
            ? 'bg-primary text-on-primary'
            : 'text-on-surface/60 hover:text-on-surface'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchTo('fr')}
        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
          locale === 'fr'
            ? 'bg-primary text-on-primary'
            : 'text-on-surface/60 hover:text-on-surface'
        }`}
      >
        FR
      </button>
    </div>
  );
}
