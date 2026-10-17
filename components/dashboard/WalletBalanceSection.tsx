"use client";

import { ResponseError } from "@/lib/api/error";
import getMyWalletBalance from "@/lib/api/getMyWalletBalance";
import {
  GetMyWalletBalanceResponseProps,
  WalletBalance,
} from "@/lib/entities/wallet";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import WalletBalanceSectionSkeleton from "../skeletons/WalletBalanceSectionSkeleton";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";

export default function WalletBalanceSection() {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [loading, setLoading] = useState(true);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>();

  useEffect(() => {
    if (!auth.token) return;

    handleFetchWalletBalance();
  }, [auth.token]);

  const handleFetchWalletBalance = async () => {
    setLoading(true);

    try {
      const walletBalanceResponse: GetMyWalletBalanceResponseProps =
        await getMyWalletBalance(auth.token);
      setWalletBalance(walletBalanceResponse.data);
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
        toast.error("خطا در دریافت موجودی کیف پول");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <WalletBalanceSectionSkeleton />;

  if (!walletBalance?.availableBalance) return <p>خطا</p>;

  return (
    <div className="flex w-full flex-row items-center justify-between rounded-lg border border-blue bg-blue-900 px-6 py-4">
      <div className="flex flex-row items-center justify-start gap-4">
        <div className="h-[65px] w-1 rounded-[4px] bg-gradient-to-t from-blue-200 to-grey" />
        <div className="flex flex-col items-start justify-start gap-4">
          <p className="text-base font-medium leading-5 text-grey ">
            کل موجودی
          </p>
          <p className="text-nowrap">
            <span className="text-2xl font-bold leading-7 text-grey">
              {persianNumber(walletBalance.availableBalance) + " "}
            </span>
            <span className="text-sm font-light leading-5 text-grey">
              تومان
            </span>
          </p>
        </div>
      </div>
      <div className="flex h-[32px] w-full flex-row items-center justify-end gap-2">
        افزایش اعتبار
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-blue-900">
          <Image
            src="/icons/icon-arrow-left.svg"
            alt="Enter"
            width={16}
            height={16}
          />
        </div>
      </div>
    </div>
  );
}
