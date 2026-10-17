"use client";

import theme from "@/app/theme";
import { Bid } from "@/lib/entities/bid";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import moment from "moment";
import Image from "next/image";
import { TouchEvent, forwardRef, useState } from "react";
import Space from "../general/Space";
import { getRemainingTimeDHM } from "@/lib/helpers/timeDifference";

export default function BidsDialog({ bids }: { bids: Bid[] }) {
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex w-full flex-row items-center justify-between"
      >
        <p className="text-base font-medium leading-5 text-grey">
          سایر پیشنهادات ثبت شده
        </p>
        <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-blue-900">
          <Image
            src="/icons/icon-arrow-left.svg"
            alt="Enter"
            width={16}
            height={16}
          />
        </div>
      </button>

      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{ sx: { width: "545px", borderRadius: "12px" } }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between p-4 pb-0 md:p-8"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-base font-medium text-grey">
              پیشنهادات ثبت شده
            </span>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close-circle.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent sx={{ p: fullScreen ? "16px" : "32px" }}>
          <ul className="flex w-full list-disc flex-col items-start gap-1 rounded-lg bg-blue-900 p-3 pr-6">
            <li className="text-sm font-medium leading-6 text-blue">
              <span className="text-grey">
                شماره تماس بالاترین پیشنهاد پس از اتمام زمان آگهی نمایش داده
                خواهد شد و بعد از آن شماره‌ تماس‌های پیشنهادات بعدی هر ۲۴ ساعت
                نمایش می‌شود.
              </span>
            </li>
            <li className="text-sm font-medium leading-6 text-blue">
              <span className="text-grey">
                شماره تماس شما پس از اتمام آگهی برای بالاترین پیشنهاد دهنده
                نمایش داده می‌شد
              </span>
            </li>
          </ul>
          <Space value={16} />
          <div className="flex w-full flex-col items-center gap-4">
            {bids
              .sort((a, b) =>
                a.createDate < b.createDate
                  ? 1
                  : a.createDate > b.createDate
                    ? -1
                    : 0,
              )
              .map((bid, index) => (
                <div
                  key={index}
                  className="flex w-full flex-col items-center rounded-xl border border-grey-200 p-3"
                >
                  <div className="flex w-full flex-row items-center justify-between">
                    <div className="flex flex-row items-center gap-2 text-sm font-normal leading-4 text-grey">
                      <Image
                        src="/icons/icon-calendar.svg"
                        alt=""
                        width={24}
                        height={23}
                      />
                      <p>
                        {moment
                          .unix(bid.createDate)
                          .toDate()
                          .toLocaleDateString("fa-IR")}
                      </p>
                      <VerticalLine />
                      <p>
                        {moment
                          .unix(bid.createDate)
                          .toDate()
                          .toLocaleTimeString("fa-IR")}
                      </p>
                    </div>
                    {!index && (
                      <div className="flex items-center justify-center rounded-lg bg-blue px-2 py-[2px] text-xs font-medium leading-5 text-white">
                        بالاترین پیشنهاد
                      </div>
                    )}
                  </div>
                  <Space value={12} />
                  <div className="flex w-full flex-row items-start justify-center gap-3">
                    <div className="flex w-full flex-col items-center">
                      <p className="text-sm font-normal leading-4 text-grey">
                        نمایش شماره تماس تا:
                      </p>
                      <Space value={12} />
                      <div className="flex w-full flex-row items-center justify-center gap-5">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-biege pt-1 text-xs md:text-sm">
                            {persianNumber(
                              (
                                "00" +
                                getRemainingTimeDHM(bid.visibleAt).minutes
                              ).slice(-2),
                            )}
                          </div>
                          <p className="text-xs font-light">دقیقه</p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-biege pt-1 text-xs md:text-sm">
                            {persianNumber(
                              (
                                "00" + getRemainingTimeDHM(bid.visibleAt).hours
                              ).slice(-2),
                            )}
                          </div>
                          <p className="text-xs font-light">ساعت</p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-biege pt-1 text-xs md:text-sm">
                            {persianNumber(
                              (
                                "00" + getRemainingTimeDHM(bid.visibleAt).days
                              ).slice(-2),
                            )}
                          </div>
                          <p className="text-xs font-light">روز</p>
                        </div>
                      </div>
                    </div>
                    <div className="h-20 w-[1px] bg-grey-100"></div>
                    <div className="flex w-full flex-col items-center">
                      <p className="text-sm font-normal leading-4 text-grey">
                        قیمت پیشنهاد شده:
                      </p>
                      <Space value={12} />
                      <div className="flex flex-row items-center gap-1 rounded-md bg-biege px-6 py-2">
                        <span className="text-base font-bold leading-5 text-grey">
                          {persianNumber(bid.bidPrice)}
                        </span>
                        <span className="text-[10px] font-light leading-5 text-grey">
                          تومان
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function VerticalLine() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}
