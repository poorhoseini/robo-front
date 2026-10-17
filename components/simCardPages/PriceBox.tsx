import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Num2persian from "num2persian";
import DiscountRemoveButton from "./DiscountRemoveButton";

type PriceBoxProps = {
  isRemovable: boolean;
  isApprovedByExpert?: boolean;
  price?: number;
  minPrice?: number;
  maxPrice?: number;
  startPrice?: number;
  offPercent?: number;
  offPrice?: number;
  priceType?: number;
};

export default function PriceBox({
  isRemovable,
  isApprovedByExpert,
  price,
  minPrice,
  maxPrice,
  startPrice,
  offPercent,
  offPrice,
  priceType,
}: PriceBoxProps) {
  let mainLabel: string;
  let mainPrice: number | string;
  switch (priceType) {
    case 0:
      mainLabel = "قیمت";
      mainPrice = price || 0;
      break;
    case 1:
      mainLabel = "قیمت";
      mainPrice = "تماس بگیرید";
      break;
    case 2:
      mainLabel = "قیمت پایه";
      mainPrice = startPrice || 0;
      break;
    case 3:
      mainLabel = "قیمت با تخفیف";
      mainPrice = offPrice || 0;
      break;
    default:
      mainLabel = "حداقل قیمت";
      mainPrice = minPrice || 0;
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
            {isApprovedByExpert && (
              <div className="flex h-[24px] w-[84px] items-center justify-center rounded-xl bg-biege text-[10px] font-medium text-brown md:text-xs">
                کارشناسی شده
              </div>
            )}
          </div>
          <p className="text-xs text-grey-700 md:text-sm">
            {priceType !== 1 && Num2persian(mainPrice) + " تومان"}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-1">
          <div className="flex flex-row items-center gap-1">
            <p className="text-base font-medium text-blue md:text-xl md:font-bold">
              {persianNumber(mainPrice || 0)}
            </p>
            {priceType !== 1 && (
              <p className="text-[10px] font-light text-grey">تومان</p>
            )}
          </div>
          {priceType === 3 && (
            <p className="text-sm font-medium text-grey-400 line-through">
              {persianNumber(price || 0)}
            </p>
          )}
        </div>
      </div>
      {priceType === 3 && (
        <div className="flex h-[44px] w-full flex-row items-center justify-between rounded-lg bg-white p-3 text-sm">
          <p className="font-normal text-grey">درصد تخفیف:</p>
          <p className="font-medium text-blue">{`${persianNumber(offPercent || 0)} درصد`}</p>
        </div>
      )}
      {isApprovedByExpert && (
        <div className="h-[44px] w-full rounded-lg bg-white p-3 text-sm font-normal text-grey">
          این قیمت در بازه کارشناسی شده روبو رند می باشد.
        </div>
      )}
      {maxPrice && (
        <>
          <HorizontalLine />
          <div className="flex w-full flex-row items-center justify-between gap-2">
            <div className="irtems-start flex flex-col justify-between gap-1 font-normal">
              <p className="whitespace-nowrap text-sm text-grey md:text-base">
                حداکثر قیمت
              </p>
              <p className="text-xs text-grey-700 md:text-sm">
                {Num2persian(maxPrice) + " تومان"}
              </p>
            </div>
            <div className="flex flex-row items-center gap-1">
              <p className="text-base font-medium text-blue md:text-xl md:font-bold">
                {persianNumber(maxPrice || 0)}
              </p>
              <p className="text-[10px] font-light text-grey">تومان</p>
            </div>
          </div>
        </>
      )}
      {isRemovable && priceType === 3 && <DiscountRemoveButton />}
    </div>
  );
}

function HorizontalLine() {
  return (
    <div className="h-[1px] w-full border-b border-grey-100 md:border-blue-700" />
  );
}
