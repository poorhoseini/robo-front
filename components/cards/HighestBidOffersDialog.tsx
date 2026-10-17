"use client";

import theme from "@/app/theme";
import { HighestBidOffer } from "@/lib/entities/highestBid";
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

export default function HighestBidOffersDialog({
  offers,
}: {
  offers: HighestBidOffer[];
}) {
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
        className="flex flex-row items-center gap-1 text-xs font-normal md:text-sm md:font-medium"
        onClick={handleOpen}
      >
        <p>سایر پیشنهادات ثبت شده</p>
        <Image
          src="/icons/icon-chevron-left.svg"
          alt="View Offers"
          width={16}
          height={16}
        />
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
          className="flex flex-row items-center justify-between p-8 pb-0"
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
        <DialogContent sx={{ pb: "32px", pt: "48px", px: 0 }}>
          <div className="flex w-full flex-col items-center">
            {offers
              .sort((a, b) =>
                a.createDate < b.createDate
                  ? 1
                  : a.createDate > b.createDate
                    ? -1
                    : 0,
              )
              .map((offer, index) => (
                <div
                  key={index}
                  className={`relative flex w-full flex-row items-center justify-between px-6 py-4 after:absolute after:bottom-0 after:left-0 after:right-0 after:ml-auto after:mr-auto after:h-[1px] after:w-[85%] after:bg-grey-100 after:content-[''] ${!index ? "bg-biege-200" : ""}`}
                >
                  <div className="flex flex-col items-start gap-2">
                    {!index && (
                      <p className="text-sm font-normal text-grey">
                        بالاترین پیشنهاد
                      </p>
                    )}
                    <div className="flex flex-row items-center gap-2 text-sm font-normal text-grey">
                      <p>
                        {moment
                          .unix(offer.createDate)
                          .toDate()
                          .toLocaleDateString("fa-IR")}
                      </p>
                      <VerticalLine />
                      <p>
                        {moment
                          .unix(offer.createDate)
                          .toDate()
                          .toLocaleTimeString("fa-IR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-[2px]">
                    <p className="text-2xl font-bold text-blue">
                      {persianNumber(offer.bidPrice)}
                    </p>
                    <p className="text-[10px] font-light text-grey">تومان</p>
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
