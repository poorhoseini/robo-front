"use client";

import {
  useAddSimPackActions,
  useProvince,
  useSavedItems,
  useStep,
} from "@/lib/zustand/addSimPack";
import { Province } from "@/lib/entities/province";
import { useCallback, useContext, useEffect, useState } from "react";
import { GetCitiesResponseProps } from "@/lib/entities/city";
import getCities from "@/lib/api/getCities";
import { GetMyInstallmentPlansResponseProps } from "@/lib/entities/installment";
import getMyInstallmentPlans from "@/lib/api/getMyInstallmentPlans";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { Service } from "@/lib/entities/cart";
import AddSimPackNumberStep from "./AddSimPackNumberStep";
import ApproveSimPackItemsButton from "./ApproveSimPackItemsButton";
import SavedSimPackItemCardClient from "./SavedSimPackItemCardClient";
import AddSimPackPriceStep from "./AddSimPackPriceStep";
import AddSimPackPreviewStep from "./AddSimPackPreviewStep";
import Image from "next/image";

export default function AddSimPackStepContent({
  service,
  provincesList,
}: {
  service: Service;
  provincesList: Province[];
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const step = useStep();
  const province = useProvince();
  const savedItems = useSavedItems();
  const { setCitiesList, setCity, setMyInstallmentPlans, removeSavedItem } =
    useAddSimPackActions();
  const [loadingInstallments, setLoadingInstallments] = useState(true);
  const [errorInstallments, setErrorInstallments] = useState(false);

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

  const handleGetMyInstallmentPlans = useCallback(
    async function handleGetMyInstallmentPlans() {
      setLoadingInstallments(true);
      setErrorInstallments(false);
      try {
        const res: GetMyInstallmentPlansResponseProps =
          await getMyInstallmentPlans(auth.token);
        setMyInstallmentPlans(res.data);
      } catch (error) {
        console.log(error);
        setErrorInstallments(true);
        setMyInstallmentPlans([]);
        if (error instanceof ResponseError) {
          toast.error(error.printError());
          const errorReason = error.getErrorReason();
          if (errorReason === 163 || errorReason === 164) {
            resetAuth();
            setLoginDialogOpen(true);
          }
        } else {
          toast.error("خطا در دریافت اطلاعات شرایط اقساطی");
        }
      } finally {
        setLoadingInstallments(false);
      }
    },
    [auth.token, resetAuth, setLoginDialogOpen, setMyInstallmentPlans],
  );

  useEffect(() => {
    //think about this for when user is not logged in
    if (!auth.token) {
      setMyInstallmentPlans([]);
      return;
    }
    handleGetMyInstallmentPlans();
  }, [auth.token, handleGetMyInstallmentPlans, setMyInstallmentPlans]);

  return (
    <div className="flex w-full flex-col items-start gap-2 md:flex-row">
      <div
        className={`flex w-full max-w-[951px] flex-col items-center gap-4 md:rounded-lg md:border md:border-grey-200 md:bg-white md:py-10 ${step === 1 ? "md:px-4" : "md:px-48"}`}
      >
        {step === 1 ? (
          <AddSimPackNumberStep />
        ) : step === 2 ? (
          <AddSimPackPriceStep
            isHighestBid={service === "highBid-simPack"}
            provincesList={provincesList}
            installmentsLoading={loadingInstallments}
            installmentsError={errorInstallments}
            handleGetMyInstallmentPlans={handleGetMyInstallmentPlans}
          />
        ) : step === 3 ? (
          <AddSimPackPreviewStep
            serviceName={
              service === "highBid-simPack"
                ? "ثبت آگهی بالاترین پیشنهاد سیم پک"
                : "ثبت آگهی سیم پک"
            }
            isHighestBid={service === "highBid-simPack"}
            installmentsLoading={loadingInstallments}
            installmentsError={errorInstallments}
            handleGetMyInstallmentPlans={handleGetMyInstallmentPlans}
          />
        ) : (
          <></>
        )}
      </div>
      {step === 1 && (
        <div className="hidden h-[80vh] min-h-[80vh] w-full max-w-[431px] flex-col items-center justify-between rounded-2xl border border-grey-200 bg-white md:flex">
          <div className="flex h-full w-full flex-col items-center gap-4 overflow-x-clip overflow-y-scroll p-6">
            <h3 className="w-full text-start text-base font-medium leading-5 text-grey">
              لیست سیم کارت‌ها
            </h3>
            {savedItems.map((savedItem, index) => (
              <SavedSimPackItemCardClient
                key={index}
                phoneNumber={savedItem.phoneNumber}
                simCardState={Number(savedItem.status)}
                simCardType={Number(savedItem.type)}
                onDelete={() => removeSavedItem(index)}
              />
            ))}
            {savedItems.length < 2 && (
              <>
                <div className="flex-1" />
                <div className="flex w-full flex-row items-start gap-1 rounded-lg bg-biege-200 p-2">
                  <Image
                    src="/icons/warning-black.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="mt-1"
                  />
                  <p className="text-lg font-normal leading-7 text-grey">
                    جهت ثبت آگهی سیم پک حداقل به اضافه کردن دو سیم کارت نیاز
                    است.
                  </p>
                </div>
              </>
            )}
          </div>
          <div className="flex h-[104px] w-full items-center justify-center rounded-b-2xl border-t border-grey-200 bg-neutral p-6">
            <ApproveSimPackItemsButton count={savedItems.length} />
          </div>
        </div>
      )}
    </div>
  );
}
