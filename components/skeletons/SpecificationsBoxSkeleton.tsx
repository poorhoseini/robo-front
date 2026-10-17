import { Skeleton } from "@mui/material";
import { Fragment } from "react";

export default function SpecificationsBoxSkeleton() {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-3 md:mt-6">
      <div className="flex w-full flex-col items-center gap-3 md:hidden">
        <HorizontalLine />
        <div className="flex w-full flex-row items-center justify-around pt-2 text-sm text-grey">
          <div className="flex flex-col items-center gap-2">
            <p className="font-light">نوع</p>
            <Skeleton variant="rounded" width={30} height={20} />
          </div>
          <VerticalLine />
          <div className="flex flex-col items-center gap-2">
            <p className="font-light">سطح</p>
            <Skeleton variant="rounded" width={30} height={20} />
          </div>
          <VerticalLine />
          <div className="flex flex-col items-center gap-2">
            <p className="font-light">وضعیت</p>
            <Skeleton variant="rounded" width={40} height={20} />
          </div>
        </div>
        <HorizontalLine />
      </div>
      {new Array(6).fill(1).map((item, index) => (
        <Fragment key={index}>
          <Skeleton variant="rounded" width="100%" height={28} />
          <HorizontalLine />
        </Fragment>
      ))}
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}

function VerticalLine() {
  return <div className="h-12 w-[1px] bg-grey-100" />;
}
