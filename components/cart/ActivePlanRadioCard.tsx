import { Radio } from "@mui/material";

export default function AvailablePlanRadioCard({
  title,
  period,
  remainingDays,
  totalSubscriptionsCount,
  remainingSubscriptionsCount,
  checked,
  onClick,
}: {
  title: string;
  period: string;
  remainingDays?: string;
  totalSubscriptionsCount: string;
  remainingSubscriptionsCount: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer flex-col items-center gap-5 rounded-lg border border-grey-200 bg-white p-4"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-start gap-1">
          <Radio
            checked={checked}
            value={"subscription"}
            sx={{
              padding: "0 !important",
            }}
          />
          <h3 className="text-base font-medium leading-5 text-grey">{title}</h3>
        </div>
        <div className="rounded-lg bg-biege px-2 py-[2px] text-[10px] font-medium leading-5 text-brown">
          {period}
        </div>
      </div>
      {!!remainingDays && (
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="text-base font-normal leading-5 text-grey">
            زمان باقی‌مانده از اشتراک
          </h3>
          <p className="text-sm font-medium leading-5 text-grey">
            {remainingDays}
          </p>
        </div>
      )}
      <div className="flex w-full flex-row items-start justify-between rounded-md bg-[#F7F7F7] p-2">
        <div className="flex w-1/2 flex-col items-center gap-1 border-l border-grey-100">
          <p className="text-xs font-light leading-5 text-grey">کل اشتراکات</p>
          <p className="text-sm font-normal leading-5 text-grey">
            {totalSubscriptionsCount}
          </p>
        </div>
        <div className="flex w-1/2 flex-col items-center gap-1">
          <p className="text-xs font-light leading-5 text-grey">
            اشتراکات باقی‌مانده
          </p>
          <p className="text-sm font-normal leading-5 text-grey">
            {remainingSubscriptionsCount}
          </p>
        </div>
      </div>
    </div>
  );
}
