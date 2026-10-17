"use client";

import {
  getSimCardStateLabel,
  getSimCardTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import { useState } from "react";

export default function SavedSimPackItemCardClient({
  phoneNumber,
  simCardState,
  simCardType,
  onDelete,
}: {
  phoneNumber: string;
  simCardState: number;
  simCardType: number;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = () => setOpen((prev) => !prev);

  const handleDeletePackageCard = () => {
    onDelete();
  };

  return (
    <div
      className={`flex w-full flex-col items-center gap-3 overflow-y-clip transition-all md:w-[381px] ${open ? "h-[115px] min-h-[115px]" : "h-[52px] min-h-[52px]"}`}
    >
      <div className="flex w-full flex-row items-center justify-between rounded-t-xl bg-grey-900 p-3">
        <button
          className="flex h-6 w-6 items-center justify-center"
          onClick={handleDeletePackageCard}
        >
          <Image
            src="/icons/icon-garbage.svg"
            alt="Remove Item"
            width={24}
            height={24}
          />
        </button>
        <div className="flex w-full flex-col items-center justify-between gap-2">
          <div className="flex flex-col items-center">
            {[phoneNumber].slice(0, 3).map((spell, index) => (
              <h3
                key={index}
                className="ltr flex text-[26px] font-semibold leading-7 text-white"
              >
                {persianNumber(spell)}
              </h3>
            ))}
          </div>
        </div>
        <button
          className="flex h-6 w-6 items-center justify-center"
          onClick={handleToggleOpen}
        >
          <Image
            src="/icons/icon-chevron-down-circled.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>
      </div>
      <div className="flex w-full flex-col items-center justify-between gap-3 rounded-md bg-grey-100 p-3 text-grey">
        <div className="flex h-[24px] w-full flex-row items-center justify-between gap-4">
          <div className="w-1/2 text-center">
            {getSimCardStateLabel(simCardState)}
          </div>
          <VerticalLineGrey />
          <p className="w-1/2 text-center">
            {getSimCardTypeLabel(simCardType)}
          </p>
        </div>
      </div>
    </div>
  );
}

function VerticalLineGrey() {
  return <div className="h-6 w-[1px] bg-grey-200" />;
}
