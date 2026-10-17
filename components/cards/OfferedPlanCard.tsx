import { Plan } from "@/lib/entities/plan";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import Space from "../general/Space";
import CustomButton from "../general/CustomButton";

export default function OfferedPlanCard({
  plan,
  onBuyClick,
  buttonLoading,
}: {
  plan: Plan;
  onBuyClick: () => void;
  buttonLoading: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-start rounded-2xl border border-grey-200 bg-white p-6">
      <div className="flex flex-row items-center justify-start gap-1">
        <h3 className="text-base font-medium leading-5 text-grey">
          {plan.serviceNameFa}
        </h3>
        <div className="rounded-lg bg-biege px-2 py-[2px] text-[10px] font-medium leading-5 text-brown">
          {persianNumber(plan.period) + " روزه"}
        </div>
      </div>
      <Space value={24} />
      <div className="flex w-full flex-row flex-wrap items-start gap-5">
        {plan.subList.map((subItem, subIndex) => (
          <div
            key={subIndex}
            className="flex w-[434px] flex-row items-center justify-start gap-2"
          >
            <Image
              src="/icons/icon-check-biege-circle.svg"
              alt=""
              width={18}
              height={18}
            />
            <p>
              <span>{persianNumber(subItem.counter)} عدد</span>
              <span>{subItem.serviceNameFa}</span>
            </p>
          </div>
        ))}
      </div>
      <Space value={16} />
      <div className="flex w-full flex-row items-center justify-between">
        <p className="leading-5 text-grey">
          <span className="text-xl font-bold">{persianNumber(plan.price)}</span>
          <span className="text-sm font-light"> تومان</span>
        </p>
        <div className="w-[218px]">
          <CustomButton
            label="خرید اشتراک"
            loading={buttonLoading}
            handleSubmit={onBuyClick}
          />
        </div>
      </div>
    </div>
  );
}
