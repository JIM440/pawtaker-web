import Skeleton from '@/components/ui/Skeleton';

export default function KycLoading() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8 flex flex-col gap-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1 sm:w-auto">
            <Skeleton className="mb-1 h-[14px] w-[40px]" />
            <Skeleton className="h-[44px] w-[190px] rounded-full" />
          </div>
          <div className="flex-1 sm:max-w-md relative min-w-0">
            <Skeleton className="h-[44px] w-full rounded-full" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-2xl border border-outline/20 bg-white shadow-sm"
          >
            <Skeleton className="h-[190px] w-full rounded-none" />
            <Skeleton className="h-[38px] w-full rounded-none" />
            <div className="p-4 flex flex-1 flex-col">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="min-w-0">
                    <Skeleton className="mb-2 h-4 w-[160px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </div>
                <Skeleton className="h-5 w-[80px] rounded-full" />
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>

              <div className="mt-4 flex gap-2">
                <Skeleton className="h-[40px] w-1/2 rounded-full" />
                <Skeleton className="h-[40px] w-1/2 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

