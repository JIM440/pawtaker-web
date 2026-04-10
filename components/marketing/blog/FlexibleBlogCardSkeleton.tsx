export function FlexibleBlogCardSkeleton() {
  return (
    <div className="w-full h-full flex flex-col rounded-[20px] bg-[#fffafa] p-1">
      <div className="overflow-hidden rounded-[16px] rounded-bl-[4px] rounded-br-[4px] flex-shrink-0">
        <div className="h-[200px] w-full animate-pulse bg-[#e7d9dd]" />
      </div>
      <div className="flex flex-col flex-1 space-y-3 px-5 py-5">
        <div className="h-7 w-11/12 animate-pulse rounded-full bg-[#eadedf]" />
        <div className="space-y-2 flex-1">
          <div className="h-4 w-full animate-pulse rounded-full bg-[#eadedf]" />
          <div className="h-4 w-10/12 animate-pulse rounded-full bg-[#eadedf]" />
          <div className="h-4 w-8/12 animate-pulse rounded-full bg-[#eadedf]" />
        </div>
        <div className="h-4 w-24 animate-pulse rounded-full bg-[#eadedf]" />
      </div>
    </div>
  );
}
