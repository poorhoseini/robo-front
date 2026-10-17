"use client";

import { AppliedCart } from "@/lib/entities/applyCart";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { TouchEvent, useState } from "react";

export default function ApplyCartModal({
  open,
  handleClose,
  applyCartData,
}: {
  open: boolean;
  handleClose: () => void;
  applyCartData?: AppliedCart;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  if (!applyCartData) return <></>;

  return (
    <Dialog
      open={open}
      draggable={draggable}
      onTouchMove={handleTouchMove}
      onClose={handleClose}
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          width: "1032px",
          maxWidth: "1032px",
          height: "774px",
          borderRadius: "24px",
          backgroundColor: "#404040",
        },
      }}
    >
      <div className="fixed top-0 h-0 inset-x-0 flex justify-center pointer-events-none">
        <div className="absolute -top-4 flex h-[120px] w-[120px] items-center justify-center rounded-full bg-grey shadow-[0_10px_27px_0_#00000029]">
          <Image
            src="/icons/icon-check-green-circle.svg"
            alt=""
            width={70}
            height={70}
          />
        </div>
      </div>
      <div
        onTouchStart={() => setDraggable(true)}
        onTouchEnd={() => setDraggable(false)}
        className="flex flex-row items-center justify-end px-8 pt-6"
      >
        <IconButton onClick={handleClose}>
          <Image
            src="/icons/icon-close-white.svg"
            alt="Close Modal"
            width={32}
            height={32}
          />
        </IconButton>
      </div>
      <DialogContent sx={{ p: "48px", pt: "70px", pb: "32px" }}>
        <div className="flex w-full flex-col items-center">
          <h1 className="text-[32px] font-semibold leading-8 text-white">
            درخواست شما با موفقیت ثبت شد
          </h1>
          <div className="mt-8 w-[510px] border-t border-t-[#FFFFFF29]" />
          <h2 className="mt-8 text-2xl font-normal leading-6 text-[#cacaca]">
            تعداد سرویس
          </h2>
          <p className="mt-4 text-[28px] font-semibold leading-[38px] text-white">
            {persianNumber(applyCartData.count) + " عدد"}
          </p>
          <h2 className="mt-6 text-2xl font-normal leading-6 text-[#cacaca]">
            نوع سرویس
          </h2>
          <p className="mt-4 text-[28px] font-semibold leading-[38px] text-white">
            {applyCartData.serviceNameFa}
          </p>
          {/* continue adding price here 
          <div className="mt-12 flex w-[696px] flex-row items-center justify-center gap-4 rounded-lg bg-biege p-6">
            <p className="w-full text-2xl font-medium leading-8 text-grey">
              می‌توانید با یک کلیک این سیم کارت‌ها را در کانال‌های ارتباطی خود
              انتشار دهید.
            </p>
            <Link
              href="/"
              className="flex h-[56px] min-w-[224px] items-center justify-center rounded-md bg-grey text-[17px] font-bold leading-6 text-white"
            >
              انتشار در کانال
            </Link>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
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
