import Skeleton from '@/components/ui/Skeleton';

export default function ProfileLoading() {
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-surface-container-lowest border border-outline/20 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex items-center gap-5">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="min-w-0">
              <Skeleton className="h-5 w-[180px] mb-2" />
              <Skeleton className="h-4 w-[210px] mb-3" />
              <Skeleton className="h-6 w-[160px] rounded-full" />
            </div>
          </div>

          <div className="border-t border-outline/15">
            <div className="divide-y divide-outline/10">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Skeleton className="h-4 w-[110px]" />
                  <div className="sm:col-span-2">
                    <Skeleton className="h-4 w-[240px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-outline/15 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <Skeleton className="h-11 w-[200px] rounded-lg" />
            <Skeleton className="h-11 w-[170px] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

