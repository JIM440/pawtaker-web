import Skeleton from '@/components/ui/Skeleton';
import { getTranslations } from 'next-intl/server';

export default async function PetsLoading() {
  const t = await getTranslations('admin.pets');
  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-end">
          <Skeleton className="h-[66px] w-[190px] rounded-xl" />
          <Skeleton className="h-[66px] w-[220px] rounded-xl" />
        </div>
        <Skeleton className="h-[66px] w-[260px]" />
      </div>

      <div className="bg-white rounded-xl border border-outline/20 shadow-sm">
        <div className="overflow-x-auto min-w-0 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('columns.pet')}</th>
                <th className="px-6 py-4">{t('columns.owner')}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{t('columns.age')}</th>
                <th className="px-6 py-4">{t('columns.careRequests')}</th>
                <th className="px-6 py-4 hidden md:table-cell">{t('filterSpecies')}</th>
                <th className="px-6 py-4 text-center">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-lg" />
                      <div className="min-w-0">
                        <Skeleton className="mb-2 h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[140px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-[140px]" />
                        <Skeleton className="h-3 w-[160px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Skeleton className="h-4 w-[90px]" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-[80px] rounded-full" />
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <Skeleton className="h-6 w-[140px] rounded-full" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-white border-t border-outline/10 flex items-center justify-between text-sm text-on-surface/70">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-[70px]" />
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

