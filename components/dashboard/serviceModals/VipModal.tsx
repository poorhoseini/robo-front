"use client";

import React, { TouchEvent, useContext, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import Image from "next/image";
import CartModal from "@/components/cart/CartModal";
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
import {
  PreUpgradeSimRequestProps,
  PreUpgradeSimResponseProps,
} from "@/lib/entities/preUpgradeSim";
import preUpgradeSim from "@/lib/api/preUpgradeSim";
import { SimKhast } from "@/lib/entities/simKhast";
import { SimPack } from "@/lib/entities/simPack";

export default function VipModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const selectedItems = useSelectedItems();
  const serviceType = useServiceType();
  const { removeItem } = useGroupOperationActions();
  const { auth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [vip, setVip] = useState<string>();

  async function handleSubmitPreDiscount() {
    if (!vip) return;

    setLoading(true);

    const payload: PreUpgradeSimRequestProps = {
      refrence: serviceType,
      refrenceIds: selectedItems.map((item) => item._id),
      vipType: Number(vip),
    };

    try {
      const response: PreUpgradeSimResponseProps = await preUpgradeSim(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در اعمال تعیین سطح سیم کارت");
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
    <>
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
                    تعیین سطح
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
                  انتخاب سطح:
                </p>
                <VipSelector value={vip} onChange={(value) => setVip(value)} />
                <div className="hidden w-full md:flex">
                  <button
                    type="button"
                    disabled={loading || !vip}
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
            disabled={loading || !vip}
            className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white"
            onClick={handleSubmitPreDiscount}
          >
            {loading ? <Spinner /> : "تایید"}
          </button>
        </div>
      </Dialog>
      {!!cartId && <CartModal cartId={cartId} />}
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

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}

function VipSelector({
  value,
  onChange,
}: {
  value?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="w-ful flex flex-row items-center justify-center gap-1 md:gap-6">
      {vipOptions.map((option) => (
        <button
          key={option.id}
          className={`flex h-[60px] w-[118px] flex-row items-center justify-center gap-2 rounded-md border p-3 hover:bg-grey-100 ${value === option.value ? "border-black" : "border-grey-200"}`}
          onClick={() => onChange(option.value)}
        >
          <div className="relative h-[35px] w-8 min-w-8 md:h-[37px] md:w-[34px] md:min-w-[34px]">
            <Image src={option.imageSrc} alt="" fill />
          </div>
          <p className="text-nowrap text-sm font-normal leading-5 text-grey">
            {option.label}
          </p>
        </button>
      ))}
    </div>
  );
}

const vipOptions = [
  { id: 1, label: "طلایی", value: "3", imageSrc: "/icons/icon-medal-gold.svg" },
  {
    id: 2,
    label: "نقره ای",
    value: "2",
    imageSrc: "/icons/icon-medal-silver.svg",
  },
  {
    id: 3,
    label: "برنزی",
    value: "1",
    imageSrc: "/icons/icon-medal-bronze.svg",
  },
];
