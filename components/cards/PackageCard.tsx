"use client";

import { Installment } from "@/lib/entities/installment";
import { ServiceType } from "@/lib/entities/landingPage";
import { Operator } from "@/lib/entities/operator";
import { RoundLevelFa } from "@/lib/entities/round";
import { SimPack, SimPackType } from "@/lib/entities/simPack";
import {
  getSimCardLevelIconUrl,
  getSimCardLevelLabel,
  getSimCardOperatorIconUrl,
  getSimCardOperatorLabel,
  getSimCardStateLabel,
  getSimPackTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { getElapsetTime, getRemainingTime } from "@/lib/helpers/timeDifference";
import Image from "next/image";
import ResponsiveLink from "../general/ResponsiveLink";
import React, { ReactNode, useState } from "react";
import Num2persian from "num2persian";
import { SimKhast } from "@/lib/entities/simKhast";
import { SingleSimCard } from "@/lib/entities/singleSimCard";

type PackageCardProps = {
  serviceType: ServiceType;
  packageId?: string;
  sellerSpell: string[];
  operator?: Operator;
  addvertiseTime?: EpochTimeStamp;
  viewsCount?: number;
  vip?: number;
  cityFa: string;
  provinceFa: string;
  simCardState?: number;
  simPackType?: SimPackType;
  isApprovedByExpert?: boolean;
  priceType?: number;
  price?: number;
  offPercent?: number;
  offPrice?: number;
  minPrice?: number | "X";
  maxPrice?: number | "X";
  roundLevelsFa?: RoundLevelFa[];
  hasInstallment?: boolean;
  installmentData?: Installment[];
  isHighBid?: boolean;
  highBidData?: {
    expireDate: EpochTimeStamp;
    _id: string;
  };
  simKhastData?: {
    offerCount: number;
    offerLimit: number;
  };
  blue?: boolean;
  accordion?: boolean;
  onDelete?: () => void;
  selected?: boolean;
  item?: SimKhast | SingleSimCard | SimPack;
  onSelect?: (item: SimKhast | SingleSimCard | SimPack) => void;
  isDashboardRoute?: boolean;
  isVertical?: boolean;
};

export default function PackageCard({
  serviceType,
  packageId,
  sellerSpell = ["نامشخص"],
  operator = "all",
  addvertiseTime = 0,
  viewsCount = 0,
  vip = 0,
  cityFa,
  provinceFa,
  simCardState = 10,
  simPackType,
  isApprovedByExpert,
  roundLevelsFa,
  priceType,
  price = 0,
  minPrice = 0,
  maxPrice = 0,
  offPercent = 0,
  offPrice = 0,
  hasInstallment = false,
  isHighBid = false,
  highBidData,
  simKhastData,
  blue = false,
  accordion = false,
  onDelete = () => {},
  selected,
  item,
  onSelect,
  isDashboardRoute = false,
  isVertical = false,
}: PackageCardProps) {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  const isDeactivated = item?.isActive === false;
  const isReserved = priceType === 4;
  const isHighestBidExpired =
    priceType === 2 &&
    highBidData?.expireDate &&
    Date.now() < highBidData.expireDate;
  const isDeactivatedStyle = isDeactivated || isReserved || isHighestBidExpired;

  let route = "";
  let queryParams = "";
  let targetId = packageId;

  if (isDashboardRoute) {
    switch (serviceType) {
      case "specialSim":
        route = "dashboard/my-sim-khasts";
        break;
      case "simPackHighBid":
      case "simcardHighBid":
        route = "dashboard/my-highest-bids";
        queryParams = `highestBidType=${serviceType === "simPackHighBid" ? "simPack" : "simcard"}`;
        break;
      case "simPack":
        route = "dashboard/my-sim-packs";
        break;
      case "simcard":
        route = "dashboard/my-simcards";
        break;
    }
  } else {
    switch (serviceType) {
      case "specialSim":
        route = "sim-khast";
        break;
      case "simPackHighBid":
      case "simcardHighBid":
        route = "highest-bid";
        targetId = highBidData?._id || "";
        queryParams = `highestBidType=${serviceType === "simPackHighBid" ? "simPack" : "simcard"}`;
        break;
      case "simcard":
        route = "single-sim-card";
        break;
      case "simPack":
        if (priceType === 2) {
          route = "highest-bid";
          targetId = highBidData?._id || "";
          queryParams = `highestBidType=${"simPack"}`;
        } else {
          route = "sim-pack";
        }
        break;
      default:
        route = "*-*";
        break;
    }
  }

  const badge1: ReactNode =
    serviceType === "simPack" ? (
      <PackageBadge label={`${Num2persian(sellerSpell.length)} سیم کارت`} />
    ) : roundLevelsFa && roundLevelsFa.length ? (
      <PackageBadge label="تعداد رندی" roundCount={roundLevelsFa.length} />
    ) : (
      <PackageBadge label="رند معمولی" />
    );

  const badge2: ReactNode =
    serviceType === "specialSim" ? (
      <PackageBadge label="سیم خواست" />
    ) : priceType === 2 ? (
      <PackageBadge label="بالاترین پیشنهاد" />
    ) : priceType === 3 ? (
      <PackageBadge label={`با ${persianNumber(offPercent)} درصد تخفیف`} />
    ) : priceType === 4 ? (
      <PackageBadge label="قابل رزرو" />
    ) : hasInstallment ? (
      <PackageBadge label="قسطی" />
    ) : undefined;

  const footer: ReactNode =
    serviceType === "simPackHighBid" || serviceType === "simcardHighBid" || priceType === 2 ? (
      <div className="flex flex-row items-center gap-1 text-xs font-medium text-grey">
        <p>ثبت پیشنهاد تا&nbsp;</p>
        <span className="text-blue font-bold">
          {highBidData?.expireDate ? getRemainingTime(highBidData.expireDate) : "۶۰:۱ دیگر"}
        </span>
      </div>
    ) : serviceType === "specialSim" ? (
      <div className="flex flex-row items-center gap-1 text-xs font-medium text-grey">
        <p>ثبت پیشنهاد&nbsp;</p>
        <span className="text-blue font-bold">
          {`${persianNumber((simKhastData?.offerLimit || 0) - (simKhastData?.offerCount || 0))} پیشنهاد باقی مانده`}
        </span>
      </div>
    ) : priceType === 4 ? (
      <p className="text-xs font-medium text-grey">همین حالا رزرو کنید</p>
    ) : (
      <p className="text-xs font-medium text-grey">اطلاعات تماس</p>
    );

  return (
    <PackageCardWrapper
      serviceType={serviceType}
      numbersCount={sellerSpell.length}
      accordion={accordion}
      selected={selected}
      item={item}
      onSelect={onSelect}
      open={open}
      route={route}
      targetId={targetId}
      queryParams={queryParams}
      blue={blue}
      isVertical={isVertical}
    >
      <div
        className={`flex w-full flex-row items-center justify-between bg-grey-900 p-4 md:p-3 ${accordion ? "rounded-t-xl" : "rounded-xl"}`}
      >
        {accordion && (
          <button
            type="button"
            className="flex h-4 w-4 min-w-4 items-center justify-center md:h-6 md:w-6 md:min-w-6"
            onClick={onDelete}
          >
            <Image
              src="/icons/icon-garbage.svg"
              alt="Remove Item"
              sizes="(max-width: 900px) 16px, 24px"
              width={24}
              height={24}
              className="h-full w-full"
            />
          </button>
        )}
        <div className="flex w-full flex-col items-center justify-between gap-4">
          <div
            className={`flex flex-col items-center justify-center ${!accordion && (serviceType === "simPack" || serviceType === "simPackHighBid") ? "min-h-28 gap-3" : ""}`}
          >
            {sellerSpell
              .slice(0, accordion ? sellerSpell.length : 3)
              .map((spell, index) => {
                const raw = String(spell).replace(/\s+/g, "");
                const formatted =
                  raw.length === 11
                    ? `${raw.slice(0, 3)} ${raw.slice(3, 6)} ${raw.slice(6, 8)} ${raw.slice(8)}`
                    : spell;
                return (
                  <h3
                    key={index}
                    className={`ltr flex text-white ${accordion ? "text-base font-semibold leading-5 md:text-[24px]" : "text-lg font-bold leading-5 tracking-wider md:text-[22px]"}`}
                  >
                    {persianNumber(formatted)}
                  </h3>
                );
              })}
          </div>
          {!accordion && (
            <div className="flex w-full flex-row items-center justify-center gap-1.5 whitespace-nowrap text-[11px] font-normal text-white/90">
              {serviceType === "simcard" && (
                <>
                  <div className="flex flex-row items-center gap-1">
                    <Image
                      src={getSimCardOperatorIconUrl(operator)}
                      alt="Operator"
                      width={14}
                      height={14}
                    />
                    <p>{getSimCardOperatorLabel(operator)}</p>
                  </div>
                  <div className="h-3 w-[1px] bg-white/20" />
                </>
              )}
              <div className="flex flex-row items-center gap-1">
                <Image
                  src="/icons/icon-calendar.svg"
                  alt="Creation Time"
                  width={12}
                  height={12}
                />
                <p>{getElapsetTime(addvertiseTime)}</p>
              </div>
              <div className="h-3 w-[1px] bg-white/20" />
              <div className="flex flex-row items-center gap-1">
                <Image
                  src="/icons/icon-eye.svg"
                  alt="Visited Count"
                  width={12}
                  height={12}
                />
                <p>{persianNumber(viewsCount)}</p>
              </div>
              {!!vip && (
                <>
                  <div className="h-3 w-[1px] bg-white/20" />
                  <div className="flex flex-row items-center gap-1">
                    <Image
                      src={getSimCardLevelIconUrl(vip)}
                      alt="VIP"
                      width={12}
                      height={12}
                    />
                    <p>{getSimCardLevelLabel(vip)}</p>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        {accordion && (
          <button
            type="button"
            className="flex h-4 w-4 min-w-4 items-center justify-center md:h-6 md:w-6 md:min-w-6"
            onClick={handleToggleOpen}
          >
            <Image
              src="/icons/icon-chevron-down-circled.svg"
              alt="Open or Close Item"
              sizes="(max-width: 900px) 16px, 24px"
              width={24}
              height={24}
              className={`h-full w-full transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>
      {isDeactivatedStyle && (
        <div className="flex h-8 w-full items-center justify-center rounded-md border-[0.5px] border-grey bg-grey-100 text-xs font-medium leading-5 text-grey">
          {isDeactivated
            ? "غیرفعال"
            : isReserved
              ? "رزرو شده"
              : isHighestBidExpired
                ? "پایان یافته"
                : "نامشخص"}
        </div>
      )}
      <div
        className={`flex w-full flex-col items-center justify-between gap-3 rounded-md bg-grey-100 p-3 text-grey ${isDeactivatedStyle ? "opacity-50" : ""}`}
      >
        {serviceType === "specialSim" ? (
          <>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm font-normal">قیمت از:</p>
              {minPrice === "X" ? (
                <p className="text-base font-normal">مهم نیست</p>
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <p className="text-base font-medium">
                    {persianNumber(minPrice)}
                  </p>
                  <p className="text-[10px] font-light">تومان</p>
                </div>
              )}
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm font-normal">قیمت تا:</p>
              {maxPrice === "X" ? (
                <p className="text-base font-normal">مهم نیست</p>
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <p className="text-base font-medium">
                    {persianNumber(maxPrice)}
                  </p>
                  <p className="text-[10px] font-light">تومان</p>
                </div>
              )}
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm font-normal">استان:</p>
              <p className="text-base font-normal">
                {provinceFa || "فرقی ندارد"}
              </p>
            </div>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="text-sm font-normal">اپراتور:</p>
              <p className="text-base font-normal">
                {getSimCardOperatorLabel(operator)}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="flex h-[20px] w-full flex-row items-center justify-between text-xs font-normal text-grey">
              <p className="w-1/2 text-center truncate">{cityFa || "مشکین شهر"}</p>
              <div className="h-3.5 w-[1px] bg-grey-300" />
              <div className="w-1/2 text-center truncate">
                {(serviceType === "simPack" ||
                  serviceType === "simPackHighBid") &&
                simPackType
                  ? getSimPackTypeLabel(simPackType)
                  : simCardState === 1
                    ? "درحد صفر"
                    : getSimCardStateLabel(simCardState)}
              </div>
            </div>
            <div className="relative flex h-[32px] w-full flex-row items-center justify-center gap-1.5 rounded-lg bg-white shadow-xs">
              {!!offPrice || !!price ? (
                <>
                  <p className="text-sm md:text-base font-bold text-grey">
                    {offPrice
                      ? persianNumber(offPrice)
                      : persianNumber(price)}
                  </p>
                  <span className="text-[10px] font-normal text-grey-500">تومان</span>
                </>
              ) : (
                <p className="text-sm md:text-base font-bold text-grey">توافقی</p>
              )}
              {isApprovedByExpert && (
                <Image
                  className="absolute left-2.5 h-4 w-4"
                  src="/icons/icon-check-green.svg"
                  alt="Approved By Expert"
                  width={16}
                  height={16}
                />
              )}
            </div>
          </>
        )}
      </div>
      <div
        className={`flex h-7 w-full flex-row items-center justify-between gap-2 ${isDeactivatedStyle ? "opacity-50" : ""}`}
      >
        {badge1}
        {badge2 || <PackageBadge label="کارشناسی شده" />}
      </div>
      {!accordion && !isDeactivatedStyle && (
        <div className="flex h-7 w-full flex-row items-center justify-between pt-0.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#EAF5FF] transition-colors hover:bg-blue-100">
            <Image
              src="/icons/icon-arrow-left.svg"
              alt="Enter"
              width={14}
              height={14}
            />
          </div>
          <div className="flex flex-row items-center text-xs font-medium text-grey">
            {footer}
          </div>
        </div>
      )}
    </PackageCardWrapper>
  );
}

function PackageCardWrapper({
  serviceType,
  numbersCount = 1,
  accordion = false,
  selected,
  item,
  onSelect,
  open,
  route,
  targetId,
  queryParams,
  blue,
  isVertical = false,
  children,
}: {
  serviceType: ServiceType;
  numbersCount?: number;
  accordion?: boolean;
  selected?: boolean;
  item?: SimKhast | SingleSimCard | SimPack;
  onSelect?: (item: SimKhast | SingleSimCard | SimPack) => void;
  open?: boolean;
  route?: string;
  targetId?: string;
  queryParams?: string;
  blue?: boolean;
  isVertical?: boolean;
  children: ReactNode;
}) {
  const openedHeight =
    serviceType === "specialSim"
      ? 260
      : 200 +
        (serviceType === "simPack" || serviceType === "simPackHighBid"
          ? (numbersCount - 1) * 28
          : 0);
  const closedHeight =
    52 +
    (serviceType === "simPack" || serviceType === "simPackHighBid"
      ? (numbersCount - 1) * 28
      : 0);
  return accordion ? (
    <div
      className={`flex ${isVertical ? "w-full" : "w-[295px] md:w-[381px]"} shrink-0 flex-col items-center gap-3 overflow-y-clip transition-all`}
      style={{
        height: open ? openedHeight : closedHeight,
        minHeight: open ? openedHeight : closedHeight,
      }}
    >
      {children}
    </div>
  ) : selected !== undefined ? (
    <button
      onClick={() => onSelect && item && onSelect(item)}
      className={`relative flex ${isVertical ? "w-full" : "w-[295px] md:w-[302px]"} shrink-0 select-none flex-col items-center justify-between gap-3 rounded-2xl border border-grey-200 ${blue ? "bg-neutral md:bg-white" : "bg-white"} ${selected ? "!border-grey" : "opacity-50"} p-3.5 shadow-sm transition-all hover:shadow-md md:p-4`}
    >
      {children}
    </button>
  ) : (
    <ResponsiveLink
      href={`/${route}/${targetId}?${queryParams}`}
      className={`relative flex ${isVertical ? "w-full" : "w-[295px] md:w-[302px]"} shrink-0 select-none flex-col items-center justify-between gap-3 rounded-2xl border border-grey-200 ${blue ? "bg-neutral md:bg-white" : "bg-white"} p-3.5 shadow-sm transition-all hover:shadow-md md:p-4`}
    >
      {children}
    </ResponsiveLink>
  );
}

function PackageBadge({
  label,
  roundCount = 0,
}: {
  label: string;
  roundCount?: number;
}) {
  return (
    <div className="flex h-7 flex-1 flex-row items-center justify-center gap-1.5 rounded-xl bg-[#FDF6E8] px-2 text-xs font-medium text-[#6B592F]">
      {!!roundCount && (
        <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#6B592F] text-[10px] font-bold">
          {persianNumber(roundCount)}
        </div>
      )}
      <p className="truncate">{label}</p>
    </div>
  );
}

function VerticalLineBlue() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}

function VerticalLineGrey() {
  return <div className="h-6 w-[1px] bg-grey-200" />;
}
