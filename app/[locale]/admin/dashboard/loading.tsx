import Skeleton from '@/components/ui/Skeleton';

export default function DashboardLoading() {
  return (
    <div className="p-6 md:p-8 space-y-8">
      <header className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
        <Skeleton className="h-4 w-[150px]" />
      </header>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl shadow-sm flex flex-col justify-between h-36"
          >
            <div className="flex justify-between items-start">
              <Skeleton className="h-3 w-[120px]" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div>
              <Skeleton className="h-8 w-[90px]" />
              <Skeleton className="mt-2 h-3 w-[110px]" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-xl border border-outline/20 shadow-sm p-6">
          <Skeleton className="h-4 w-[170px] mb-3" />
          <Skeleton className="h-3 w-[240px] mb-4" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
        <div className="bg-white rounded-xl border border-outline/20 shadow-sm p-6">
          <Skeleton className="h-4 w-[120px] mb-3" />
          <Skeleton className="h-3 w-[240px] mb-4" />
          <Skeleton className="h-[200px] w-full rounded-xl" />
        </div>
      </div>

      {/* Recent activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-[180px]" />
          <Skeleton className="h-3 w-[70px]" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-3 rounded-xl shadow-sm border border-outline/15 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="min-w-0">
                  <Skeleton className="h-4 w-[180px] mb-2" />
                  <Skeleton className="h-3 w-[220px]" />
                </div>
              </div>
              <Skeleton className="h-3 w-[90px]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

