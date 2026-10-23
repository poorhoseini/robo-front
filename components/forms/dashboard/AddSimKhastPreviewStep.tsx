"use client";

import CartModal from "@/components/cart/CartModal";
import { ResponseError } from "@/lib/api/error";
import preAddSimKhast from "@/lib/api/preAddSimKhast";
import { Operator } from "@/lib/entities/operator";
import {
  PreAddSimKhastRequestProps,
  PreAddSimKhastResponseProps,
} from "@/lib/entities/preAddSimKhast";
import { RoundType } from "@/lib/entities/roundType";
import {
  getSimCardOperatorLabel,
  getSimCardStateLabel,
} from "@/lib/helpers/decodeSimCardData";
import {
  formatPhoneNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  useDigit1,
  useDigit2,
  useDigit3,
  useDigit4,
  useDigit5,
  useDigit6,
  useDigit7,
  useDigit8,
  useDigit9,
  useType,
  useStatus,
  useRoundTypeIds,
  useMinPrice,
  useMaxPrice,
  useOperator,
  useProvince,
  useCity,
  useAddSimKhastActions,
} from "@/lib/zustand/addSimKhast";
import Image from "next/image";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export default function AddSimKhastPreviewStep({
  serviceName,
  roundTypesList,
}: {
  serviceName: string;
  roundTypesList: RoundType[];
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const digit1 = useDigit1();
  const digit2 = useDigit2();
  const digit3 = useDigit3();
  const digit4 = useDigit4();
  const digit5 = useDigit5();
  const digit6 = useDigit6();
  const digit7 = useDigit7();
  const digit8 = useDigit8();
  const digit9 = useDigit9();
  const type = useType();
  const status = useStatus();
  const roundTypeIds = useRoundTypeIds();
  const minPrice = useMinPrice();
  const maxPrice = useMaxPrice();
  const operator = useOperator();
  const province = useProvince();
  const city = useCity();
  const [cartId, setCartId] = useState<string>();
  const { setStep } = useAddSimKhastActions();
  const [loading, setLoading] = useState(false);

  const handlePreAddSimKhast = async () => {
    setLoading(true);

    const payload: PreAddSimKhastRequestProps = {
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      rondIds: roundTypeIds.map((item) => Number(item)),
      ...(!!status && { state: Number(status) }),
      ...(!!type && { type: Number(type) }),
      ...(!!operator && { operator: operator as Operator }),
      ...(!!province && { provinceId: Number(province.id) }),
      ...(!!city && { cityId: Number(city.id) }),
      ...(digit1 !== "*" && { digit2: digit1 }),
      ...(digit2 !== "*" && { digit3: digit2 }),
      ...(digit3 !== "*" && { digit4: digit3 }),
      ...(digit4 !== "*" && { digit5: digit4 }),
      ...(digit5 !== "*" && { digit6: digit5 }),
      ...(digit6 !== "*" && { digit7: digit6 }),
      ...(digit7 !== "*" && { digit8: digit7 }),
      ...(digit8 !== "*" && { digit9: digit8 }),
      ...(digit9 !== "*" && { digit10: digit9 }),
    };

    try {
      const response: PreAddSimKhastResponseProps = await preAddSimKhast(
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
        toast.error("خطا در اضافه کردن سیم خواست");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStepBack = () => {
    setStep(2);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-between pb-24 md:pb-0">
      <div className="flex w-full flex-col items-center gap-4 rounded-lg bg-white p-4 md:p-0">
        <div className="flex w-full items-center justify-center rounded-xl bg-primary p-4">
          <p className="ltr text-3xl font-medium text-white">
            {formatPhoneNumber(
              "09" +
                (digit1 || "*") +
                (digit2 || "*") +
                (digit3 || "*") +
                (digit4 || "*") +
                (digit5 || "*") +
                (digit6 || "*") +
                (digit7 || "*") +
                (digit8 || "*") +
                (digit9 || "*"),
            )}
          </p>
        </div>
        <div className="flex w-full flex-col items-center gap-6 rounded-lg border border-grey-200 p-6">
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع درخواست</p>
            <p className="text-base font-medium text-grey">{serviceName}</p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">نوع رندی</p>
            <p className="text-base font-medium text-grey">
              {roundTypeIds.map(
                (item) =>
                  (roundTypesList.find((r) => r.id.toString() === item)
                    ?.rondLevelFa || "نامشخص") + " / ",
              )}
            </p>
            {!roundTypeIds.length && (
              <p className="text-base font-medium text-grey">فرقی ندارد</p>
            )}
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">شرایط سیم کارت</p>
            <p className="text-base font-medium text-grey">
              {status === "all" || !status
                ? "فرقی ندارد"
                : getSimCardStateLabel(Number(status))}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">قیمت از</p>
            <div className="flex flex-row items-center gap-[2px]">
              <p className="text-xl font-bold text-grey">
                {persianNumber(Number(minPrice))}
              </p>
              <p className="text-sm font-light text-grey">تومان</p>
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">قیمت تا</p>
            <div className="flex flex-row items-center gap-[2px]">
              <p className="text-xl font-bold text-grey">
                {persianNumber(Number(maxPrice))}
              </p>
              <p className="text-sm font-light text-grey">تومان</p>
            </div>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">استان و شهر</p>
            <p className="text-base font-medium text-grey">
              {(province?.name || "فرقی ندارد") +
                "/ " +
                (city?.name || "فرقی ندارد")}
            </p>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-sm font-normal text-grey">اپراتور</p>
            <p className="text-base font-medium text-grey">
              {operator
                ? getSimCardOperatorLabel(operator as Operator)
                : "فرقی ندارد"}
            </p>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
        <button
          onClick={handlePreAddSimKhast}
          className="flex h-12 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          تایید
        </button>
      </div>
      <div className="hidden w-full flex-row items-center justify-center gap-4 md:flex">
        <button
          onClick={handlePreAddSimKhast}
          className="flex h-14 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
          disabled={loading}
        >
          تایید
        </button>
        <button
          onClick={handleStepBack}
          className="flex h-14 min-w-14 items-center justify-center rounded-xl border border-grey bg-white"
          disabled={loading}
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
