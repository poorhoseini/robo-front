import {
  getSimCardStateLabel,
  getSimCardTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import {
  formatPhoneNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";

export default function PredictCard({
  predictType,
  title,
  accuracy,
  type,
  state,
  date,
  onClick,
  isDone,
  price,
  priceRange,
}: {
  predictType: "ai" | "expert";
  title: string;
  accuracy?: string;
  type: number;
  state: number;
  date: EpochTimeStamp;
  onClick: () => void;
  isDone?: boolean;
  price?: number;
  priceRange?: [number, number];
}) {
  return (
    <button
      onClick={() => isDone !== false && onClick()}
      disabled={isDone === false}
      className={`relative flex w-[302px] select-none flex-col items-center justify-between gap-2 rounded-xl border border-grey-200 bg-white px-4 py-5 hover:shadow-lg`}
    >
      <div
        className={`flex w-full flex-col items-center gap-2 rounded-xl bg-grey-900 p-3`}
      >
        <h3 className="ltr flex text-[26px] font-semibold leading-7 text-white">
          {formatPhoneNumber(title)}
        </h3>
        <div className="flex w-full flex-row items-center justify-start gap-3 whitespace-nowrap text-xs font-normal text-white">
          <div className="flex flex-row items-center justify-center gap-1">
            <Image
              src="/icons/icon-calendar.svg"
              alt="Creation Time"
              width={16}
              height={16}
            />
            <span className="ltr">
              {new Date(date * 1000).toLocaleDateString("fa-IR", {
                weekday: "long",
              })}{" "}
              {new Date(date * 1000).toLocaleDateString("fa-IR", {
                day: "numeric",
                year: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <VerticalLineBlue />
          <div className="flex flex-row items-center justify-center gap-1">
            <Image src="/icons/clock-grey.svg" alt="" width={20} height={21} />
            <span className="ltr">
              {new Date(date * 1000).toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
      <div
        className={`flex w-full flex-col items-center justify-between gap-3 rounded-md bg-grey-100 p-3 text-grey`}
      >
        <div className="flex h-[24px] w-full flex-row items-center justify-between gap-4">
          <p className="w-1/2 text-center">{getSimCardTypeLabel(type)}</p>
          <VerticalLineGrey />
          <p className="w-1/2 text-center">{getSimCardStateLabel(state)}</p>
        </div>
        {predictType === "ai" && !!price && (
          <div className="relative flex h-[32px] w-full flex-row items-center justify-center gap-1 rounded-md bg-white">
            <p className="text-base font-bold">{persianNumber(price)}</p>
            <p className="text-[10px] font-light">تومان</p>
          </div>
        )}
      </div>
      {predictType === "ai" && !!accuracy && (
        <div className={`h-[32px] w-full`}>
          <PackageBadge
            color={
              accuracy === "زیاد"
                ? "biege"
                : accuracy === "متوسط"
                  ? "blue"
                  : "grey"
            }
            label={`دقت تخمین (${accuracy})`}
          />
        </div>
      )}
      {predictType === "expert" && isDone === false && (
        <div className={`h-[32px] w-full`}>
          <PackageBadge color="biege" label="در صف کارشناسی" />
        </div>
      )}
      {predictType === "expert" && !!priceRange && priceRange.length > 1 && (
        <div className="flex h-8 w-full flex-row items-center justify-center gap-1 rounded-xl bg-biege text-brown">
          <p className="text-base font-bold">
            {persianNumber(Math.floor((priceRange[0] + priceRange[1]) / 2))}
          </p>
          <p className="text-[10px] font-light">تومان</p>
        </div>
      )}

      {predictType === "expert" && isDone === false ? (
        <div className="flex h-7 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#F3F9FF] text-xs font-medium text-blue">
          <Image
            src="/icons/icon-time-circle.svg"
            alt="Enter"
            width={19}
            height={18}
          />
          <p>زمان تقریبی کارشناسی ۲۴ ساعت</p>
        </div>
      ) : (
        <div className="flex h-7 w-full flex-row items-center justify-end gap-2">
          <div className="itemx-center flex flex-row text-sm font-medium text-grey">
            <p>مشاهده&nbsp;</p>
          </div>
          <div className="flex h-full w-[30px] items-center justify-center rounded-[4px] bg-blue-900">
            <Image
              src="/icons/icon-arrow-left.svg"
              alt="Enter"
              width={16}
              height={16}
            />
          </div>
        </div>
      )}
    </button>
  );
}

function VerticalLineBlue() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}

function VerticalLineGrey() {
  return <div className="h-6 w-[1px] bg-grey-200" />;
}

function PackageBadge({
  label,
  color,
}: {
  label: string;
  color: "biege" | "blue" | "grey";
}) {
  const textColor =
    color === "biege"
      ? "text-brown"
      : color === "blue"
        ? "text-blue"
        : "text-grey";
  const bgColor =
    color === "biege"
      ? "bg-biege"
      : color === "blue"
        ? "bg-[#F3F9FF]"
        : "bg-[#F7F7F7]";
  return (
    <div
      className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-xl text-xs font-medium ${textColor} ${bgColor}`}
    >
      <p>{label}</p>
    </div>
  );
}
