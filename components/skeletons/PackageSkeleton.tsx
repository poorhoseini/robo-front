import { Skeleton } from "@mui/material";

export default function PackageSkeleton() {
  return (
    <div className="flex h-[298px] w-[302px] flex-col items-center gap-3 rounded-xl border border-grey-200 bg-white px-[13px] py-5">
      <Skeleton variant="rounded" width={270} height={84} />
      <Skeleton variant="rounded" width={270} height={88} />
      <Skeleton variant="rounded" width={270} height={32} />
      <Skeleton variant="rounded" width={270} height={28} />
    </div>
  );
}
