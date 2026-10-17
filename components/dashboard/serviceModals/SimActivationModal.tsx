"use client";

import React, { TouchEvent, useContext, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import {
  useGroupOperationActions,
  useSelectedItems,
  useServiceType,
} from "@/lib/zustand/groupOperation";
import { SingleSimCard } from "@/lib/entities/singleSimCard";
import SavedItemCardClient from "@/components/forms/dashboard/SavedItemCardClient";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";
import changeSimActivation from "@/lib/api/changeSimActivation";
import { useRouter } from "next/navigation";
import {
  ChangeSimActivationRequestProps,
  ChangeSimActivationResponseProps,
} from "@/lib/entities/changeSimActivation";
import { SimKhast } from "@/lib/entities/simKhast";
import { SimPack } from "@/lib/entities/simPack";

export default function SimActivationModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const router = useRouter();
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const selectedItems = useSelectedItems();
  const serviceType = useServiceType();
  const { removeItem, flushItems } = useGroupOperationActions();
  const { auth } = useContext(AuthContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activation, setActivation] = useState<"active" | "deactive">();

  async function handleSubmitPreDiscount() {
    if (!activation) return;

    setLoading(true);

    const payload: ChangeSimActivationRequestProps = {
      refrence: serviceType,
      refrenceIds: selectedItems.map((item) => item._id),
      state: activation === "active",
      socialReply: true,
    };

    try {
      const response: ChangeSimActivationResponseProps =
        await changeSimActivation(auth.token, payload);
      flushItems();
      handleClose();
      router.refresh();
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
        toast.error("خطا در تغییر وضعیت سیم کارت");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

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
          ...(!fullScreen && { height: "774px" }),
          ...(fullScreen && { paddingBottom: "104px" }),
          borderRadius: "24px",
          backgroundColor: "#F8F9FB",
          border: "1px solid #D9D9D9",
        },
      }}
    >
      <div
        onTouchStart={() => setDraggable(true)}
        onTouchEnd={() => setDraggable(false)}
        className="flex flex-row items-center justify-between px-6 pb-0 pt-[26px]"
      >
        <DialogTitle sx={{ p: 0 }} component="h1">
          <span className="text-xl font-medium leading-6 text-grey">
            سیم کارت‌های انتخابی
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
          p: fullScreen ? "24px" : "32px",
          overflowY: "visible",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="flex w-full flex-col items-start gap-4 md:flex-row md:gap-8">
          <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4 md:min-w-[464px] md:p-6">
            {serviceType === "simcard" || serviceType === "simcardHighBid" ? (
              (selectedItems as SingleSimCard[]).map((item) => (
                <SavedItemCardClient
                  key={item._id}
                  serviceType={serviceType}
                  phoneNumber={[item.sellerSpel]}
                  cityName={item.cityFa}
                  provinceName={item.provinceFa}
                  simCardState={item.state}
                  priceType={item.priceType}
                  price={item.price}
                  roundLevelsFa={item.rondData.rondLevelsFa}
                  hasInstallmentPlan={item.isInstallment}
                  onDelete={() => removeItem(item)}
                />
              ))
            ) : serviceType === "simPack" ||
              serviceType === "simPackHighBid" ? (
              (selectedItems as SimPack[]).map((item) => (
                <SavedItemCardClient
                  key={item._id}
                  serviceType={serviceType}
                  phoneNumber={item.simcards.map(
                    (simcard) => simcard.sellerSpel,
                  )}
                  cityName={item.cityFa}
                  provinceName={item.provinceFa}
                  simPackType={item.simPackType}
                  priceType={item.priceType}
                  price={item.price}
                  hasInstallmentPlan={item.isInstallment}
                  onDelete={() => removeItem(item)}
                />
              ))
            ) : serviceType === "specialSim" ? (
              (selectedItems as SimKhast[]).map((item) => (
                <SavedItemCardClient
                  key={item._id}
                  serviceType={serviceType}
                  phoneNumber={[item.condition.sellerSpel]}
                  operator={item.condition.operator}
                  maxPrice={item.condition.maxPrice}
                  minPrice={item.condition.minPrice}
                  cityName={item.condition.cityFa}
                  provinceName={item.condition.provinceFa}
                  simCardState={item.condition.state}
                  roundLevelsFa={item.condition.rondLevelsFa}
                  onDelete={() => removeItem(item)}
                />
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="w-full rounded-2xl border border-grey-200 bg-white p-4 md:min-w-[440px] md:p-6">
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full flex-row items-center justify-between">
                <p className="text-sm font-normal leading-5 text-grey md:text-base">
                  نوع سرویس
                </p>
                <p className="text-sm font-medium text-grey md:text-base">
                  فعال یا غیر فعال سازی
                </p>
              </div>
              <HorizontalLine />
              <div className="flex w-full flex-row items-center justify-between">
                <p className="text-sm font-normal leading-5 text-grey md:text-base">
                  تعداد سرویس
                </p>
                <p className="text-sm font-normal leading-5 text-grey md:text-base">{`${persianNumber(selectedItems.length)} عدد`}</p>
              </div>
              <HorizontalLine />
              <p className="shrink-0 text-sm font-normal leading-5 text-grey md:text-base">
                تغییر وضعیت آگهی:
              </p>
              <ActivationSelector
                value={activation}
                onChange={(value) => setActivation(value)}
              />
              <div className="hidden w-full md:flex">
                <button
                  type="button"
                  disabled={loading || !activation}
                  className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
                  onClick={handleSubmitPreDiscount}
                >
                  {loading ? <Spinner /> : "تایید"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
        <button
          type="button"
          disabled={loading || !activation}
          className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white"
          onClick={handleSubmitPreDiscount}
        >
          {loading ? <Spinner /> : "تایید"}
        </button>
      </div>
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

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}

function ActivationSelector({
  value,
  onChange,
}: {
  value?: "active" | "deactive";
  onChange: (value: "active" | "deactive") => void;
}) {
  return (
    <div className="w-ful flex flex-row items-center justify-center gap-6">
      <RadioGroup
        value={value || null}
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          width: "100%",
          gap: "12px",
        }}
      >
        {activationOptions.map((option) => (
          <Button
            key={option.id}
            variant="text"
            size="large"
            type="button"
            sx={{
              width: "100%",
              backgroundColor: "white",
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              justifyContent: "space-between",
            }}
            onClick={() => onChange(option.value)}
          >
            <span className="text-sm font-normal leading-5">
              {option.label}
            </span>
            <Radio
              checked={value === option.value}
              value={"bale"}
              sx={{ mr: "-9px" }}
            />
          </Button>
        ))}
      </RadioGroup>
    </div>
  );
}

const activationOptions: Array<{
  id: number;
  label: string;
  value: "active" | "deactive";
}> = [
  {
    id: 1,
    label: "فعال سازی",
    value: "active",
  },
  {
    id: 2,
    label: "غیر فعال سازی",
    value: "deactive",
  },
];
