import Skeleton from '@/components/ui/Skeleton';
import { getTranslations } from 'next-intl/server';

export default async function UsersLoading() {
  const t = await getTranslations('admin.users');
  return (
    <div className="p-6 md:p-8">
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:max-w-md">
          <div className="flex w-full flex-col gap-1.5">
            <div className="h-[14px] w-[70px]">
              <Skeleton className="h-full w-full rounded-full" />
            </div>
            <div className="relative min-w-0">
              <Skeleton className="h-[44px] w-full rounded-full" />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
          <div className="w-fit">
            <div className="flex flex-col gap-1.5">
              <div className="h-[14px] w-[40px]">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
              <Skeleton className="h-[44px] w-[170px]" />
            </div>
          </div>
          <Skeleton className="h-[44px] w-[170px] rounded-xl" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline/20 shadow-sm">
        <div className="overflow-x-auto min-w-0 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-white border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('columns.user')}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{t('columns.kyc')}</th>
                <th className="px-6 py-4">{t('columns.petsCount')}</th>
                <th className="px-6 py-4">{t('columns.careGiven')}</th>
                <th className="px-6 py-4">{t('columns.careReceived')}</th>
                <th className="px-6 py-4 hidden md:table-cell">{t('columns.status')}</th>
                <th className="px-6 py-4 hidden lg:table-cell">{t('columns.joined')}</th>
                <th className="px-6 py-4 text-center">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="min-w-0">
                        <Skeleton className="mb-2 h-4 w-[160px]" />
                        <Skeleton className="h-3 w-[140px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Skeleton className="h-6 w-[110px] rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-[60px]" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-[60px]" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-[60px]" />
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <Skeleton className="h-6 w-[110px] rounded-full" />
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <Skeleton className="h-4 w-[90px]" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-[80px]" />
            <Skeleton className="h-4 w-[70px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

