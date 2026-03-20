import Skeleton from '@/components/ui/Skeleton';
import { getTranslations } from 'next-intl/server';

export default async function RequestsLoading() {
  const t = await getTranslations('admin.requests');
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="w-full sm:w-fit">
          <Skeleton className="mb-1 h-[14px] w-[50px]" />
          <Skeleton className="h-[44px] w-[170px] rounded-full" />
        </div>
        <div className="w-full sm:max-w-md">
          <Skeleton className="mb-1 h-[14px] w-[40px]" />
          <Skeleton className="h-[44px] w-full rounded-full" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline/20 shadow-sm">
        <div className="overflow-x-auto min-w-0 rounded-xl">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white border-b border-outline/10 text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('table.petBreed')}</th>
                <th className="px-6 py-4">{t('table.owner')}</th>
                <th className="px-6 py-4">{t('table.careGivenBy')}</th>
                <th className="px-6 py-4 hidden sm:table-cell">{t('table.serviceDates')}</th>
                <th className="px-6 py-4">{t('table.careType')}</th>
                <th className="px-6 py-4">{t('table.status')}</th>
                <th className="px-6 py-4 text-center">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-[90px]" />
                        <Skeleton className="h-3 w-[140px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[160px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[160px]" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <Skeleton className="h-4 w-[160px]" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-7 w-[120px] rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-7 w-[120px] rounded-full" />
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
            <Skeleton className="h-4 w-[90px]" />
            <Skeleton className="h-4 w-[70px]" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-outline/20 shadow-sm"
          >
            <Skeleton className="mb-4 h-3 w-[60%]" />
            <Skeleton className="mb-2 h-9 w-[40%] rounded-xl" />
            <Skeleton className="h-4 w-[30%]" />
          </div>
        ))}
      </div>
    </div>
  );
}

