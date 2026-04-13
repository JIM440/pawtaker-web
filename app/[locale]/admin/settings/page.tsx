import { Flag, Save, Settings } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function AdminSettingsPage() {
  const t = await getTranslations('admin.settings');

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="space-y-6">
          <section className="rounded-xl border border-outline/10 bg-white p-6">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
              <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
              {t('generalTitle')}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="admin-site-name" className="text-sm font-semibold text-on-surface">
                  {t('siteNameLabel')}
                </label>
                <input
                  id="admin-site-name"
                  type="text"
                  defaultValue="PawTaker Global"
                  className="w-full rounded-lg border border-outline/20 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="admin-support-email" className="text-sm font-semibold text-on-surface">
                  {t('supportEmailLabel')}
                </label>
                <input
                  id="admin-support-email"
                  type="email"
                  defaultValue="support@pawtaker.com"
                  className="w-full rounded-lg border border-outline/20 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="admin-default-locale" className="text-sm font-semibold text-on-surface">
                  {t('defaultLocaleLabel')}
                </label>
                <select
                  id="admin-default-locale"
                  defaultValue="en"
                  aria-label={t('defaultLocaleAria')}
                  className="w-full rounded-lg border border-outline/20 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="en">{t('localeEnUs')}</option>
                  <option value="fr">{t('localeFrFr')}</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline/10 bg-white p-6">
            <h2 className="mb-6 flex items-center gap-2 text-lg font-bold">
              <Flag className="h-5 w-5 text-primary" aria-hidden="true" />
              {t('featureFlagsTitle')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{t('flagPublicRegTitle')}</p>
                  <p className="text-xs text-on-surface/70">{t('flagPublicRegDesc')}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-outline/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-outline/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-surface-container" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{t('flagAiTitle')}</p>
                  <p className="text-xs text-on-surface/70">{t('flagAiDesc')}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" defaultChecked className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-outline/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-outline/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-surface-container" />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-surface-container-lowest p-4">
                <div>
                  <p className="text-sm font-semibold text-on-surface">{t('flagDonationTitle')}</p>
                  <p className="text-xs text-on-surface/70">{t('flagDonationDesc')}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="peer h-6 w-11 rounded-full bg-outline/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-outline/20 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none dark:bg-surface-container" />
                </label>
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              className="rounded-full border border-outline/20 px-6 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-surface-container-lowest"
            >
              {t('reset')}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-sm font-bold text-on-primary shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
            >
              <Save className="h-4 w-4" aria-hidden="true" />
              {t('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
