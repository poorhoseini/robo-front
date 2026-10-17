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
import TotalFiltersBadge from "./TotalFiltersBadge";
import FiltersForm from "./FiltersForm";
import { SearchType } from "@/lib/entities/api";
import { RoundType } from "@/lib/entities/roundType";
import { Province } from "@/lib/entities/province";

export default function FiltersFormDialog({
  screen = "small",
  filtersCount,
  searchType,
  preNumber = "",
  code = "",
  digit1 = "",
  digit2 = "",
  digit3 = "",
  digit4 = "",
  digit5 = "",
  digit6 = "",
  minPrice = "",
  maxPrice = "",
  roundTypesList = [],
  roundTypes = "",
  provincesList = [],
  provinces = "",
  operator = "",
  simCardType = "",
  simCardState = "",
  hasDiscount = "",
  isHighestBid = "",
  hasPrice = "",
  advertiserType = "",
  simPackCounts = "",
  simPackType = "",
}: {
  screen?: "small" | "large";
  filtersCount: number;
  searchType: SearchType;
  preNumber?: string;
  code?: string;
  digit1?: string;
  digit2?: string;
  digit3?: string;
  digit4?: string;
  digit5?: string;
  digit6?: string;
  minPrice?: string;
  maxPrice?: string;
  roundTypesList?: RoundType[];
  roundTypes?: string;
  provincesList?: Province[];
  provinces?: string;
  operator?: string;
  simCardType?: string;
  simCardState?: string;
  hasDiscount?: string;
  isHighestBid?: string;
  hasPrice?: string;
  advertiserType?: string;
  simPackCounts?: string;
  simPackType?: string;
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
        className={`flex flex-row items-center justify-between gap-2 rounded-lg bg-secondary text-grey ${screen === "large" ? "h-12 px-6 py-3 text-lg font-medium" : "h-8 px-3 text-xs font-normal"}`}
      >
        <Image
          src="/icons/icon-filters.svg"
          alt="Filters"
          width={16}
          height={16}
        />
        <h2 className="font-normal">فیلتر</h2>
        <TotalFiltersBadge count={filtersCount} />
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
            <span className="text-base font-medium text-grey">فیلتر</span>
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
        <DialogContent sx={{ px: "24px", py: 0 }}>
          <FiltersForm
            screen={screen}
            searchType={searchType}
            preNumber={preNumber}
            code={code}
            digit1={digit1}
            digit2={digit2}
            digit3={digit3}
            digit4={digit4}
            digit5={digit5}
            digit6={digit6}
            minPrice={minPrice}
            maxPrice={maxPrice}
            roundTypesList={roundTypesList}
            roundTypes={roundTypes}
            provincesList={provincesList}
            provinces={provinces}
            operator={operator}
            simCardType={simCardType}
            simCardState={simCardState}
            hasDiscount={hasDiscount}
            isHighestBid={isHighestBid}
            hasPrice={hasPrice}
            advertiserType={advertiserType}
            simPackCounts={simPackCounts}
            simPackType={simPackType}
            onFinish={handleClose}
          />
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

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}
