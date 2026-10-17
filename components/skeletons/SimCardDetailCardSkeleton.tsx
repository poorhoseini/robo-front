import Image from "next/image";
import { ServiceType } from "@/lib/entities/landingPage";
import Link from "next/link";
import { Skeleton } from "@mui/material";
import BookmarkButtonSkeleton from "./BookmarkButtonSkeleton";
import PriceBoxSkeleton from "./PriceBoxSkeleton";
import SpecificationsBoxSkeleton from "./SpecificationsBoxSkeleton";

type SimCardDetailCardProps = {
  title: string;
  itemDetail: {
    serviceType: ServiceType;
    priceData: {
      priceType: number;
    };
  };
};

export default function SimCardDetailCardSkeleton({
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
              <Skeleton variant="rounded" width={67} height={16} />
            </div>
            <div className="flex flex-row items-center gap-1 text-sm font-normal text-grey">
              <Image
                src="/icons/icon-eye.svg"
                alt="Seen Count"
                width={16}
                height={16}
              />
              <Skeleton variant="rounded" width={31} height={16} />
            </div>
          </div>
          <Link href="/" className="flex md:hidden">
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
            <BookmarkButtonSkeleton />
          </div>
        </div>
        <div className="flex w-full flex-col items-center px-6 md:px-0">
          <div className="my-6 flex w-full flex-col items-center gap-4 rounded-xl bg-primary p-4">
            {new Array(
              itemDetail.serviceType === "simPack" ||
              itemDetail.serviceType === "simPackHighBid"
                ? 3
                : 1,
            )
              .fill(1)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex w-full flex-row items-center justify-center gap-4"
                >
                  <Skeleton variant="circular" width={44} height={44} />
                  <Skeleton variant="rounded" width={208} height={20} />
                </div>
              ))}
          </div>
          <div className="flex w-full flex-col items-start justify-center gap-4 text-base font-medium text-grey md:hidden">
            <h3>{title}</h3>
            <div className="flex w-full flex-row items-center justify-between">
              <Skeleton variant="rounded" width={140} height={20} />
              <div className="flex flex-row items-center gap-1 text-xs font-medium text-grey-800">
                <Image
                  src="/icons/icon-eye.svg"
                  alt="Seen Count"
                  width={12}
                  height={10}
                />
                <Skeleton variant="rounded" width={31} height={16} />
              </div>
            </div>
            <HorizontalLine />
          </div>
          <div className="flex w-full flex-col items-center gap-2">
            <PriceBoxSkeleton
              serviceType={itemDetail.serviceType}
              priceType={itemDetail.priceData.priceType}
            />
          </div>
          <SpecificationsBoxSkeleton />
        </div>
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}
