export default function PackageSkeleton({
  isVertical = false,
}: {
  isVertical?: boolean;
}) {
  return (
    <div
      className={`relative flex ${isVertical ? "w-full" : "w-[295px] md:w-[302px]"} shrink-0 animate-pulse select-none flex-col justify-between gap-3 rounded-2xl border border-grey-200 bg-white p-3.5 shadow-sm md:p-4`}
    >
      {/* Dark Header Skeleton */}
      <div className="flex h-[76px] w-full flex-col items-center justify-between rounded-xl bg-grey-200 p-3">
        <div className="h-5 w-36 rounded-md bg-grey-300" />
        <div className="flex w-full items-center justify-center gap-2">
          <div className="h-3 w-14 rounded bg-grey-300" />
          <div className="h-3 w-[1px] bg-grey-300" />
          <div className="h-3 w-16 rounded bg-grey-300" />
          <div className="h-3 w-[1px] bg-grey-300" />
          <div className="h-3 w-12 rounded bg-grey-300" />
        </div>
      </div>

      {/* Middle Box Skeleton */}
      <div className="flex h-[64px] w-full flex-col items-center justify-between rounded-xl bg-grey-100 p-2">
        <div className="flex w-full items-center justify-around">
          <div className="h-3 w-16 rounded bg-grey-200" />
          <div className="h-3 w-[1px] bg-grey-300" />
          <div className="h-3 w-16 rounded bg-grey-200" />
        </div>
        <div className="h-7 w-full rounded-lg bg-white shadow-xs" />
      </div>

      {/* Badges Skeleton */}
      <div className="flex h-7 w-full items-center justify-between gap-2">
        <div className="h-7 flex-1 rounded-xl bg-[#FDF6E8]/70" />
        <div className="h-7 flex-1 rounded-xl bg-[#FDF6E8]/70" />
      </div>

      {/* Footer Skeleton */}
      <div className="flex h-7 w-full items-center justify-between pt-0.5">
        <div className="h-7 w-7 rounded-md bg-[#EAF5FF]" />
        <div className="h-3.5 w-20 rounded bg-grey-200" />
      </div>
    </div>
  );
}

export function StoreCardSkeleton() {
  return (
    <div className="flex h-[144px] w-[295px] shrink-0 animate-pulse select-none flex-col justify-between rounded-2xl border border-grey-200 bg-white p-4 shadow-sm md:w-[302px]">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#FDF6E8]" />
          <div className="h-4 w-28 rounded bg-grey-200" />
        </div>
        <div className="h-5 w-14 rounded-md bg-[#FDF6E8]" />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="h-3 w-16 rounded bg-grey-200" />
        <div className="h-4 w-24 rounded bg-grey-200" />
      </div>
      <div className="flex w-full items-center justify-between pt-1">
        <div className="h-7 w-7 rounded-md bg-[#EAF5FF]" />
        <div className="h-4 w-20 rounded bg-grey-200" />
      </div>
    </div>
  );
}
