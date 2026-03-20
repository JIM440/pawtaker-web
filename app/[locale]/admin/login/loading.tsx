import Skeleton from '@/components/ui/Skeleton';

export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen bg-background-base flex items-center justify-center p-6">
      <div className="w-full max-w-[440px] bg-white/90 backdrop-blur rounded-xl shadow-xl shadow-primary/5 border border-outline/30 p-8 md:p-10">
        <div className="text-center mb-10">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mt-3 h-7 w-[190px] mx-auto rounded-full" />
          <Skeleton className="mt-2 h-4 w-[260px] mx-auto" />
          <Skeleton className="mt-5 h-8 w-[160px] mx-auto rounded-full" />
        </div>

        <div className="space-y-6">
          <div>
            <Skeleton className="h-4 w-[120px] mb-2" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="h-4 w-[90px]" />
              <Skeleton className="h-3 w-[90px]" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-4 w-[170px]" />
          </div>

          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        <div className="mt-8 border-t border-outline/20 pt-4 text-center">
          <Skeleton className="mx-auto h-3 w-[210px]" />
          <div className="mt-4 flex justify-center gap-4">
            <Skeleton className="h-3 w-[120px]" />
            <Skeleton className="h-3 w-[120px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

