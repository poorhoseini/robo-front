"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { TouchEvent, useState } from "react";
import ResponsiveLink from "../general/ResponsiveLink";

export default function AdRegistrationDialog({
  type,
}: {
  type: "button" | "card";
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      {type === "card" ? (
        <div
          className="flex w-[464px] cursor-pointer flex-col items-center justify-start gap-6 rounded-xl border border-[#FDC43D] bg-biege-100 p-6 text-grey"
          onClick={handleOpen}
        >
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <Image
              src="/icons/icon-analysis.svg"
              alt="Price Estimation"
              width={24}
              height={24}
            />
            <h3 className="text-xl font-medium text-grey">ثبت آگهی</h3>
          </div>
          <p className="text-lg font-normal">
            انواع آگهی‌های خود را مربوط به سیم کارت تکی، گروهی و سیم خواست را
            اضافه کنید
          </p>
          <div className="flex w-full flex-row items-center justify-end gap-2">
            <p className="text-lg font-medium text-blue">ثبت آگهی</p>
            <Image
              src="/icons/icon-arrow-left.svg"
              alt="Enter"
              width={18}
              height={18}
            />
          </div>
        </div>
      ) : (
        <button
          onClick={handleOpen}
          className="flex flex-col flex-nowrap items-center justify-between gap-1 whitespace-nowrap md:min-h-[48px] md:min-w-[142px] md:flex-row md:gap-2 md:rounded-[100px] md:border-[1.5px] md:border-secondary md:bg-grey md:px-6 md:py-3 md:text-base md:font-medium md:text-secondary"
        >
          <picture>
            <source srcSet="/icons/icon-plus.svg" media="(max-width: 768px)" />
            <source
              srcSet="/icons/icon-plus-active.svg"
              media="(min-width: 769px)"
            />
            <Image
              src="/icons/icon-plus-active.svg"
              alt="Register Ad"
              width={24}
              height={24}
            />
          </picture>
          <p>ثبت آگهی</p>
        </button>
      )}

      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: { ...(!fullScreen && { width: "545px" }), borderRadius: "12px" },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between p-4 pb-0 md:p-8"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-xl font-medium leading-6 text-grey">
              سرویس‌ها
            </span>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent
          sx={{
            p: fullScreen ? "16px" : "32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex w-full flex-col gap-[10px] rounded-xl border border-grey-300 p-4">
            <div className="flex w-full flex-row items-center justify-start gap-[10px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDDCB4] bg-biege p-2">
                <Image
                  src={servicesModalData.simcard.src}
                  alt=""
                  width={24}
                  height={24}
                  className="min-h-6 min-w-6"
                />
              </div>
              <h3 className="text-base font-medium leading-5 text-grey">
                {servicesModalData.simcard.title}
              </h3>
            </div>
            {servicesModalData.simcard.items.map((item, index) => (
              <ResponsiveLink
                key={index}
                href={item.href}
                className="flex w-full flex-row items-center justify-between rounded-lg border border-grey-200 p-3"
              >
                <div className="flex w-full flex-col items-start gap-1">
                  <p className="text-sm font-medium leading-5 text-grey">
                    {item.title}
                  </p>
                  <p className="text-xs font-medium leading-5 text-grey-800">
                    {item.subTitle}
                  </p>
                </div>
                <Image
                  src="/icons/icon-plus-black.svg"
                  alt=""
                  width={25}
                  height={24}
                />
              </ResponsiveLink>
            ))}
          </div>
          <div className="flex w-full flex-col gap-[10px] rounded-xl border border-grey-300 p-4">
            <div className="flex w-full flex-row items-center justify-start gap-[10px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDDCB4] bg-biege p-2">
                <Image
                  src={servicesModalData.simpack.src}
                  alt=""
                  width={24}
                  height={24}
                  className="min-h-6 min-w-6"
                />
              </div>
              <h3 className="text-base font-medium leading-5 text-grey">
                {servicesModalData.simpack.title}
              </h3>
            </div>
            {servicesModalData.simpack.items.map((item, index) => (
              <ResponsiveLink
                key={index}
                href={item.href}
                className="flex w-full flex-row items-center justify-between rounded-lg border border-grey-200 p-3"
              >
                <div className="flex w-full flex-col items-start gap-1">
                  <p className="text-sm font-medium leading-5 text-grey">
                    {item.title}
                  </p>
                  <p className="text-xs font-medium leading-5 text-grey-800">
                    {item.subTitle}
                  </p>
                </div>
                <Image
                  src="/icons/icon-plus-black.svg"
                  alt=""
                  width={25}
                  height={24}
                />
              </ResponsiveLink>
            ))}
          </div>
          <div className="flex w-full flex-col gap-[10px] rounded-xl border border-grey-300 p-4">
            <div className="flex w-full flex-row items-center justify-start gap-[10px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EDDCB4] bg-biege p-2">
                <Image
                  src={servicesModalData.simkhast.src}
                  alt=""
                  width={24}
                  height={24}
                  className="min-h-6 min-w-6"
                />
              </div>
              <h3 className="text-base font-medium leading-5 text-grey">
                {servicesModalData.simkhast.title}
              </h3>
            </div>
            {servicesModalData.simkhast.items.map((item, index) => (
              <ResponsiveLink
                key={index}
                href={item.href}
                className="flex w-full flex-row items-center justify-between rounded-lg border border-grey-200 p-3"
              >
                <div className="flex w-full flex-col items-start gap-1">
                  <p className="text-sm font-medium leading-5 text-grey">
                    {item.title}
                  </p>
                  <p className="text-xs font-medium leading-5 text-grey-800">
                    {item.subTitle}
                  </p>
                </div>
                <Image
                  src="/icons/icon-plus-black.svg"
                  alt=""
                  width={25}
                  height={24}
                />
              </ResponsiveLink>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const servicesModalData = {
  simcard: {
    src: "/icons/icon-simcard.svg",
    title: "سیم کارت",
    items: [
      {
        title: "آگهی سیم کارت",
        subTitle:
          "می‌توانید سیم‌ کارت‌های خود را به صورت تکی و گروهی اضافه کنید.",
        href: "/dashboard/add/simcard",
      },
      {
        title: "آگهی سیم کارت با فایل اکسل",
        subTitle:
          "می‌توانید با آپلود فایل اکسل سیم کارت‌های خود را به صورت گروهی اضافه کنید. ",
        href: "/dashboard/add/excel",
      },
      {
        title: "بالاترین پیشنهاد",
        subTitle:
          "بالاترین پیشنهاد برای سیم کارت خود را با این نوع آگهی تجربه کنید.",
        href: "/dashboard/add/highest-bid-simcard",
      },
    ],
  },
  simpack: {
    src: "/icons/icon-simpack.svg",
    title: "سیم پک",
    items: [
      {
        title: "آگهی سیم کارت",
        subTitle: "می‌توانید سیم‌ پک خود را آگهی کنید.",
        href: "/dashboard/add/sim-pack",
      },
      {
        title: "بالاترین پیشنهاد",
        subTitle:
          "بالاترین پیشنهاد برای سیم پک خود را با این نوع آگهی تجربه کنید.",
        href: "/dashboard/add/highest-bid-simpack",
      },
    ],
  },
  simkhast: {
    src: "/icons/icon-sim-check.svg",
    title: "سیم خواست",
    items: [
      {
        title: "آگهی سیم کارت",
        subTitle:
          "می‌توانید برای خرید سیم‌ کارت‌ با مشخصات مورد نظر خود آگهی ثبت کنید.",
        href: "/dashboard/add/sim-khast",
      },
    ],
  },
};
