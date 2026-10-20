"use client";

import WalletChargeDialog from "@/components/cart/WalletChargeDialog";
import DashboardMenu from "@/components/dashboard/DashboardMenu";
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
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { Button, Skeleton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const quickAccessItems = [
  {
    title: "سیم‌کارت‌های من",
    desc: "مشاهده، ویرایش و مدیریت آگهی‌های فعال سیم‌کارت",
    href: "/dashboard/my-simcards",
    icon: "/icons/icon-home-black.svg",
    badge: "تکی",
  },
  {
    title: "سیم‌پک‌های من",
    desc: "مدیریت بسته‌های سیم‌کارت و آگهی‌های چندتایی",
    href: "/dashboard/my-sim-packs",
    icon: "/icons/icon-double-sim.svg",
    badge: "گروهی",
  },
  {
    title: "سیم‌خواست‌های من",
    desc: "درخواست‌های خرید و تقاضای شماره‌های مورد نظر",
    href: "/dashboard/my-sim-khasts",
    icon: "/icons/icon-simcard-check.svg",
    badge: "تقاضا",
  },
  {
    title: "پیشنهادهای من",
    desc: "پیشنهادات قیمت ارسال شده و دریافت شده خریداران",
    href: "/dashboard/my-offers/simcard",
    icon: "/icons/icon-gift.svg",
    badge: "مذاکره",
  },
  {
    title: "بسته‌ها و اشتراک",
    desc: "مشاهده وضعیت بسته‌ها و امکانات فعال حساب کاربری",
    href: "/dashboard/my-plans",
    icon: "/icons/icon-bank-card.svg",
    badge: "پلن‌ها",
  },
  {
    title: "تخمین هوشمند قیمت",
    desc: "ارزیابی و تحلیل قیمت‌گذاری سیم‌کارت با هوش مصنوعی",
    href: "/dashboard/my-predicts/ai",
    icon: "/icons/icon-simcard-chart.svg",
    badge: "هوش مصنوعی",
  },
  {
    title: "کانال‌های من",
    desc: "مدیریت ارسال خودکار آگهی‌ها به کانال تلگرام و بله",
    href: "/dashboard/my-channels",
    icon: "/icons/icon-telegram-black.svg",
    badge: "شبکه‌های اجتماعی",
  },
  {
    title: "پیام‌ها و اعلان‌ها",
    desc: "تاریخچه پیام‌ها، وضعیت انتشار و اطلاعیه‌های سیستم",
    href: "/dashboard/my-messages",
    icon: "/icons/icon-bell-black.svg",
    badge: "پیام‌ها",
  },
  {
    title: "تنظیمات و فروشگاه",
    desc: "ویرایش پروفایل، تنظیمات فروشگاه و نشست‌های فعال",
    href: "/dashboard/settings/my-account",
    icon: "/icons/icon-shop.svg",
    badge: "پروفایل",
  },
];

export default function DashboardPage() {
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

  const mobileMenuItems = dashboardMenuItems.filter(
    (item) => item.href !== "/dashboard",
  );

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header selectedMenu="dashboard" />
      <main className="flex w-full max-w-7xl flex-col gap-6 pb-24 md:pb-8">
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          {/* Desktop Sidebar Menu */}
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>

          {/* Desktop Content Area */}
          <div className="relative hidden w-[938px] flex-col gap-6 md:flex">
            {/* User Welcome & Profile Header */}
            <div className="flex w-full flex-row items-center justify-between rounded-xl border border-grey-200 bg-white p-6 shadow-sm">
              <div className="flex flex-row items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#E8D0AB] bg-biege-200">
                  <Image
                    src="/icons/icon-avatar-black.svg"
                    alt=""
                    width={32}
                    height={32}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-grey">
                      سلام، {auth.name || "کاربر گرامی"} خوش آمدید
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-brown">
                      پنل مدیریت
                    </span>
                  </div>
                  <p className="text-sm font-normal text-grey-600">
                    شماره تماس:{" "}
                    <span className="font-medium text-grey">
                      {persianNumber(auth.phoneNumber) || "---"}
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/settings/my-account"
                  className="flex items-center gap-2 rounded-lg border border-grey-200 bg-neutral px-4 py-2.5 text-sm font-medium text-grey transition-colors hover:bg-grey-100"
                >
                  <Image
                    src="/icons/icon-user.svg"
                    alt=""
                    width={18}
                    height={18}
                  />
                  <span>ویرایش حساب کاربری</span>
                </Link>
              </div>
            </div>

            {/* Financial and Gift Row */}
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
              {/* Wallet Balance Card */}
              <div className="flex flex-col justify-between rounded-xl border border-grey-200 bg-white p-6 shadow-sm">
                <div>
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-biege-200">
                        <Image
                          src="/icons/icon-wallet.svg"
                          alt=""
                          width={22}
                          height={22}
                        />
                      </div>
                      <span className="text-base font-semibold text-grey">
                        کیف پول من
                      </span>
                    </div>
                    <Link
                      href="/dashboard/my-transactions/all"
                      className="flex items-center gap-1 text-xs font-medium text-blue hover:underline"
                    >
                      <span>تراکنش‌ها</span>
                      <Image
                        src="/icons/icon-arrow-left.svg"
                        alt=""
                        width={14}
                        height={14}
                      />
                    </Link>
                  </div>
                  <div className="py-2">
                    <p className="text-xs text-grey-500">موجودی قابل استفاده</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      {loading ? (
                        <Skeleton variant="rounded" width={160} height={36} />
                      ) : walletBalance ? (
                        <>
                          <span className="text-3xl font-extrabold text-grey">
                            {persianNumber(walletBalance.availableBalance)}
                          </span>
                          <span className="text-sm font-normal text-grey-600">
                            تومان
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-red-500">
                          عدم دسترسی به موجودی
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-4">
                  <WalletChargeDialog isProfile />
                </div>
              </div>

              {/* Gift / Voucher Banner Card */}
              <div className="flex flex-col justify-between rounded-xl border border-[#E8D0AB] bg-[#FAF5E8] p-6 shadow-sm">
                <div>
                  <div className="flex items-center gap-2.5 pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FBEFD2]">
                      <Image
                        src="/icons/calendar-percent.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                    </div>
                    <span className="text-base font-semibold text-grey">
                      کد هدیه و تخفیف
                    </span>
                  </div>
                  <p className="pt-2 text-sm leading-6 text-brown">
                    کد هدیه یا کوپن تخفیف دارید؟ با ثبت آن می‌توانید موجودی کیف
                    پول خود را افزایش دهید یا اشتراک‌های ویژه را فعال کنید.
                  </p>
                </div>
                <div className="pt-4">
                  <Link
                    href="/dashboard/plans"
                    className="flex w-fit items-center gap-2 rounded-lg bg-grey px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-grey-900"
                  >
                    <span>مشاهده بسته‌ها و تخفیف‌ها</span>
                    <Image
                      src="/icons/icon-arrow-left-white.svg"
                      alt=""
                      width={16}
                      height={16}
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Registration Banner */}
            <div className="flex w-full flex-row items-center justify-between rounded-xl border border-[#FDC43D] bg-[#FFFBF0] px-6 py-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                  <Image
                    src="/icons/icon-plus-black.svg"
                    alt=""
                    width={26}
                    height={26}
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-grey">
                    ثبت آگهی جدید در روبوروند
                  </h3>
                  <p className="text-xs text-grey-600">
                    سیم‌کارت‌های تکی یا بسته‌های خود را به سادگی آگهی کنید و به
                    خریداران سراسر کشور نمایش دهید.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard/add/simcard"
                  className="flex items-center gap-1.5 rounded-lg bg-grey px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-grey-900"
                >
                  <Image
                    src="/icons/icon-plus-white.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span>ثبت سیم‌کارت</span>
                </Link>
                <Link
                  href="/dashboard/add/sim-pack"
                  className="flex items-center gap-1.5 rounded-lg border border-grey-300 bg-white px-4 py-2.5 text-xs font-semibold text-grey transition-colors hover:bg-grey-100"
                >
                  <Image
                    src="/icons/icon-double-sim.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span>ثبت سیم‌پک</span>
                </Link>
                <Link
                  href="/dashboard/add/sim-khast"
                  className="flex items-center gap-1.5 rounded-lg border border-grey-300 bg-white px-4 py-2.5 text-xs font-semibold text-grey transition-colors hover:bg-grey-100"
                >
                  <Image
                    src="/icons/icon-simcard-check.svg"
                    alt=""
                    width={16}
                    height={16}
                  />
                  <span>ثبت سیم‌خواست</span>
                </Link>
              </div>
            </div>

            {/* Quick Access Grid Section */}
            <div className="flex w-full flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-grey">
                  دسترسی سریع به بخش‌های پیشخوان
                </h2>
                <span className="text-xs text-grey-500">
                  همه امکانات و خدمات در دسترس شما
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {quickAccessItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="group flex flex-col justify-between rounded-xl border border-grey-200 bg-white p-5 transition-all duration-200 hover:border-grey-400 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral transition-colors group-hover:bg-biege-200">
                          <Image
                            src={item.icon}
                            alt=""
                            width={22}
                            height={22}
                            className="object-contain"
                          />
                        </div>
                        <span className="rounded bg-grey-100 px-2 py-0.5 text-[11px] font-medium text-grey-700">
                          {item.badge}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-grey transition-colors group-hover:text-black">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-xs leading-5 text-grey-500">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-grey-100 pt-3 text-xs font-medium text-grey-600 transition-colors group-hover:text-blue">
                      <span>مشاهده و مدیریت</span>
                      <Image
                        src="/icons/icon-arrow-left.svg"
                        alt=""
                        width={14}
                        height={14}
                        className="transition-transform group-hover:-translate-x-1"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Content Area */}
          <div className="flex w-full flex-col p-4 pb-24 md:hidden">
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
                  <p className="text-sm font-normal leading-4 text-grey">
                    کد هدیه
                  </p>
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
              {mobileMenuItems.map((item, index) => (
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
                  {index !== mobileMenuItems.length - 1 && (
                    <div className="h-[1px] w-[90%] border-t border-grey-100" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer selectedMenu="dashboard" />
    </div>
  );
}
