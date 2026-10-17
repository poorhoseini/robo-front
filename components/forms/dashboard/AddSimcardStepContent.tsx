"use client";

import {
  useAddSimcardActions,
  useDigits,
  useProvince,
  useSavedItems,
  useStep,
} from "@/lib/zustand/addSimCard";
import AddSimCardNumberStep from "./AddSimCardNumberStep";
import { Province } from "@/lib/entities/province";
import PreAddSimCardSubmit from "./PreAddSimCardSubmit";
import AddSimCardViewRoundsStep from "./AddSimCardViewRoundsStep";
import { RoundType } from "@/lib/entities/roundType";
import AddSimCardPriceStep from "./AddSimCardPriceStep";
import AddSimCardPreviewStep from "./AddSimCardPreviewStep";
import { useCallback, useContext, useEffect, useState } from "react";
import { GetCitiesResponseProps } from "@/lib/entities/city";
import getCities from "@/lib/api/getCities";
import { GetMyInstallmentPlansResponseProps } from "@/lib/entities/installment";
import getMyInstallmentPlans from "@/lib/api/getMyInstallmentPlans";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { GetSimCardRoundTypesResponseProps } from "@/lib/entities/round";
import getSimCardRoundTypes from "@/lib/api/getSimCardRoundTypes";
import SavedItemCardClient from "./SavedItemCardClient";
import { Service } from "@/lib/entities/cart";
import { useMediaQuery, useTheme } from "@mui/material";

export default function AddSimcardStepContent({
  service,
  provincesList,
  roundTypesList,
}: {
  service: Service;
  provincesList: Province[];
  roundTypesList: RoundType[];
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const step = useStep();
  const province = useProvince();
  const savedItems = useSavedItems();
  const {
    setStep,
    setCitiesList,
    setCity,
    setRoundData,
    setMyInstallmentPlans,
    removeSavedItem,
  } = useAddSimcardActions();
  const phoneNumber = "09" + useDigits();
  const [loadingRoundData, setLoadingRoundData] = useState(true);
  const [errorRoundData, setErrorRoundData] = useState("");
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

  const handleGetRoundData = useCallback(
    async function handleGetRoundData(phoneNumber: string) {
      setLoadingRoundData(true);
      setErrorRoundData("");
      try {
        const getSimcardRoundTypesResponse: GetSimCardRoundTypesResponseProps =
          await getSimCardRoundTypes({
            phoneNumber: phoneNumber,
          });
        setRoundData(getSimcardRoundTypesResponse?.data);
      } catch (error) {
        console.log(error);
        setRoundData(undefined);
        if (error instanceof ResponseError) {
          setErrorRoundData(error.printError());
          toast.error(error.printError());
          const errorReason = error.getErrorReason();
          if (errorReason === 163 || errorReason === 164) {
            resetAuth();
            setLoginDialogOpen(true);
          }
        } else {
          setErrorRoundData("خطایی رخ داده است");
          toast.error("خطایی رخ داده است");
        }
      } finally {
        setLoadingRoundData(false);
      }
    },
    [resetAuth, setLoginDialogOpen, setRoundData],
  );

  useEffect(() => {
    if (step !== 2) return;
    handleGetRoundData(phoneNumber);
  }, [handleGetRoundData, phoneNumber, step]);

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
    <div className="flex w-full flex-row items-start gap-2">
      <div
        className={`flex h-[80vh] min-h-[80vh] w-full max-w-[951px] flex-col items-center gap-4 md:rounded-lg md:border md:border-grey-200 md:bg-white md:py-10 ${savedItems && savedItems.length ? "md:px-4" : "md:px-48"}`}
      >
        {step === 1 || (!fullScreen && step === 5) ? (
          <AddSimCardNumberStep provincesList={provincesList} />
        ) : step === 2 ? (
          <AddSimCardViewRoundsStep
            roundTypesList={roundTypesList}
            roundDataLoading={loadingRoundData}
            roundDataError={errorRoundData}
            handleGetRoundData={() => handleGetRoundData(phoneNumber)}
          />
        ) : step === 3 ? (
          <AddSimCardPriceStep
            isHighestBid={service === "highBid-simcard"}
            installmentsLoading={loadingInstallments}
            installmentsError={errorInstallments}
            handleGetMyInstallmentPlans={handleGetMyInstallmentPlans}
          />
        ) : step === 4 ? (
          <AddSimCardPreviewStep
            serviceName={
              service === "highBid-simcard"
                ? "ثبت آگهی بالاترین پیشنهاد سیم کارت"
                : "ثبت آگهی سیم کارت"
            }
            isHighestBid={service === "highBid-simcard"}
            installmentsLoading={loadingInstallments}
            installmentsError={errorInstallments}
            handleGetMyInstallmentPlans={handleGetMyInstallmentPlans}
          />
        ) : fullScreen && step === 5 ? (
          <>
            <div className="flex h-full w-full flex-col items-center gap-4 overflow-x-clip overflow-y-scroll rounded-lg bg-white p-4">
              {savedItems.map((savedItem, index) => (
                <SavedItemCardClient
                  key={index}
                  phoneNumber={[savedItem.phoneNumber]}
                  provinceName={savedItem.province?.name || "نامشخص"}
                  cityName={savedItem.city?.name || "نامشخص"}
                  simCardState={
                    savedItem.status !== undefined
                      ? Number(savedItem.status)
                      : undefined
                  }
                  priceType={
                    savedItem.priceType !== undefined
                      ? Number(savedItem.priceType)
                      : undefined
                  }
                  price={
                    savedItem.price !== undefined
                      ? Number(savedItem.price)
                      : undefined
                  }
                  roundLevelsFa={savedItem.roundData?.rondLevelsFa}
                  hasInstallmentPlan={savedItem.hasInstallmentPlan}
                  onDelete={() => removeSavedItem(index)}
                />
              ))}
            </div>
            <div className="absolute bottom-0 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
              <button
                onClick={() => {
                  setStep(1);
                }}
                className="flex h-12 w-full items-center justify-center rounded-md border border-grey bg-white text-[17px] font-bold text-grey"
              >
                اضافه کردن
              </button>
              <PreAddSimCardSubmit service={service} isBlack />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      {!!savedItems && !!savedItems.length && (
        <div className="hidden h-[80vh] min-h-[80vh] w-full max-w-[431px] flex-col items-center justify-between rounded-2xl border border-grey-200 bg-white md:flex">
          <div className="flex h-full w-full flex-col items-center gap-4 overflow-x-clip overflow-y-scroll p-6">
            {savedItems.map((savedItem, index) => (
              <SavedItemCardClient
                key={index}
                phoneNumber={[savedItem.phoneNumber]}
                provinceName={savedItem.province?.name || "نامشخص"}
                cityName={savedItem.city?.name || "نامشخص"}
                simCardState={
                  savedItem.status !== undefined
                    ? Number(savedItem.status)
                    : undefined
                }
                priceType={
                  savedItem.priceType !== undefined
                    ? Number(savedItem.priceType)
                    : undefined
                }
                price={
                  savedItem.price !== undefined
                    ? Number(savedItem.price)
                    : undefined
                }
                roundLevelsFa={savedItem.roundData?.rondLevelsFa}
                hasInstallmentPlan={savedItem.hasInstallmentPlan}
                onDelete={() => removeSavedItem(index)}
              />
            ))}
          </div>
          <div className="flex h-[104px] w-full items-center justify-center rounded-b-2xl border-t border-grey-200 bg-neutral p-6">
            <PreAddSimCardSubmit service={service} />
          </div>
        </div>
      )}
    </div>
  );
}
