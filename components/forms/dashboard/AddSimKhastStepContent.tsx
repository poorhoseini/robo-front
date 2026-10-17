"use client";

import { Province } from "@/lib/entities/province";
import { RoundType } from "@/lib/entities/roundType";
import { useCallback, useEffect } from "react";
import { GetCitiesResponseProps } from "@/lib/entities/city";
import getCities from "@/lib/api/getCities";
import AddSimKhastNumberStep from "./AddSimKhastNumberStep";
import AddSimKhastPriceStep from "./AddSimKhastPriceStep";
import AddSimKhastPreviewStep from "./AddSimKhastPreviewStep";
import {
  useAddSimKhastActions,
  useProvince,
  useStep,
} from "@/lib/zustand/addSimKhast";

export default function AddSimKhastStepContent({
  provincesList,
  roundTypesList,
}: {
  provincesList: Province[];
  roundTypesList: RoundType[];
}) {
  const step = useStep();
  const province = useProvince();
  const { setCitiesList, setCity } = useAddSimKhastActions();

  const handleFetchCitiesList = useCallback(
    async function handleFetchCitiesList(provinceId?: number) {
      const getCitiesResponse: GetCitiesResponseProps | undefined = provinceId
        ? await getCities({
            provinceId,
          })
        : undefined;
      setCitiesList(getCitiesResponse?.data?.cities || []);
      setCity(null);
    },
    [setCitiesList, setCity],
  );

  useEffect(() => {
    if (!province?.id) return;
    handleFetchCitiesList(province.id);
  }, [handleFetchCitiesList, province?.id]);

  return (
    <div className="flex h-[80vh] min-h-[80vh] w-full max-w-[951px] flex-col items-center gap-4 md:rounded-lg md:border md:border-grey-200 md:bg-white md:px-48 md:py-10">
      {step === 1 ? (
        <AddSimKhastNumberStep roundTypesList={roundTypesList} />
      ) : step === 2 ? (
        <AddSimKhastPriceStep provincesList={provincesList} />
      ) : step === 3 ? (
        <AddSimKhastPreviewStep
          serviceName="ثبت آگهی سیم خواست"
          roundTypesList={roundTypesList}
        />
      ) : (
        <></>
      )}
    </div>
  );
}
