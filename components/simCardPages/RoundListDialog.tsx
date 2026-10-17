"use client";

import theme from "@/app/theme";
import { RoundData } from "@/lib/entities/round";
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
import Image from "next/image";
import { ReactNode, TouchEvent, forwardRef, useState } from "react";

export default function RoundListDialog({
  roundData,
  content,
}: {
  roundData: RoundData;
  content: ReactNode;
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
    <div className="flex w-full flex-col gap-3 md:hidden">
      <HorizontalLine />
      <div className="flex w-full flex-row items-center justify-between pt-2 text-sm text-grey">
        <p className="font-normal">{`نوع رندی (${persianNumber(roundData.rondData.length)} نوع)`}</p>
        <button
          onClick={handleOpen}
          className="flex flex-row items-center gap-2"
        >
          <p className="font-medium">مشاهده</p>
          <Image
            src="/icons/icon-chevron-left-blue.svg"
            alt="See Round Info"
            width={20}
            height={20}
          />
        </button>
      </div>

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
            <span className="text-base font-medium text-grey">انواع رندی</span>
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
          <>{content}</>
        </DialogContent>
      </Dialog>
    </div>
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

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}
