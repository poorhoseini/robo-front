import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Space from "../general/Space";

export default function MyPlanSubscriptionCard({
  title,
  totalCount,
  remainingCount,
}: {
  title: string;
  totalCount: number;
  remainingCount: number;
}) {
  return (
    <div
      className={`relative flex w-[461px] select-none flex-col items-start justify-between rounded-xl border border-grey-200 bg-white p-4`}
    >
      <h3 className="text-base font-medium leading-5 text-grey">{title}</h3>
      <Space value={12} />
      <div className="flex w-full flex-row items-center justify-between rounded-md bg-[#F7F7F7] px-4 py-3">
        <p>
          <span className="text- grey text-sm font-light leading-5">کل</span>
          <span className="text-base font-normal leading-5 text-grey">{` ${persianNumber(totalCount)} عدد`}</span>
        </p>
        <VerticalLine />
        <p>
          <span className="text- grey text-sm font-light leading-5">
            باقی مانده
          </span>
          <span className="text-base font-normal leading-5 text-grey">{` ${persianNumber(remainingCount)} عدد`}</span>
        </p>
      </div>
    </div>
  );
}

function VerticalLine() {
  return <div className="h-5 w-[1px] bg-grey-200" />;
}
