import Skeleton from '@/components/ui/Skeleton';
import { getTranslations } from 'next-intl/server';

export default async function ReportsLoading() {
  const t = await getTranslations('admin.reports');
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="w-full sm:max-w-md">
            <Skeleton className="mb-1 h-[14px] w-[60px]" />
            <Skeleton className="h-[44px] w-full rounded-full" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-outline/20 shadow-sm">
          <div className="overflow-x-auto min-w-0 rounded-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-white text-on-surface/70 text-xs uppercase tracking-wider font-semibold border-b border-outline/15">
                <tr>
                  <th className="px-6 py-4">{t('table.reporter')}</th>
                  <th className="px-6 py-4">{t('table.reportedText')}</th>
                  <th className="px-6 py-4 text-right">{t('table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline/15">
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-5">
                      <div className="flex items-start gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="min-w-0 flex flex-col gap-2">
                          <Skeleton className="h-4 w-[160px]" />
                          <Skeleton className="h-4 w-[240px]" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="mt-2 h-4 w-[85%]" />
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        <div className="px-6 py-4 bg-white border-t border-outline/20 flex items-center justify-between">
            <Skeleton className="h-4 w-[260px]" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

