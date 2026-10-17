import { Operator } from "@/lib/entities/operator";
import { getSimCardOperatorIconUrl } from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { getElapsetTime } from "@/lib/helpers/timeDifference";
import Image from "next/image";
import PriceBox from "./PriceBox";
import LoanBox from "./LoanBox";
import { Installment } from "@/lib/entities/installment";
import SpecificationsBox from "./SpecificationsBox";
import { SimPackType } from "@/lib/entities/simPack";
import RoundListBox from "./RoundListBox";
import BookmarkButton from "./BookmarkButton";
import { ServiceType } from "@/lib/entities/landingPage";
import Link from "next/link";
import { RoundData, RoundLevelFa } from "@/lib/entities/round";

type SimCardDetailCardProps = {
  isPanel?: boolean;
  title: string;
  itemDetail: {
    id: string;
    serviceType: ServiceType;
    createTime: EpochTimeStamp;
    viewsCount: number;
    simCards: {
      sellerSpel: string;
      operator?: Operator;
    }[];
    priceData: {
      isApprovedByExpert?: boolean;
      price?: number;
      startPrice?: number;
      minPrice?: number;
      maxPrice?: number;
      offPercent?: number;
      offPrice?: number;
      priceType?: number;
    };
    loanData: {
      hasInstallment: boolean | "X";
      installmentPlan?: Installment[];
    };
    roundData?: RoundData;
    rondLevelsFa?: RoundLevelFa[];
    specificationsData: {
      simCardLevel?: number;
      simPackType?: SimPackType;
      simCardType?: number;
      preNumber?: string;
      code?: number;
      simCardStatus?: number;
      provinceFa: string;
      cityFa: string;
    };
  };
};

export default function SimCardDetailCard({
  isPanel = false,
  title,
  itemDetail,
}: SimCardDetailCardProps) {
  return (
    <div className="flex w-full flex-col items-center justify-start gap-2 md:min-w-[420px]">
      <div className="hidden h-[68px] w-full items-center justify-center rounded-t-2xl bg-biege text-xl font-medium text-grey md:flex">
        <h3>{title}</h3>
      </div>
      <div className="flex w-full flex-col items-center justify-between rounded-b-2xl bg-white md:p-6">
        <div className="flex w-full flex-row items-center justify-between gap-2 p-4 md:p-0">
          <div className="hidden flex-row items-center gap-3 md:flex">
            <div className="flex flex-row items-center gap-1 border-l border-blue pl-3 text-sm font-normal text-grey">
              <Image
                src="/icons/icon-calendar.svg"
                alt="Registeration Date"
                width={16}
                height={16}
              />
              <p>{getElapsetTime(itemDetail.createTime)}</p>
            </div>
            <div className="flex flex-row items-center gap-1 text-sm font-normal text-grey">
              <Image
                src="/icons/icon-eye.svg"
                alt="Seen Count"
                width={16}
                height={16}
              />
              <p>{persianNumber(itemDetail.viewsCount)}</p>
            </div>
          </div>
          <Link
            href={
              !isPanel
                ? "/"
                : itemDetail.serviceType === "simcard" ||
                    itemDetail.serviceType === "simcardHighBid"
                  ? "/dashboard/my-simcards"
                  : itemDetail.serviceType === "simPack" ||
                      itemDetail.serviceType === "simPackHighBid"
                    ? "/dashboard/my-sim-packs"
                    : itemDetail.serviceType === "specialSim"
                      ? "/dashboard/my-sim-khasts"
                      : "/"
            }
            className="flex md:hidden"
          >
            <Image
              src="/icons/icon-chevron-right-black.svg"
              alt="Back"
              width={8}
              height={14}
            />
          </Link>
          <div className="flex flex-row items-center justify-end gap-3 md:gap-2">
            <button>
              <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-blue-900 md:flex">
                <Image
                  src="/icons/icon-report.svg"
                  alt="Report"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex items-center justify-center md:hidden">
                <Image
                  src="/icons/icon-report-black.svg"
                  alt="Report"
                  width={24}
                  height={24}
                />
              </div>
            </button>
            <button>
              <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-blue-900 md:flex">
                <Image
                  src="/icons/icon-share.svg"
                  alt="Share"
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex items-center justify-center md:hidden">
                <Image
                  src="/icons/icon-share-black.svg"
                  alt="Share"
                  width={24}
                  height={24}
                />
              </div>
            </button>
            <BookmarkButton
              id={itemDetail.id}
              serviceType={itemDetail.serviceType}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center px-6 md:px-0">
          <div className="my-6 flex w-full flex-col items-center gap-4 rounded-xl bg-primary p-4">
            {itemDetail.simCards.map((simCard, index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center justify-center gap-4"
              >
                {!!simCard.operator && (
                  <Image
                    src={getSimCardOperatorIconUrl(simCard.operator)}
                    alt="Operator Logo"
                    width={44}
                    height={44}
                  />
                )}
                <p className="ltr text-3xl font-medium text-white md:text-[26px] md:font-semibold">
                  {persianNumber(simCard.sellerSpel)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-4 text-base font-medium text-grey md:hidden">
            <h3>{title}</h3>
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-sm font-normal text-grey">
                {`${getElapsetTime(itemDetail.createTime)} در ${itemDetail.specificationsData.provinceFa} / ${itemDetail.specificationsData.cityFa}`}
              </p>
              <div className="flex flex-row items-center gap-1 text-xs font-medium text-grey-800">
                <Image
                  src="/icons/icon-eye.svg"
                  alt="Seen Count"
                  width={12}
                  height={10}
                />
                <p>{persianNumber(itemDetail.viewsCount)}</p>
              </div>
            </div>
            <HorizontalLine />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <PriceBox isRemovable={isPanel} {...itemDetail.priceData} />
            {itemDetail.loanData.hasInstallment === true && (
              <LoanBox
                isRemovable={isPanel}
                installmentPlan={itemDetail.loanData.installmentPlan || []}
              />
            )}
            {!!itemDetail.rondLevelsFa &&
              itemDetail.serviceType === "specialSim" && (
                <RoundListBox rondLevelsFa={itemDetail.rondLevelsFa} />
              )}
          </div>
          <SpecificationsBox
            isPanel={isPanel}
            {...itemDetail.specificationsData}
            priceType={itemDetail.priceData.priceType}
            hasInstallment={itemDetail.loanData.hasInstallment}
            installmentPlan={itemDetail.loanData.installmentPlan || []}
            roundData={itemDetail?.roundData}
          />
        </div>
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}
