"use client";

import { useContext, useEffect, useState } from "react";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import endUserSession from "@/lib/api/endUserSession";
import endAllOtherUserSessions from "@/lib/api/endAllOtherUserSessions";
import getUserStores from "@/lib/api/getUserStores";
import {
  SearchStoresResponseProps,
  UserProfileStore,
} from "@/lib/entities/store";
import UserProfileStoreSkeleton from "../skeletons/UserProfileStoreSkeleton";
import Space from "../general/Space";
import Image from "next/image";
import AdvertiserCard from "../simCardPages/AdvertiserCard";
import UserProfileStoreMutationDialog from "./UserProfileStoreMutationDialog";

export default function UserProfileStoreSection() {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<UserProfileStore[]>(
    [],
  );
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingEndSession, setLoadingEndSession] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();
  const [selectedUserStore, setSelectedUserStore] =
    useState<UserProfileStore>();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    if (!auth.token) return;

    setClientSideResult([]);
    setSkip(0);
    handleGetNewResults(0);
  }, [auth.token]);

  async function handleGetNewResults(skip: number) {
    if (skip > clientSideResult!.length) return;

    setLoading(true);

    try {
      const userSessions: SearchStoresResponseProps = await getUserStores(
        auth.token,
        9,
        [],
        { field: "_id", order: -1 },
        skip,
      );
      setClientSideResult((prev) => [
        ...prev,
        ...userSessions.data.filter(
          (newItem) => !prev.some((item) => item._id === newItem._id),
        ),
      ]);
      setSkip((prev) => prev + 9);
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
        toast.error("خطا در دریافت اطلاعات فروشگاه");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession(sessionId?: string) {
    if (!sessionId) return;

    setLoadingEndSession(true);
    try {
      const res = await endUserSession(auth.token, sessionId);
      setClientSideResult([]);
      setSkip(0);
      handleGetNewResults(0);
      handleClose();
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
        toast.error("خطا در بستن نشست");
      }
    } finally {
      setLoadingEndSession(false);
    }
  }

  async function handleEndAllOtherSessions() {
    setLoadingEndSession(true);
    try {
      const res = await endAllOtherUserSessions(auth.token);
      setClientSideResult([]);
      setSkip(0);
      handleGetNewResults(0);
      handleClose();
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
        toast.error("خطا در بستن سایر نشست ها");
      }
    } finally {
      setLoadingEndSession(false);
    }
  }

  if (loading) return <UserProfileStoreSkeleton />;

  if (clientSideResult.length)
    return (
      <div className="flex w-full flex-col items-center">
        <div className="flex w-full flex-row items-start gap-3 rounded-lg border border-[#E8D0AB] bg-[#FAF5E8] px-6 py-4">
          <Image src="/icons/warning-black.svg" alt="" width={24} height={24} />
          <p className="text-lg font-normal leading-[30px] text-grey">
            در حال حاضر اطلاعات تماس فروشگاه برای آگهی‌های شما نمایش داده خواهد
            شد. با حذف فروشگاه اطلاعات تماس شخصی شما نمایش داده خواهد شد.
          </p>
        </div>
        <Space value={24} />
        <AdvertiserCard
          userProfilePage
          searchPage
          isStore={true}
          user={[]}
          store={{
            _id: clientSideResult[0]._id,
            storeName: clientSideResult[0].storeName,
            storeType: clientSideResult[0].storeType,
            services: clientSideResult[0].services,
            addresses: clientSideResult[0].addresses,
            numbers: clientSideResult[0].numbers,
            telegram: "",
            viewsCount: clientSideResult[0].viewsCount,
          }}
          onFinishDelete={() => {
            setClientSideResult([]);
            setSkip(0);
            handleGetNewResults(0);
          }}
        />
      </div>
    );

  return (
    <div className="flex w-full flex-row items-end justify-between gap-2 rounded-xl border border-grey-300 bg-white p-6">
      <div className="flex w-full flex-col items-start">
        <h2 className="text-xl font-medium leading-6 text-grey">
          مزیت‌های ثبت فروشگاه:
        </h2>
        <Space value={24} />
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/icon-check-biege-circle.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="text-base font-normal leading-5 text-grey">
            نمایش اطلاعات تماس فروشگاه به جای شماره شخصی.
          </span>
        </div>
        <Space value={16} />
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/icon-check-biege-circle.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="text-base font-normal leading-5 text-grey">
            نمایش آدرس‌های فروشگاه
          </span>
        </div>
        <Space value={16} />
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/icon-check-biege-circle.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="text-base font-normal leading-5 text-grey">
            ایجاد پیج شخصی برای فروشگاه شما
          </span>
        </div>
        <Space value={16} />
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/icon-check-biege-circle.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="text-base font-normal leading-5 text-grey">
            امکان جستجو کاربران در آگهی‌های شما
          </span>
        </div>
        <Space value={16} />
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/icon-check-biege-circle.svg"
            alt=""
            width={18}
            height={18}
          />
          <span className="text-base font-normal leading-5 text-grey">
            امکان ثبت فروشگاه در ویترین
          </span>
        </div>
      </div>
      <UserProfileStoreMutationDialog
        onFinish={() => {
          setClientSideResult([]);
          setSkip(0);
          handleGetNewResults(0);
        }}
      />
    </div>
  );
}
