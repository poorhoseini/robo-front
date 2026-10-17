import { Skeleton } from "@mui/material";

export default function BidsSectionSkeleton() {
  return (
    <div className="flex w-full flex-row items-center gap-6">
      <Skeleton variant="rounded" width="100%" height={96} />
      <Skeleton variant="rounded" width="100%" height={96} />
    </div>
  );
}
