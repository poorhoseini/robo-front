import Image from "next/image";
import React from "react";
import PackageCard from "../cards/PackageCard";
import { LandingPageCard } from "@/lib/entities/landingPage";
import { SingleSimCard } from "@/lib/entities/singleSimCard";
import { SimPack } from "@/lib/entities/simPack";
import { SimKhast } from "@/lib/entities/simKhast";
import ShopCard from "../cards/ShopCard";
import { StoreAdvertiser } from "@/lib/entities/advertiser";
import ResponsiveLink from "../general/ResponsiveLink";

type CardStackProps = {
  stackData: LandingPageCard;
  noTitle?: boolean;
  noMoreButton?: boolean;
  link?: string;
  gap?: number;
  direction?: "horizontal" | "vertical";
  blue?: boolean;
  selectedData?: LandingPageCard["data"];
  onSelect?: (item: SimKhast | SingleSimCard | SimPack) => void;
  isDashboardRoute?: boolean;
  isSubItem?: boolean;
};

export default function CardStack({
  stackData,
  noTitle = false,
  noMoreButton = false,
  link = "",
  gap = 6,
  direction = "horizontal",
  blue = false,
  selectedData,
  onSelect,
  isDashboardRoute = false,
  isSubItem = false,
}: CardStackProps) {
  const packages: LandingPageCard["data"] = stackData.data;
  let gapClasses;

  switch (gap) {
    case 3:
      gapClasses = "gap-4 md:gap-3";
      break;
    case 4:
      gapClasses = "md:gap-4 gap-4";
      break;
    case 6:
    default:
      gapClasses = "gap-4 md:gap-6";
  }

  return (
    <section className={`flex w-full flex-col items-center justify-between gap-4 ${isSubItem ? "px-0" : "px-4"} md:gap-8 md:px-0`}>
      {!noTitle && (
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div className="flex flex-row items-center gap-2">
            <Image
              src="/icons/icon-close-square.svg"
              alt={stackData.title}
              width={24}
              height={24}
              className="h-6 w-6 md:h-8 md:w-8"
            />
            <h2 className="text-sm font-bold text-grey md:text-2xl">
              {stackData.title}
            </h2>
          </div>
          {!noMoreButton && (
            <ResponsiveLink
              href={link}
              className="flex flex-row items-center justify-end gap-1.5"
            >
              <div className="flex flex-row items-center text-sm font-medium text-grey md:text-xl">
                <p className="hidden md:block">مشاهده بیشتر</p>
                <p className="block text-xs font-normal text-grey md:hidden">بیشتر</p>
              </div>
              <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-blue-900 md:h-[28px] md:w-[28px]">
                <Image
                  src="/icons/icon-arrow-left.svg"
                  alt="See More"
                  width={14}
                  height={14}
                />
              </div>
            </ResponsiveLink>
          )}
        </div>
      )}

      <div className={`w-full overflow-x-auto md:overflow-x-clip`}>
        <div
          className={`flex ${direction === "horizontal" ? "w-max min-w-full flex-row" : "w-full flex-col"} flex-nowrap items-center justify-start md:w-full md:flex-wrap ${gapClasses}`}
        >
          {stackData.cardType === "singleSim" ||
          stackData.cardType === "highBidSimcard" ||
          stackData.cardType === "offPrice" ||
          stackData.cardType === "singleSim-table" ? (
            (packages as SingleSimCard[])?.map((item) => (
              <PackageCard
                key={item._id}
                serviceType={item.serviceType}
                packageId={item._id}
                sellerSpell={[item.sellerSpel]}
                operator={item.operator}
                addvertiseTime={item.addvertiseTime}
                viewsCount={item.viewsCount}
                vip={item.vip}
                cityFa={item.cityFa}
                provinceFa={item.provinceFa}
                simCardState={item.state}
                isApprovedByExpert={item.isExpert}
                priceType={item.priceType}
                price={item.price}
                offPercent={item.offPercent}
                offPrice={item.offPrice}
                roundLevelsFa={item.rondData.rondLevelsFa}
                hasInstallment={item.isInstallment}
                installmentData={item.installmentPlan}
                isHighBid={item.isHighBid}
                highBidData={item.highBidData && item.highBidData[0]}
                blue={blue}
                selected={
                  selectedData
                    ? !!(selectedData as SingleSimCard[]).find(
                        (selectedItem) => selectedItem._id === item._id,
                      )
                    : undefined
                }
                item={item}
                onSelect={onSelect}
                isDashboardRoute={isDashboardRoute}
                isVertical={direction === "vertical"}
              />
            ))
          ) : stackData.cardType === "simPack" ||
            stackData.cardType === "highBidSimPack" ? (
            (packages as SimPack[])?.map((item) => (
              <PackageCard
                key={item._id}
                serviceType={item.serviceType}
                packageId={item._id}
                sellerSpell={item.simcards.map((simcard) => simcard.sellerSpel)}
                operator={item.simcards[0].operator}
                addvertiseTime={item.addvertiseTime}
                viewsCount={item.viewsCount}
                cityFa={item.cityFa}
                provinceFa={item.provinceFa}
                simPackType={item.simPackType}
                priceType={item.priceType}
                price={item.price}
                hasInstallment={item.isInstallment}
                installmentData={item.installmentPlan}
                isHighBid={item.isHighBid}
                highBidData={item.highBidData && item.highBidData[0]}
                blue={blue}
                selected={
                  selectedData
                    ? !!(selectedData as SimPack[]).find(
                        (selectedItem) => selectedItem._id === item._id,
                      )
                    : undefined
                }
                item={item}
                onSelect={onSelect}
                isDashboardRoute={isDashboardRoute}
                isVertical={direction === "vertical"}
              />
            ))
          ) : stackData.cardType === "simKhast" ? (
            (packages as SimKhast[])?.map((item) => (
              <PackageCard
                key={item._id}
                serviceType={item.serviceType}
                packageId={item._id}
                sellerSpell={[item.condition.sellerSpel]}
                operator={item.condition.operator}
                addvertiseTime={item.createDate}
                viewsCount={item.viewsCount}
                cityFa={item.condition.cityFa}
                provinceFa={item.condition.provinceFa}
                simCardState={item.condition.state}
                maxPrice={item.condition.maxPrice}
                minPrice={item.condition.minPrice}
                roundLevelsFa={item.condition.rondLevelsFa}
                simKhastData={{
                  offerCount: item.offerCount,
                  offerLimit: item.offerLimit,
                }}
                blue={blue}
                selected={
                  selectedData
                    ? !!(selectedData as SimKhast[]).find(
                        (selectedItem) => selectedItem._id === item._id,
                      )
                    : undefined
                }
                item={item}
                onSelect={onSelect}
                isDashboardRoute={isDashboardRoute}
                isVertical={direction === "vertical"}
              />
            ))
          ) : stackData.cardType === "store" ? (
            (packages as StoreAdvertiser[])?.map((item) => (
              <ShopCard
                key={item._id}
                shopId={item._id}
                shopName={item.storeName}
                viewsCount={item.viewsCount}
                phoneNumbers={item.numbers}
              />
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
}
