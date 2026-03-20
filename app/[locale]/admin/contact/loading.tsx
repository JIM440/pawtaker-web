import Skeleton from '@/components/ui/Skeleton';

export default function ContactLoading() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <article
            key={i}
            className="relative flex flex-col rounded-xl border border-outline/20 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="min-w-0">
                  <Skeleton className="mb-2 h-4 w-[160px]" />
                  <Skeleton className="mb-2 h-3 w-[200px]" />
                  <Skeleton className="h-3 w-[140px]" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <Skeleton className="h-5 w-[90%] mb-3" />
            <Skeleton className="h-4 w-full" />
          </article>
        ))}
      </div>
    </div>
  );
}

