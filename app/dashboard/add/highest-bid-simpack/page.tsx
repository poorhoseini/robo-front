import AddSimPackStepContent from "@/components/forms/dashboard/AddSimPackStepContent";
import AddHighestBidSimPackStepperSection from "@/components/forms/dashboard/AddHighestBidSimPackStepperSection";
import Header from "@/components/header/Header";
import getProvinces from "@/lib/api/getProvinces";
import { GetProvincesResponseProps } from "@/lib/entities/province";
import React from "react";

export const dynamic = "force-dynamic";

export default async function AddHighestBidSimPackPage() {
  const getProvincesResponse: GetProvincesResponseProps = await getProvinces();
  const provincesList = getProvincesResponse?.data?.provinces || [];

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col items-center gap-6 bg-neutral md:h-full md:gap-8">
      <Header selectedMenu="addHighestBidSimPack" />
      <main className="mb-[68px] flex w-full max-w-7xl flex-col items-start gap-6 overflow-y-auto px-6 md:mb-0 md:flex-row md:justify-between md:overflow-y-visible md:px-0">
        <AddHighestBidSimPackStepperSection />
        <AddSimPackStepContent
          service="highBid-simPack"
          provincesList={provincesList}
        />
      </main>
    </div>
  );
}
