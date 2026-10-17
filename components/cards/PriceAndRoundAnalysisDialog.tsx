"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { TouchEvent, useCallback, useEffect, useState } from "react";
import SimDetailsStep from "../analysis/SimDetailsStep";
import RoundResultStep from "../analysis/RoundResultStep";
import {
  useAnalysisActions,
  useAnalysisType,
  useStep,
} from "@/lib/zustand/analysis";
import PhoneNumberStep from "../analysis/PhoneNumberStep";
import { GetRoundTypesResponseProps } from "@/lib/entities/roundType";
import getRoundTypes from "@/lib/api/getRoundTypeList";

export default function PriceAndRoundAnalysisDialog({
  type,
}: {
  type: "button" | "card";
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const analysisType = useAnalysisType();
  const step = useStep();
  const { setRoundTypesList } = useAnalysisActions();

  const handleFetchRoundTypesList = useCallback(async () => {
    try {
      const roundTypesResponse: GetRoundTypesResponseProps =
        await getRoundTypes();
      const roundTypesList = Object.values(roundTypesResponse?.data || {});
      setRoundTypesList(roundTypesList);
    } catch (error) {
      setRoundTypesList([]);
    }
  }, [setRoundTypesList]);

  useEffect(() => {
    if (!open) return;

    handleFetchRoundTypesList();
  }, [handleFetchRoundTypesList, open]);

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
          className="flex w-[464px] cursor-pointer flex-col items-center justify-start gap-6 rounded-xl border border-grey-200 bg-white p-6 text-grey"
          onClick={handleOpen}
        >
          <div className="flex w-full flex-row items-center justify-start gap-2">
            <Image
              src="/icons/icon-analysis.svg"
              alt=""
              width={24}
              height={24}
            />
            <h3 className="text-xl font-medium">
              آنالیز نوع رند و تخمین قیمت سیم کارت
            </h3>
          </div>
          <p className="text-lg font-normal">
            شما می‌توانید سیم کارت مورد نظر خود را به کمک هوش مصنوعی طراحی شده
            آنالیز کنید.
          </p>
          <div className="flex w-full flex-row items-center justify-end gap-2">
            <p className="text-lg font-medium text-blue">آنالیز و تخمین قیمت</p>
            <Image
              src="/icons/icon-arrow-left.svg"
              alt="Enter"
              width={18}
              height={18}
            />
          </div>
        </div>
      ) : (
        <button onClick={handleOpen}>قیمت گذاری و آنالیز</button>
      )}

      <Dialog
        disablePortal
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
            backgroundColor: "#F8F9FB",
            border: "1px solid #D9D9D9",
          },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-8 pt-6"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-2xl font-medium text-grey">
              {step === 1 || step === 2
                ? "آنالیز و تخمین رند"
                : step === 3
                  ? analysisType === "ai"
                    ? "قیمت گذاری سیم کارت توسط هوش مصنوعی "
                    : analysisType === "expert"
                      ? "قیمت گذاری دقیق"
                      : "نامشخص"
                  : step === 4
                    ? "روش‌های پرداخت"
                    : `step ${step}`}
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
          sx={{ p: "48px", pt: "24px", pb: "32px", overflowY: "visible" }}
        >
          {loading ? (
            <SkeletonComponent />
          ) : step === 1 ? (
            <PhoneNumberStep />
          ) : step === 2 ? (
            <RoundResultStep />
          ) : step === 3 ? (
            <SimDetailsStep />
          ) : (
            <div>next steps</div>
          )}
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

function SkeletonComponent() {
  return (
    <div className="flex w-full flex-row items-start gap-8">
      <div className="flex w-full flex-col gap-5 rounded-2xl border border-grey-200 bg-white p-6">
        <Skeleton variant="rounded" height={64} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
      </div>
      <div className="flex min-w-[440px] flex-col gap-5 rounded-2xl border border-grey-200 bg-white p-6">
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={64} />
      </div>
    </div>
  );
}
