"use client";

import RoundDataCardSkeleton from "@/components/skeletons/RoundDataCardSkeleton";
import { RoundType } from "@/lib/entities/roundType";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { useAddSimcardActions, useRoundData } from "@/lib/zustand/addSimCard";
import Image from "next/image";

export default function AddSimCardViewRoundsStep({
  roundTypesList,
  roundDataLoading,
  roundDataError,
  handleGetRoundData,
}: {
  roundTypesList: RoundType[];
  roundDataLoading: boolean;
  roundDataError: string;
  handleGetRoundData: () => void;
}) {
  const roundData = useRoundData();
  const { setStep } = useAddSimcardActions();

  const handleContinueToNextStep = () => {
    setStep(3);
  };

  const handleStepBack = () => {
    setStep(1);
  };

  if (!!roundDataError)
    return (
      <div className="flex w-full flex-col items-center justify-center gap-2">
        <p>{roundDataError}</p>
        <button
          type="button"
          className="rounded-lg border border-blue p-3 text-blue"
          onClick={() => handleGetRoundData()}
        >
          تلاش مجدد
        </button>
      </div>
    );

  if (roundDataLoading) return <RoundDataCardSkeleton />;

  if (!roundData) return <></>;

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-8 pb-24 md:pb-0">
      <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-grey-200 bg-white p-4 md:h-full md:py-6">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-base font-medium text-grey">مشاهده نوع رندی</p>
          <div className="flex h-9 w-[124px] flex-row items-center justify-center gap-2 rounded-lg bg-biege">
            <p className="text-sm font-medium text-brown">تعداد رندی</p>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <p className="text-xs font-normal leading-normal text-brown">
                {persianNumber(roundData.rondData.length)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-3">
          {roundData.rondData.map((item, index) => (
            <div
              key={index}
              className="flex w-full flex-row items-start justify-between gap-1"
            >
              <div className="flex flex-row items-start gap-1">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-biege text-[10px] font-normal leading-normal text-orange">
                  {persianNumber(index + 1)}
                </div>
                <div className="flex flex-col items-start gap-1">
                  <p className="text-sm font-normal text-grey">
                    {item.rondLevelFa}
                  </p>
                  <p className="text-xs font-normal text-grey-700">
                    {
                      roundTypesList.find(
                        (roundType) => roundType.rondLevel === item.rondLevel,
                      )?.desc
                    }
                  </p>
                </div>
              </div>
              <p className="ltr text-nowrap text-sm font-medium text-grey">
                {persianNumber(item.spell.join("   "))}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
        <button
          onClick={handleContinueToNextStep}
          className="flex h-12 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          ادامه
        </button>
      </div>
      <div className="hidden w-full flex-row items-center justify-center gap-4 md:flex">
        <button
          onClick={handleContinueToNextStep}
          className="flex h-14 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          تایید
        </button>
        <button
          type="button"
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
