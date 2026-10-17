"use client";

import { Bid } from "@/lib/entities/bid";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { getRemainingTimeDHM } from "@/lib/helpers/timeDifference";
import BidsDialog from "./BidsDialog";

export default function BidsSection({
  highestBidData,
  bids,
}: {
  highestBidData: {
    expireDate: EpochTimeStamp;
    _id: string;
  };
  bids: Bid[];
}) {
  const highestBidRemainingTime = getRemainingTimeDHM(
    highestBidData.expireDate,
  );

  const topBid = bids[bids.length - 1]?.bidPrice || 0;

  return (
    <div className="flex w-full flex-col items-start justify-center gap-6 md:flex-row md:items-center">
      <div className="flex w-full flex-row items-center justify-between rounded-xl bg-biege px-4 py-5">
        <p className="text-base font-medium leading-5 text-grey">
          زمان باقی‌مانده
        </p>
        <div className="flex flex-row items-center justify-end gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white pt-1 text-xs md:text-sm">
              {persianNumber(
                ("00" + highestBidRemainingTime.minutes).slice(-2),
              )}
            </div>
            <p className="text-xs font-light">دقیقه</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white pt-1 text-xs md:text-sm">
              {persianNumber(("00" + highestBidRemainingTime.hours).slice(-2))}
            </div>
            <p className="text-xs font-light">ساعت</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white pt-1 text-xs md:text-sm">
              {persianNumber(("00" + highestBidRemainingTime.days).slice(-2))}
            </div>
            <p className="text-xs font-light">روز</p>
          </div>
        </div>
      </div>
      <div className="flex h-24 w-full flex-col items-center justify-between rounded-xl bg-biege p-4">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-base font-normal leading-5 text-grey">
            آخرین پیشنهاد:
          </p>
          <p>
            <span className="text-2xl font-bold leading-5 text-blue">
              {persianNumber(topBid) + " "}
            </span>
            <span className="text-[10px] font-light leading-5 text-grey">
              تومان
            </span>
          </p>
        </div>
        <BidsDialog bids={bids} />
      </div>
    </div>
  );
}
