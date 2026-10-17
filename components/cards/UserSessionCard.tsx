import { userSessionBrowserSelectOptions } from "@/lib/constants/selectOptions/userSession";
import { UserSessionBrowser, UserSessionDevice } from "@/lib/entities/session";
import Image from "next/image";

export default function UserSessionCard({
  device,
  browser,
  date,
  isCurrent,
  onLogoutClick,
}: {
  device: UserSessionDevice;
  browser: UserSessionBrowser;
  date: EpochTimeStamp;
  isCurrent: boolean;
  onLogoutClick: () => void;
}) {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-1 rounded-lg border border-grey-200 bg-white px-6 py-4">
      <div className="flex w-full flex-row items-center justify-start gap-3">
        <Image
          src={
            device === "desktop"
              ? "/icons/session-desktop.svg"
              : device === "mobile"
                ? "/icons/session-mobile.svg"
                : device === "bot"
                  ? "/icons/session-bot.svg"
                  : "/icons/session-bot.svg"
          }
          alt=""
          width={32}
          height={33}
        />
        <div className="flex w-full flex-col items-start gap-4 text-sm font-normal leading-5 text-grey">
          <div className="flex w-full flex-row items-center justify-items-start gap-2">
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
            <VerticalLineBlue />
            <span className="ltr">
              {new Date(date * 1000).toLocaleTimeString("fa-IR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p>{`مرورگر: ${userSessionBrowserSelectOptions.find((option) => option.value === browser)?.label || browser}`}</p>
        </div>
      </div>
      <button
        onClick={onLogoutClick}
        className="h-9 text-nowrap rounded-md bg-[#f9eaea] px-2 py-[10px] text-sm font-medium leading-4 text-[#bd272d]"
      >
        {isCurrent ? "خروج از دستگاه های دیگر" : "خروج از این دستگاه"}
      </button>
    </div>
  );
}

function VerticalLineBlue() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}
