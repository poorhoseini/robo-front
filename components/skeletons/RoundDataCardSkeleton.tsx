import { Skeleton } from "@mui/material";

export default function RoundDataCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-6 rounded-lg border border-grey-200 px-4 py-6">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-base font-medium text-grey">مشاهده نوع رندی</p>
        <div className="flex h-9 w-[124px] flex-row items-center justify-center gap-2 rounded-lg bg-biege">
          <p className="text-sm font-medium text-brown">تعداد رندی</p>
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
            <Skeleton variant="rounded" width={20} height={20} />
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        {new Array(3).fill(1).map((item, index) => (
          <Skeleton key={index} variant="rounded" width="100%" height={40} />
        ))}
      </div>
    </div>
  );
}
