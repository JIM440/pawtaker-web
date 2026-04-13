import { getTranslations } from 'next-intl/server';

export default async function AdminProfilePage() {
  const t = await getTranslations('admin.profile');

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface-container-lowest border border-outline/20 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center gap-5">
            <div className="size-14 rounded-full bg-primary/15 text-primary flex items-center justify-center text-lg font-bold">
              AA
            </div>
            <div className="min-w-0">
              <p className="text-lg font-bold text-on-surface truncate">{t('name')}</p>
              <p className="text-sm text-on-surface/70 truncate">{t('email')}</p>
              <div className="mt-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {t('role')}
              </div>
            </div>
          </div>

          <div className="border-t border-outline/15">
            <dl className="divide-y divide-outline/10">
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface/60">
                  {t('usernameLabel')}
                </dt>
                <dd className="sm:col-span-2 text-sm text-on-surface">{t('usernameValue')}</dd>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface/60">
                  {t('workspaceLabel')}
                </dt>
                <dd className="sm:col-span-2 text-sm text-on-surface">{t('workspaceValue')}</dd>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <dt className="text-xs font-semibold uppercase tracking-wider text-on-surface/60">
                  {t('lastLoginLabel')}
                </dt>
                <dd className="sm:col-span-2 text-sm text-on-surface">{t('lastLoginValue')}</dd>
              </div>
            </dl>
          </div>

          <div className="p-6 border-t border-outline/15 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button className="px-4 py-2.5 rounded-full border border-outline/30 bg-surface-container-lowest text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors">
              {t('editProfile')}
            </button>
            <button className="px-4 py-2.5 rounded-full bg-error text-on-primary text-sm font-semibold hover:bg-error/90 transition-colors">
              {t('signOut')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

