"use client";

import {
  getSimCardPriceTypeLabel,
  getSimCardStateLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import { useMemo } from "react";
import {
  useStatus,
  useProvince,
  useCity,
  usePriceType,
  usePrice,
  useHasInstallmentPlan,
  useLoanId,
  useAddSimcardActions,
  useMyInstallmentPlans,
  useDigits,
} from "@/lib/zustand/addSimCard";
import InstallmentPlanSkeleton from "@/components/skeletons/InstallmentPlanSkeleton";

export default function AddSimCardPreviewStep({
  serviceName,
  isHighestBid = false,
  installmentsLoading,
  installmentsError,
  handleGetMyInstallmentPlans,
}: {
  serviceName: string;
  isHighestBid: boolean;
  installmentsLoading: boolean;
  installmentsError: boolean;
  handleGetMyInstallmentPlans: () => void;
}) {
  const status = useStatus();
  const province = useProvince();
  const city = useCity();
  const priceType = usePriceType();
  const price = usePrice();
  const hasInstallmentPlan = useHasInstallmentPlan();
  const loanId = useLoanId();
  const myInstallmentPlans = useMyInstallmentPlans();
  const { setStep, saveCurrentItem, flush } = useAddSimcardActions();
  const phoneNumber = "09" + useDigits();

  const selectedInstallmentPlan = useMemo(() => {
    return myInstallmentPlans.find((item) => item._id === loanId);
  }, [myInstallmentPlans, loanId]);

  const selectedInstallmentPlanIndex = useMemo(() => {
    return myInstallmentPlans.findIndex((item) => item._id === loanId);
  }, [myInstallmentPlans, loanId]);

  const handleSubmitSimCard = () => {
    saveCurrentItem();
    setStep(5);
    flush();
  };

  const handleStepBack = () => {
    setStep(3);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between pb-24 md:pb-0">
      <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-white p-4 md:p-0">
        <div className="flex w-full items-center justify-center rounded-xl bg-primary p-4">
          <p className="text-3xl font-medium text-white">
            {persianNumber(phoneNumber)}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-grey-200 p-6">
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع درخواست</p>
            <p className="text-base font-medium text-grey">{serviceName}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">شرایط سیم کارت</p>
            <p className="text-base font-medium text-grey">
              {getSimCardStateLabel(Number(status))}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">استان و شهر</p>
            <p className="text-base font-medium text-grey">
              {province?.name + "/ " + city?.name}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع قیمت گذاری</p>
            <p className="text-base font-medium text-grey">
              {getSimCardPriceTypeLabel(isHighestBid ? 2 : Number(priceType))}
            </p>
          </div>
          {priceType === "0" && (
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-sm font-normal text-grey">قیمت</p>
              <div className="flex flex-row items-center gap-[2px]">
                <p className="text-xl font-bold text-grey">
                  {persianNumber(Number(price))}
                </p>
                <p className="text-sm font-light text-grey">تومان</p>
              </div>
            </div>
          )}
          {isHighestBid && (
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-sm font-normal text-grey">قیمت پایه</p>
              <div className="flex flex-row items-center gap-[2px]">
                <p className="text-xl font-bold text-grey">
                  {persianNumber(Number(price))}
                </p>
                <p className="text-sm font-light text-grey">تومان</p>
              </div>
            </div>
          )}
        </div>
        {installmentsError && (
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <p>دریافت لیست شرایط اقساطی شما با مشکل مواجه شد!</p>
            <button
              type="button"
              className="rounded-lg border border-blue p-3 text-blue"
              onClick={handleGetMyInstallmentPlans}
            >
              تلاش مجدد
            </button>
          </div>
        )}
        {installmentsLoading && hasInstallmentPlan && (
          <InstallmentPlanSkeleton />
        )}
        {hasInstallmentPlan &&
          !!selectedInstallmentPlan &&
          !installmentsError &&
          !installmentsLoading && (
            <div className="flex w-full flex-col items-center gap-[14px] rounded-lg border border-grey-200 bg-neutral p-6">
              <div className="flex w-full flex-row items-center justify-between">
                <h3 className="text-sm font-medium leading-normal text-grey">
                  {"شرایط قسط " +
                    persianNumber(selectedInstallmentPlanIndex + 1)}
                </h3>
                <div className="flex h-6 w-[68px] items-center justify-center rounded-xl bg-biege px-3 py-[2px]">
                  <p className="text-[10px] font-medium leading-normal text-brown">
                    {persianNumber(selectedInstallmentPlan.profitPercent) +
                      "٪ سود"}
                  </p>
                </div>
              </div>
              <div className="mt-2 flex w-full flex-row items-center justify-between">
                <h3 className="text-xs font-normal text-grey">
                  حداقل/حداکثر دوره بازپرداخت
                </h3>
                <p className="text-sm font-medium text-grey">
                  {persianNumber(selectedInstallmentPlan.minimumMonth) +
                    " ماهه/ " +
                    persianNumber(selectedInstallmentPlan.maximumMonth) +
                    " ماهه"}
                </p>
              </div>
              <HorizontalLine />
              <div className="flex w-full flex-row items-center justify-between">
                <h3 className="text-sm font-normal text-grey">پیش پرداخت</h3>
                <p className="text-sm font-medium text-grey">
                  {"حداقل " +
                    persianNumber(selectedInstallmentPlan.preFound) +
                    " درصد"}
                </p>
              </div>
            </div>
          )}
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
        <button
          onClick={handleSubmitSimCard}
          className="flex h-12 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          ادامه
        </button>
      </div>
      <div className="hidden w-full flex-row items-center justify-center gap-4 md:flex">
        <button
          onClick={handleSubmitSimCard}
          className="flex h-14 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          تایید
        </button>
        <button
          onClick={handleStepBack}
          className="flex h-14 min-w-14 items-center justify-center rounded-xl border border-grey bg-white"
        >
          <Image
            src="/icons/icon-arrow-left-grey.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="w-full border-b border-grey-200" />;
}
