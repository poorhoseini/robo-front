"use client";

import CartModal from "@/components/cart/CartModal";
import Space from "@/components/general/Space";
import Spinner from "@/components/general/Spinner";
import InstallmentPlanSkeleton from "@/components/skeletons/InstallmentPlanSkeleton";
import { ResponseError } from "@/lib/api/error";
import preAddHighestBidSimPack from "@/lib/api/preAddHighestBidSimPack";
import preAddSimPack from "@/lib/api/preAddSimPack";
import {
  PreAddSimPackRequestProps,
  PreAddSimPackResponseProps,
} from "@/lib/entities/preAddSimPack";
import { SimPackType } from "@/lib/entities/simPack";
import {
  getSimCardPriceTypeLabel,
  getSimPackTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  useAddSimPackActions,
  useCity,
  useHasInstallmentPlan,
  useLoanId,
  useMyInstallmentPlans,
  usePrice,
  usePriceType,
  useProvince,
  useSavedItems,
  useSimPackType,
} from "@/lib/zustand/addSimPack";
import Image from "next/image";
import { useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";

export default function AddSimPackPreviewStep({
  serviceName,
  isHighestBid = false,
  installmentsLoading,
  installmentsError,
  handleGetMyInstallmentPlans,
}: {
  serviceName: string;
  isHighestBid: boolean;
  installmentsLoading: boolean;
  installmentsError: boolean;
  handleGetMyInstallmentPlans: () => void;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const province = useProvince();
  const city = useCity();
  const simPackType = useSimPackType();
  const priceType = usePriceType();
  const price = usePrice();
  const hasInstallmentPlan = useHasInstallmentPlan();
  const loanId = useLoanId();
  const myInstallmentPlans = useMyInstallmentPlans();
  const savedItems = useSavedItems();
  const { setStep } = useAddSimPackActions();
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const selectedInstallmentPlan = useMemo(() => {
    return myInstallmentPlans.find((item) => item._id === loanId);
  }, [myInstallmentPlans, loanId]);

  const selectedInstallmentPlanIndex = useMemo(() => {
    return myInstallmentPlans.findIndex((item) => item._id === loanId);
  }, [myInstallmentPlans, loanId]);

  const handlePreAddSimPack = async () => {
    setLoading(true);

    const payload: PreAddSimPackRequestProps = {
      simcards: savedItems.map((item) => ({
        phoneNumber: item.phoneNumber,
        state: Number(item.status),
        type: Number(item.type),
      })),
      simPackType: simPackType as SimPackType,
      price: Number(price) || 1000000,
      priceType: Number(priceType),
      provinceId: Number(province?.id),
      cityId: Number(city?.id),
      isInstallment: hasInstallmentPlan,
      installmentPlanId: loanId || undefined,
    };

    try {
      const response: PreAddSimPackResponseProps = await preAddSimPack(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در اضافه کردن سیم پک");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreAddHighestBidSimPack = async () => {
    setLoading(true);

    const payload: PreAddSimPackRequestProps = {
      simcards: savedItems.map((item) => ({
        phoneNumber: item.phoneNumber,
        state: Number(item.status),
        type: Number(item.type),
      })),
      simPackType: simPackType as SimPackType,
      price: Number(price) || 1000000,
      priceType: 2,
      provinceId: Number(province?.id),
      cityId: Number(city?.id),
      isInstallment: hasInstallmentPlan,
      installmentPlanId: loanId || undefined,
    };

    try {
      const response: PreAddSimPackResponseProps =
        await preAddHighestBidSimPack(payload, auth.token);
      setCartId(response.cartId);
      setCartDialogOpen(true);
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در اضافه کردن بالاترین پیشنهاد سیم پک");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStepBack = () => {
    setStep(2);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between">
      <div className="flex w-full flex-col items-center rounded-lg bg-white p-4 md:p-0">
        <div className="flex w-full flex-col items-center justify-center gap-4 rounded-xl bg-primary p-4">
          {savedItems.map((item, index) => (
            <p
              key={index}
              className="text-[26px] font-semibold leading-5 text-[#F6F6F6]"
            >
              {persianNumber(item.phoneNumber)}
            </p>
          ))}
        </div>
        <Space value={16} />
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-grey-200 p-6">
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع درخواست</p>
            <p className="text-base font-medium text-grey">{serviceName}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع سیم پک</p>
            <p className="text-base font-medium text-grey">
              {getSimPackTypeLabel(simPackType as SimPackType)}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">استان و شهر</p>
            <p className="text-base font-medium text-grey">
              {province?.name + "/ " + city?.name}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع قیمت گذاری</p>
            <p className="text-base font-medium text-grey">
              {getSimCardPriceTypeLabel(isHighestBid ? 2 : Number(priceType))}
            </p>
          </div>
          {priceType === "0" && (
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-sm font-normal text-grey">قیمت</p>
              <div className="flex flex-row items-center gap-[2px]">
                <p className="text-xl font-bold text-grey">
                  {persianNumber(Number(price))}
                </p>
                <p className="text-sm font-light text-grey">تومان</p>
              </div>
            </div>
          )}
          {isHighestBid && (
            <div className="flex w-full flex-row items-center justify-between">
              <p className="text-sm font-normal text-grey">قیمت پایه</p>
              <div className="flex flex-row items-center gap-[2px]">
                <p className="text-xl font-bold text-grey">
                  {persianNumber(Number(price))}
                </p>
                <p className="text-sm font-light text-grey">تومان</p>
              </div>
            </div>
          )}
        </div>
        <Space value={16} />
        {installmentsError && (
          <div className="flex w-full flex-col items-center justify-center gap-2">
            <p>دریافت لیست شرایط اقساطی شما با مشکل مواجه شد!</p>
            <button
              type="button"
              className="rounded-lg border border-blue p-3 text-blue"
              onClick={handleGetMyInstallmentPlans}
            >
              تلاش مجدد
            </button>
          </div>
        )}
        {installmentsLoading && hasInstallmentPlan && (
          <InstallmentPlanSkeleton />
        )}
        {hasInstallmentPlan &&
          !!selectedInstallmentPlan &&
          !installmentsError &&
          !installmentsLoading && (
            <>
              <div className="flex w-full flex-col items-center gap-[14px] rounded-lg border border-grey-200 bg-neutral p-6">
                <div className="flex w-full flex-row items-center justify-between">
                  <h3 className="text-sm font-medium leading-normal text-grey">
                    {"شرایط قسط " +
                      persianNumber(selectedInstallmentPlanIndex + 1)}
                  </h3>
                  <div className="flex h-6 w-[68px] items-center justify-center rounded-xl bg-biege px-3 py-[2px]">
                    <p className="text-[10px] font-medium leading-normal text-brown">
                      {persianNumber(selectedInstallmentPlan.profitPercent) +
                        "٪ سود"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex w-full flex-row items-center justify-between">
                  <h3 className="text-xs font-normal text-grey">
                    حداقل/حداکثر دوره بازپرداخت
                  </h3>
                  <p className="text-sm font-medium text-grey">
                    {persianNumber(selectedInstallmentPlan.minimumMonth) +
                      " ماهه/ " +
                      persianNumber(selectedInstallmentPlan.maximumMonth) +
                      " ماهه"}
                  </p>
                </div>
                <HorizontalLine />
                <div className="flex w-full flex-row items-center justify-between">
                  <h3 className="text-sm font-normal text-grey">پیش پرداخت</h3>
                  <p className="text-sm font-medium text-grey">
                    {"حداقل " +
                      persianNumber(selectedInstallmentPlan.preFound) +
                      " درصد"}
                  </p>
                </div>
              </div>
              <Space value={16} />
            </>
          )}
      </div>
      <div className="absolute bottom-0 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
        <button
          disabled={loading}
          onClick={
            isHighestBid ? handlePreAddHighestBidSimPack : handlePreAddSimPack
          }
          className="flex h-12 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          {loading ? <Spinner /> : "تایید"}
        </button>
      </div>
      <div className="hidden w-full flex-row items-center justify-center gap-4 md:flex">
        <button
          disabled={loading}
          onClick={
            isHighestBid ? handlePreAddHighestBidSimPack : handlePreAddSimPack
          }
          className="flex h-14 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          {loading ? <Spinner /> : "تایید"}
        </button>
        <button
          onClick={handleStepBack}
          className="flex h-14 min-w-14 items-center justify-center rounded-xl border border-grey bg-white"
        >
          <Image
            src="/icons/icon-arrow-left-grey.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </button>
      </div>
      {!!cartId && <CartModal cartId={cartId} />}
    </div>
  );
}

function HorizontalLine() {
  return <div className="w-full border-b border-grey-200" />;
}
