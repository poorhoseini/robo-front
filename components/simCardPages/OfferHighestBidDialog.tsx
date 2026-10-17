"use client";

import theme from "@/app/theme";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import { TouchEvent, forwardRef, useState } from "react";
import OfferHighestBidCard from "./OfferHighestBidCard";
import { HighestBid } from "@/lib/entities/highestBid";

export default function OfferHighestBidDialog({
  highestBidData,
}: {
  highestBidData: HighestBid;
}) {
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [draggable, setDraggable] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-full w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
      >
        ثبت پیشنهاد
      </button>

      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{ sx: { width: "100%", borderRadius: "12px" } }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-6 pb-0 pt-[26px]"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-base font-medium text-grey">پیشنهاد شما</span>
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
        <DialogContent sx={{ pb: "32px", pt: "44px", px: "24px" }}>
          <OfferHighestBidCard highestBidData={highestBidData} />
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
