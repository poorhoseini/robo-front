import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Space from "../general/Space";
import { getRemainingTimeDHM } from "@/lib/helpers/timeDifference";

export default function MyPlanCard({
  title,
  onClick,
  period,
  expireDate,
}: {
  title: string;
  onClick: () => void;
  period: number;
  expireDate: EpochTimeStamp;
}) {
  return (
    <button
      onClick={() => onClick()}
      className={`relative flex w-[461px] select-none flex-col items-center justify-between rounded-xl border border-grey-200 bg-white p-4 hover:shadow-lg`}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <h3 className="text-base font-medium leading-5 text-grey">{title}</h3>
        <div className="rounded-lg bg-[#22A958] px-3 py-1">
          <span className="text-sm font-medium leading-5 text-white">فعال</span>
        </div>
      </div>
      <Space value={24} />
      <div className="flex w-full flex-row items-center justify-between rounded-md bg-[#F7F7F7] px-4 py-3">
        <span className="text-base font-normal leading-5 text-grey">
          زمان باقی‌مانده از اشتراک
        </span>
        <span className="text-base font-medium leading-5 text-grey">
          {persianNumber(
            `${getRemainingTimeDHM(expireDate).days} روز از ${period} روز`,
          )}
        </span>
      </div>
    </button>
  );
}
