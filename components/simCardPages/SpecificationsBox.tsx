import { Installment } from "@/lib/entities/installment";
import { SimPackType } from "@/lib/entities/simPack";
import {
  getSimCardLevelIconUrl,
  getSimCardLevelLabel,
  getSimCardSaleConditionsLabel,
  getSimCardStateLabel,
  getSimCardTypeLabel,
  getSimPackTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import LoanDialog from "./LoanDialog";
import RoundListDialog from "./RoundListDialog";
import { RoundData } from "@/lib/entities/round";
import RoundListCard from "./RoundListCard";

type SpecificationBoxProps = {
  isPanel: boolean;
  simCardLevel?: number;
  simPackType?: SimPackType;
  simCardType?: number;
  preNumber?: string;
  code?: number;
  simCardStatus?: number;
  provinceFa: string;
  cityFa: string;
  priceType?: number;
  hasInstallment: boolean | "X";
  installmentPlan: Installment[];
  roundData?: RoundData;
};

export default function SpecificationsBox({
  isPanel,
  simCardLevel,
  simPackType,
  simCardType,
  preNumber,
  code,
  simCardStatus,
  provinceFa,
  cityFa,
  priceType,
  hasInstallment,
  installmentPlan,
  roundData,
}: SpecificationBoxProps) {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-3 md:mt-6">
      <div className="flex w-full flex-col items-center gap-3 md:hidden">
        <HorizontalLine />
        <div className="flex w-full flex-row items-center justify-around pt-2 text-sm text-grey">
          {simCardType !== undefined && (
            <>
              <div className="flex flex-col items-center gap-2">
                <p className="font-light">نوع</p>
                <p className="font-medium">
                  {getSimCardTypeLabel(simCardType)}
                </p>
              </div>
              <VerticalLine />
            </>
          )}
          {!!simCardLevel && (
            <>
              <div className="flex flex-col items-center gap-2">
                <p className="font-light">سطح</p>
                <div className="flex flex-row items-center gap-1 font-medium">
                  <Image
                    src={getSimCardLevelIconUrl(simCardLevel)}
                    alt="VIP"
                    width={12}
                    height={12}
                  />
                  <p className="font-medium">
                    {getSimCardLevelLabel(simCardLevel)}
                  </p>
                </div>
              </div>
              <VerticalLine />
            </>
          )}
          {simCardStatus !== undefined && (
            <>
              <div className="flex flex-col items-center gap-2">
                <p className="font-light">وضعیت</p>
                <p className="font-medium">
                  {getSimCardStateLabel(simCardStatus)}
                </p>
              </div>
            </>
          )}
        </div>
        <HorizontalLine />
      </div>
      {!!simCardLevel && (
        <div className="hidden w-full flex-col gap-3 md:flex">
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">سطح سیم کارت</p>
            <div className="flex flex-row items-center gap-1">
              <Image
                src={getSimCardLevelIconUrl(simCardLevel)}
                alt="VIP"
                width={12}
                height={12}
              />
              <p className="font-medium">
                {getSimCardLevelLabel(simCardLevel)}
              </p>
            </div>
          </div>
          <HorizontalLine />
        </div>
      )}
      {!!simPackType && (
        <>
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">نوع</p>
            <p className="font-medium">{getSimPackTypeLabel(simPackType)}</p>
          </div>
          <HorizontalLine />
        </>
      )}
      {simCardType !== undefined && (
        <div className="hidden w-full flex-col gap-3 md:flex">
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">نوع</p>
            <p className="font-medium">{getSimCardTypeLabel(simCardType)}</p>
          </div>
          <HorizontalLine />
        </div>
      )}
      {preNumber !== undefined && (
        <>
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">پیش شماره</p>
            <p className="font-medium">{persianNumber(preNumber)}</p>
          </div>
          <HorizontalLine />
        </>
      )}
      {code !== undefined && (
        <>
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">کد</p>
            <p className="font-medium">{persianNumber(code)}</p>
          </div>
          <HorizontalLine />
        </>
      )}
      <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
        <p className="font-normal">استان</p>
        <p className="font-medium">{provinceFa}</p>
      </div>
      <HorizontalLine />
      <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
        <p className="font-normal">شهر</p>
        <p className="font-medium">{cityFa}</p>
      </div>
      {simCardStatus !== undefined && (
        <div className="hidden w-full flex-col gap-3 md:flex">
          <HorizontalLine />
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">وضعیت</p>
            <p className="font-medium">{getSimCardStateLabel(simCardStatus)}</p>
          </div>
        </div>
      )}
      {priceType !== undefined && (
        <>
          <HorizontalLine />
          <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
            <p className="font-normal">شرایط</p>
            <p className="font-medium">
              {getSimCardSaleConditionsLabel(priceType, hasInstallment)}
            </p>
          </div>
        </>
      )}
      {!!installmentPlan && !!installmentPlan.length && (
        <LoanDialog isRemovable={isPanel} installmentPlan={installmentPlan} />
      )}
      {!!roundData?.rondData && !!roundData?.rondData.length && (
        <RoundListDialog
          roundData={roundData}
          content={<RoundListCard rondData={roundData} />}
        />
      )}
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}

function VerticalLine() {
  return <div className="h-12 w-[1px] bg-grey-100" />;
}
