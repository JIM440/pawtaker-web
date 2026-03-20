'use client';

import LocaleSelect from '@/components/i18n/LocaleSelect';

interface TopbarLangToggleProps {
  locale: string;
}

export default function TopbarLangToggle({ locale }: TopbarLangToggleProps) {
  return (
    <LocaleSelect locale={locale as 'en' | 'fr'} />
  );
}
