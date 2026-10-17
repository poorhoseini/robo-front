"use client";

import Link from "next/link";
import Space from "../general/Space";
import { ChannelMessageState } from "@/lib/entities/channelMessage";

export default function ChannelMessageCard({
  date,
  body,
  state,
  targetUrl,
  onResendClick,
}: {
  date: EpochTimeStamp;
  state: ChannelMessageState;
  body: string;
  targetUrl: string;
  onResendClick: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-end justify-start rounded-lg border border-grey-200 bg-white px-6 py-4">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <p className="text-sm font-medium leading-5 text-grey">
          <span>تاریخ ارسال پیام: </span>
          <span>
            {new Date(date * 1000).toLocaleDateString("fa-IR", {
              day: "numeric",
              year: "numeric",
              month: "numeric",
            })}
          </span>
        </p>
        <div
          className={`flex items-center justify-center rounded-[4px] px-3 py-1 text-xs font-medium leading-4 ${
            state === " با موفقیت ارسال شد "
              ? "bg-[#bde6cd] text-[#09a347]"
              : state === " ارسال ناموفق "
                ? "bg-[#f8d1d3] text-[#bd272d]"
                : "bg-biege text-brown"
          }`}
        >
          {state}
        </div>
      </div>
      <Space value={12} />
      <div className="flex w-full flex-row items-end justify-between gap-2">
        <p>
          {body
            .replace("\n\n\n", "\n")
            .replace("\n\n", "\n")
            .split(/(\n)/)
            .filter((s) => s !== "")
            .map((messageChunk, index) =>
              messageChunk === "\n" ? (
                <br key={index} />
              ) : (
                <span
                  key={index}
                  className="w-full text-sm font-medium leading-5 text-grey"
                >
                  {messageChunk}
                </span>
              ),
            )}
        </p>
        <div className="flex flex-row items-center justify-end gap-3">
          <button
            onClick={onResendClick}
            className="flex h-10 w-[132px] items-center justify-center rounded-lg bg-grey p-[10px] text-base font-semibold leading-5 text-white hover:bg-black"
          >
            ارسال دوباره
          </button>
          <Link
            href={targetUrl}
            className="flex h-10 w-[132px] items-center justify-center rounded-lg bg-grey p-[10px] text-base font-semibold leading-5 text-white hover:bg-black"
          >
            مشاهده آگهی
          </Link>
        </div>
      </div>
    </div>
  );
}
