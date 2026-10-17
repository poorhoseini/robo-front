import { Skeleton } from "@mui/material";

export default function InstallmentPlanSkeleton() {
  return (
    <>
      <Skeleton variant="rounded" height={24} className="w-full" />
      <div className="flex w-full flex-col gap-5 rounded-2xl border border-grey-200 bg-white p-6">
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={1} />
        <Skeleton variant="rounded" height={24} />
      </div>
    </>
  );
}
