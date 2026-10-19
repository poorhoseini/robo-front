import AddSimKhastStepContent from "@/components/forms/dashboard/AddSimKhastStepContent";
import AddSimKhastStepperSection from "@/components/forms/dashboard/AddSimKhastStepperSection";
import Header from "@/components/header/Header";
import getProvinces from "@/lib/api/getProvinces";
import getRoundTypes from "@/lib/api/getRoundTypeList";
import { GetProvincesResponseProps } from "@/lib/entities/province";
import { GetRoundTypesResponseProps } from "@/lib/entities/roundType";
import React from "react";

export const dynamic = "force-dynamic";

export default async function AddSimKhastPage() {
  const getProvincesResponse: GetProvincesResponseProps = await getProvinces();
  const provincesList = getProvincesResponse?.data?.provinces || [];

  const RoundTypesResponse: GetRoundTypesResponseProps = await getRoundTypes();
  const roundTypesList = Object.values(RoundTypesResponse?.data || {});

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] flex-col items-center gap-6 bg-neutral md:h-full md:gap-8">
      <Header selectedMenu="addSimKhast" />
      <main className="mb-[68px] flex w-full max-w-7xl flex-col items-start gap-6 overflow-y-auto px-6 md:mb-0 md:flex-row md:justify-between md:overflow-y-visible md:px-0">
        <AddSimKhastStepperSection />
        <AddSimKhastStepContent
          provincesList={provincesList}
          roundTypesList={roundTypesList}
        />
      </main>
    </div>
  );
}
