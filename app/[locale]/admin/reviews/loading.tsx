import Skeleton from '@/components/ui/Skeleton';
import { getTranslations } from 'next-intl/server';

export default async function ReviewsLoading() {
  const t = await getTranslations('admin.reviews');
  return (
    <div className="p-6 md:p-8">
      {/* Controls */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex w-full flex-col gap-1.5 sm:max-w-md">
          <Skeleton className="h-[14px] w-[90px]" />
          <Skeleton className="h-[44px] w-full rounded-full" />
        </div>
        <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:min-w-[160px]">
          <Skeleton className="h-[14px] w-[60px]" />
          <Skeleton className="h-[44px] w-[180px] rounded-full" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-outline/20 shadow-sm">
        <div className="overflow-x-auto min-w-0 rounded-xl">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-outline/10 bg-white text-xs font-bold uppercase tracking-wider text-on-surface/70">
                <th className="px-6 py-4">{t('columns.stars')}</th>
                <th className="px-6 py-4">{t('columns.reviewer')}</th>
                <th className="px-6 py-4">{t('columns.reviewee')}</th>
                <th className="px-6 py-4">{t('columns.excerpt')}</th>
                <th className="hidden px-6 py-4 sm:table-cell">{t('columns.date')}</th>
                <th className="px-6 py-4 text-center">{t('columns.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline/10 text-sm">
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="transition-colors">
                  <td className="align-top px-6 py-4">
                    <Skeleton className="h-4 w-[90px] rounded-full" />
                  </td>
                  <td className="align-top px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-[140px]" />
                        <Skeleton className="h-3 w-[180px]" />
                      </div>
                    </div>
                  </td>
                  <td className="align-top px-6 py-4">
                    <div className="flex items-start gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div>
                        <Skeleton className="mb-2 h-4 w-[120px]" />
                        <Skeleton className="h-3 w-[160px]" />
                      </div>
                    </div>
                  </td>
                  <td className="max-w-md px-6 py-4 align-top">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-[85%]" />
                  </td>
                  <td className="hidden whitespace-nowrap px-6 py-4 align-top text-on-surface/60 sm:table-cell">
                    <Skeleton className="h-4 w-[90px]" />
                  </td>
                  <td className="px-6 py-4 text-center align-top">
                    <Skeleton className="mx-auto h-10 w-10 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-outline/10 bg-white px-6 py-4 text-sm text-on-surface/70">
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

