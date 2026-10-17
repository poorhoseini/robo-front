"use client";

import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { useAddSimPackActions } from "@/lib/zustand/addSimPack";

export default function ApproveSimPackItemsButton({
  count,
}: {
  count: number;
}) {
  const { setStep } = useAddSimPackActions();

  const handleApproveSimPackItems = () => {
    setStep(2);
  };

  return (
    <button
      className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border-[1.4px] ${count > 1 ? "border-grey bg-white" : "border-grey-500 bg-grey-200"}`}
      onClick={handleApproveSimPackItems}
      disabled={count < 2}
    >
      <p
        className={`text-[17px] font-bold ${count ? "text-grey" : "text-grey-600"}`}
      >
        تایید سیم کارت‌ها
      </p>
      <div
        className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-normal leading-[14px] text-white ${count > 1 ? "bg-grey" : "bg-grey-600"}`}
      >
        {persianNumber(count)}
      </div>
    </button>
  );
}
