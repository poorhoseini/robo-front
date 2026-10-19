"use client";

import WalletChargeDialog from "@/components/cart/WalletChargeDialog";
import Space from "@/components/general/Space";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { ResponseError } from "@/lib/api/error";
import getMyWalletBalance from "@/lib/api/getMyWalletBalance";
import { dashboardMenuItems } from "@/lib/constants/menuItems";
import {
  GetMyWalletBalanceResponseProps,
  WalletBalance,
} from "@/lib/entities/wallet";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { DeviceContext } from "@/lib/providers/DeviceProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { Button, Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function DashboardPage() {
  const { device } = useContext(DeviceContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { auth, resetAuth } = useContext(AuthContext);
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

  if (!device.isMobile) return <></>;

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral">
      <Header selectedMenu="dashboard" />
      <main className="flex w-full flex-col p-6 pb-24 md:pb-6">
        <div className="flex w-full flex-col items-center rounded-lg border border-grey-200 bg-white p-4">
          <div className="flex w-full flex-row items-start gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-biege-200">
              <Image
                src="/icons/icon-avatar-black.svg"
                alt=""
                width={18}
                height={18}
              />
            </div>
            <div className="w-full flex-col items-start gap-1">
              <h2 className="text-sm font-medium leading-6 text-grey">
                {auth.name || persianNumber(auth.phoneNumber)}
              </h2>
              <p className="text-xs font-normal leading-6 text-grey">
                {auth.name ? persianNumber(auth.phoneNumber) : ""}
              </p>
            </div>
          </div>
          <Space value={8} />
          {loading ? (
            <Skeleton variant="rounded" width="100%" height={40} />
          ) : walletBalance ? (
            <div className="flex w-full flex-row items-end justify-between rounded-lg">
              <div className="flex flex-row items-center justify-start gap-4">
                <div className="h-[40px] w-1 rounded-[4px] bg-gradient-to-t from-blue-200 to-grey" />
                <div className="flex flex-col items-start justify-start gap-1">
                  <p className="text-xs font-normal leading-4 text-[#8E8E93]">
                    کل موجودی
                  </p>
                  <p className="text-nowrap">
                    <span className="text-base font-bold leading-5 text-grey">
                      {persianNumber(walletBalance.availableBalance) + " "}
                    </span>
                    <span className="text-sm font-light leading-5 text-grey">
                      تومان
                    </span>
                  </p>
                </div>
              </div>
              <WalletChargeDialog isProfile />
            </div>
          ) : (
            "خطا"
          )}
        </div>
        <Space value={16} />
        <div className="flex w-full flex-row items-center justify-between rounded-lg bg-[#FFF1D0] px-4 py-3">
          <div className="flex flex-row items-start gap-2">
            <Image
              src="icons/calendar-percent.svg"
              alt=""
              width={24}
              height={24}
            />
            <div className="flex w-full flex-col items-start gap-2 ">
              <p className="text-sm font-normal leading-4 text-grey">کد هدیه</p>
              <p className="text-xs font-normal leading-3 text-brown">
                افزایش اعتبار یا فعال سازی اشتراک
              </p>
            </div>
          </div>
          <Button
            size="small"
            className="!bg-grey text-xs font-medium leading-6 !text-white"
          >
            وارد کنید
          </Button>
        </div>
        <Space value={16} />
        <div className="flex w-full flex-col items-center rounded-lg border border-grey-200 bg-white">
          {dashboardMenuItems.map((item, index) => (
            <Fragment key={item.id}>
              <Link
                href={item.href}
                className={`flex h-14 w-full flex-row items-center justify-start gap-2 rounded-lg px-4`}
              >
                <div className="relative h-6 w-6 min-w-6">
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    sizes="24px"
                    className="object-contain"
                  />
                </div>
                <p className="text-nowrap text-sm font-normal leading-6">
                  {item.label}
                </p>
              </Link>
              {index !== dashboardMenuItems.length - 1 && (
                <div className="h-[1px] w-[90%] border-t border-grey-100" />
              )}
            </Fragment>
          ))}
        </div>
      </main>
      <Footer selectedMenu="dashboard" />
    </div>
  );
}
