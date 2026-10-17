import getRoundTypes from "@/lib/api/getRoundTypeList";
import { RoundData } from "@/lib/entities/round";
import { GetRoundTypesResponseProps } from "@/lib/entities/roundType";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import ResponsiveLink from "../general/ResponsiveLink";
import { Fragment } from "react";

type RoundListCardProps = {
  rondData: RoundData;
};

export default async function RoundListCard({ rondData }: RoundListCardProps) {
  const RoundTypesResponse: GetRoundTypesResponseProps = await getRoundTypes();
  const roundTypesData = RoundTypesResponse.data;

  const roundTypesList = Object.values(roundTypesData);

  return (
    <div className="flex w-full flex-col items-center justify-start gap-8 rounded-2xl bg-white text-grey md:w-[916px] md:p-8">
      <p className="w-full text-start text-sm font-normal text-grey md:text-lg md:font-medium">
        {` این سیم کارت دارای ${persianNumber(rondData.rondData.length)} نوع رندی است:`}
      </p>
      <div className="flex w-full flex-col items-center gap-4">
        {rondData.rondData.map((item, index) => (
          <Fragment key={index}>
            <ResponsiveLink
              href={`/search?roundTypes=${item.rondId}`}
              className="flex w-full flex-row items-center justify-between gap-2"
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex flex-row items-center gap-3">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-biege text-[10px] font-normal text-orange md:h-6 md:w-6 md:text-xs">
                    {persianNumber(index + 1)}
                  </div>
                  <p className="text-sm font-medium md:text-base">
                    {item.rondLevelFa}
                  </p>
                </div>
                <p className="mr-7 text-xs font-normal text-grey-700 md:mr-9 md:text-sm">
                  {
                    roundTypesList.find(
                      (roundType) => roundType.rondLevel === item.rondLevel,
                    )?.desc
                  }
                </p>
              </div>
              <div className="flex flex-row items-center gap-8">
                <p className="ltr whitespace-pre pt-1 text-sm font-medium md:text-[15px] md:font-semibold">
                  {persianNumber(item.spell.join("   "))}
                </p>
                <Image
                  src="/icons/icon-chevron-left.svg"
                  alt="Show more"
                  width={24}
                  height={24}
                  className="hidden md:block"
                />
              </div>
            </ResponsiveLink>
            {index !== rondData.rondData.length - 1 && <HorizontalLine />}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full bg-grey-200" />;
}
