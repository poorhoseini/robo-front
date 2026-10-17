import Space from "../general/Space";
import { Skeleton } from "@mui/material";

export default function ViewsGraphCardSkeleton() {
  return (
    <div className="flex h-[203px] w-full flex-col items-start justify-start rounded-2xl bg-white pt-5 md:min-w-[820px]">
      <div className="mx-auto">
        <div className="flex flex-row items-center gap-2 text-sm font-bold text-grey">
          <span>تعداد بازدید: </span>
          <Skeleton variant="rounded" width={25} height={22} />
        </div>
        <Space value={10} />
        <div className="flex min-h-[150px] w-full flex-row-reverse items-end justify-center gap-3 md:gap-6">
          {new Array(5).fill(1).map((item, index) => (
            <div
              key={index}
              className="flex h-[150px] w-10 flex-col items-center justify-end gap-[10px]"
            >
              <Skeleton
                variant="rounded"
                width={40}
                height={(110 * (index * 20)) / 100}
              />
              <div className="flex flex-col items-center gap-1 ">
                <Skeleton variant="rounded" width={45} height={15} />
                <Skeleton variant="rounded" width={25} height={15} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
