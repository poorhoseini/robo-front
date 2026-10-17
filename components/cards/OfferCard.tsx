import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import Space from "../general/Space";

export default function OfferCard({
  title,
  bid,
  highestBid,
  date,
  footer,
  onClick,
  isDone,
}: {
  title: string[];
  bid: number;
  highestBid: number;
  date: EpochTimeStamp;
  footer: string;
  onClick: () => void;
  isDone?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={isDone === false}
      className={`relative flex w-[302px] select-none flex-col items-center justify-between rounded-2xl border border-grey-200 bg-white hover:shadow-lg`}
    >
      <div
        className={`flex w-full flex-col items-center rounded-t-2xl bg-grey-900 p-4`}
      >
        <h3 className="ltr flex flex-col items-center gap-1 text-[26px] font-semibold leading-7 text-white">
          {title.slice(0, 3).map((item, index) => (
            <span key={index}>{persianNumber(item)}</span>
          ))}
        </h3>
        <Space value={16} />
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <span className="text-sm font-normal leading-5 text-white">
            آخرین مهلت پیشنهاد گذاری
          </span>
          <div className="flex flex-row items-center justify-start gap-1 whitespace-nowrap text-xs font-normal text-white">
            <span className="ltr">
              {new Date(date * 1000).toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <VerticalLineBlue />
            <span className="ltr">
              {new Date(date * 1000).toLocaleDateString("fa-IR", {
                day: "numeric",
                year: "numeric",
                month: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-center p-3 pb-5">
        {bid === highestBid ? (
          <div className="flex h-[97px] w-full flex-col items-center justify-center rounded-md bg-biege">
            <p className="text-sm font-normal leading-5 text-grey">
              پیشنهاد شما بالاترین پیشنهاد می باشد
            </p>
            <Space value={12} />
            <p>
              <span className="text-sm font-bold leading-5 text-blue">
                {persianNumber(bid) + " "}
              </span>
              <span className="text-sm font-light leading-5 text-brown">
                تومان
              </span>
            </p>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center rounded-md bg-biege p-3">
            <div className="flex w-full flex-row items-center justify-between">
              <span className="text-sm font-normal leading-5 text-grey">
                پیشنهاد شما
              </span>
              <p>
                <span className="text-lg font-bold leading-5 text-brown">
                  {persianNumber(bid) + " "}
                </span>
                <span className="text-sm font-light leading-5 text-brown">
                  تومان
                </span>
              </p>
            </div>
            <Space value={12} />
            <HorizontalLine />
            <Space value={12} />
            <div className="flex w-full flex-row items-center justify-between">
              <span className="text-sm font-normal leading-5 text-grey">
                بالاترین پیشنهاد
              </span>
              <p>
                <span className="text-sm font-bold leading-5 text-blue">
                  {persianNumber(highestBid) + " "}
                </span>
                <span className="text-sm font-light leading-5 text-brown">
                  تومان
                </span>
              </p>
            </div>
          </div>
        )}

        <Space value={12} />
        <div className="flex w-full flex-row items-center justify-end gap-2">
          {footer}
          <div className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-blue-900">
            <Image
              src="/icons/icon-arrow-left.svg"
              alt="Enter"
              width={16}
              height={16}
            />
          </div>
        </div>
      </div>
    </button>
  );
}

function VerticalLineBlue() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}

function HorizontalLine() {
  return <div className="w-full border-t border-[#EDDCB4]" />;
}
