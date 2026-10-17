import { ServiceType } from "@/lib/entities/landingPage";
import { Skeleton } from "@mui/material";

export default function PriceBoxSkeleton({
  serviceType,
  priceType,
}: {
  serviceType: ServiceType;
  priceType: number;
}) {
  let mainLabel: string;
  switch (priceType) {
    case 0:
      mainLabel = "قیمت";
      break;
    case 1:
      mainLabel = "قیمت";
      break;
    case 2:
      mainLabel = "قیمت پایه";
      break;
    case 3:
      mainLabel = "قیمت با تخفیف";
      break;
    default:
      mainLabel = "حداقل قیمت";
      break;
  }

  return (
    <div className="flex w-full flex-col items-center justify-between gap-3 rounded-lg py-4 md:bg-blue-900 md:p-4">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="irtems-start flex flex-col justify-between gap-1 font-normal">
          <div className="flex flex-row items-center justify-start gap-1">
            <p className="whitespace-nowrap text-sm text-grey md:text-base">
              {mainLabel}
            </p>
            <Skeleton variant="rounded" width={84} height={24} />
          </div>
          {priceType !== 1 && (
            <Skeleton variant="rounded" width={200} height={20} />
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex flex-row items-center gap-1">
            <Skeleton variant="rounded" width={83} height={20} />
            {priceType !== 1 && (
              <p className="text-[10px] font-light text-grey">تومان</p>
            )}
          </div>
        </div>
      </div>
      {serviceType === "specialSim" && (
        <>
          <HorizontalLine />
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <div className="irtems-start flex flex-col justify-between gap-1 font-normal">
              <p className="whitespace-nowrap text-sm text-grey md:text-base">
                حداکثر قیمت
              </p>
              <Skeleton variant="rounded" width={96} height={16} />
            </div>
            <div className="flex flex-row items-center gap-1">
              <Skeleton variant="rounded" width={85} height={24} />
              <p className="text-[10px] font-light text-grey">تومان</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function HorizontalLine() {
  return (
    <div className="h-[1px] w-full border-b border-grey-100 md:border-blue-700" />
  );
}
