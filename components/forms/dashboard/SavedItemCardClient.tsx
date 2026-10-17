"use client";

import PackageCard from "@/components/cards/PackageCard";
import { ServiceType } from "@/lib/entities/landingPage";
import { Operator } from "@/lib/entities/operator";
import { RoundLevelFa } from "@/lib/entities/round";
import { SimPackType } from "@/lib/entities/simPack";

export default function SavedItemCardClient({
  serviceType = "simcard",
  phoneNumber,
  operator,
  cityName,
  provinceName,
  simCardState,
  simPackType,
  priceType,
  price,
  minPrice,
  maxPrice,
  roundLevelsFa,
  hasInstallmentPlan = false,
  onDelete,
}: {
  serviceType?: ServiceType;
  phoneNumber: string[];
  operator?: Operator;
  cityName: string;
  provinceName: string;
  simCardState?: number;
  simPackType?: SimPackType;
  priceType?: number;
  price?: number;
  minPrice?: number | "X";
  maxPrice?: number | "X";
  roundLevelsFa?: RoundLevelFa[];
  hasInstallmentPlan?: boolean;
  onDelete: () => void;
}) {
  const handleDeletePackageCard = () => {
    onDelete();
  };

  return (
    <PackageCard
      accordion
      serviceType={serviceType}
      sellerSpell={phoneNumber}
      operator={operator}
      cityFa={cityName}
      provinceFa={provinceName}
      simCardState={
        simCardState !== undefined ? Number(simCardState) : undefined
      }
      simPackType={simPackType}
      priceType={priceType !== undefined ? Number(priceType) : undefined}
      price={price !== undefined ? Number(price) : undefined}
      minPrice={minPrice !== undefined ? Number(minPrice) : undefined}
      maxPrice={maxPrice !== undefined ? Number(maxPrice) : undefined}
      roundLevelsFa={roundLevelsFa}
      hasInstallment={hasInstallmentPlan}
      onDelete={handleDeletePackageCard}
      // isHighBid={item.isHighBid}
      // highBidData={item.highBidData && item.highBidData[0]}
    />
  );
}
