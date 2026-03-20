import Skeleton from '@/components/ui/Skeleton';

export default function SettingsLoading() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-xl border border-outline/10">
            <Skeleton className="h-5 w-[260px] mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[140px]" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Skeleton className="h-4 w-[160px]" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl border border-outline/10">
            <Skeleton className="h-5 w-[220px] mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg"
                >
                  <div className="min-w-0">
                    <Skeleton className="h-4 w-[220px] mb-2" />
                    <Skeleton className="h-3 w-[260px]" />
                  </div>
                  <Skeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-4 pt-4">
              <Skeleton className="h-10 w-[200px] rounded-lg" />
              <Skeleton className="h-10 w-[220px] rounded-lg" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

