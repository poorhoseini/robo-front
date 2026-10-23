"use client";

import React, { TouchEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Slide,
  TextField,
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
import { englishNumber, persianNumber } from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { Controller, useForm } from "react-hook-form";
import {
  PreSetDiscountFormProps,
  PreSetDiscountRequestProps,
  PreSetDiscountResponseProps,
} from "@/lib/entities/preSetDiscount";
import preSetDiscount from "@/lib/api/preSetDiscount";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";
import { SimPack } from "@/lib/entities/simPack";
import { SimKhast } from "@/lib/entities/simKhast";

export default function DiscountModal({
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

  const {
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<PreSetDiscountFormProps>({
    defaultValues: {
      offPercent: "",
    },
  });

  const hasSingleItem = selectedItems.length === 1;
  const currentItem = selectedItems[0] as SingleSimCard | SimPack | undefined;
  const isNegotiable =
    hasSingleItem && currentItem?.priceType === 1;

  const currentPrice = hasSingleItem
    ? currentItem?.price || 0
    : selectedItems.reduce(
        (acc, item) =>
          acc + ((item as SingleSimCard | SimPack)?.price || 0),
        0,
      );

  const currentPriceText = isNegotiable
    ? "توافقی"
    : currentPrice
      ? `${persianNumber(currentPrice)} تومان`
      : "نامشخص";

  const watchOffPercent = watch("offPercent");
  const offPercentNum = Number(englishNumber(watchOffPercent || ""));
  const hasValidDiscount =
    !isNegotiable &&
    currentPrice > 0 &&
    offPercentNum >= 1 &&
    offPercentNum <= 49;

  const discountedPrice = hasValidDiscount
    ? Math.round(currentPrice * (1 - offPercentNum / 100))
    : undefined;

  useEffect(() => {
    if (!open) {
      reset({ offPercent: "" });
    }
  }, [open, reset]);

  async function handleSubmitPreDiscount(vals: PreSetDiscountFormProps) {
    setLoading(true);

    const payload: PreSetDiscountRequestProps = {
      refrence: serviceType,
      offPercent: Number(englishNumber(vals.offPercent)),
      refrenceIds: selectedItems.map((item) => item._id),
      socialReply: true,
    };

    try {
      const response: PreSetDiscountResponseProps = await preSetDiscount(
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
        toast.error("خطا در اعمال تخفیف سیم کارت");
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
        <form onSubmit={handleSubmit(handleSubmitPreDiscount)}>
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
                {serviceType === "simcard" ||
                serviceType === "simcardHighBid" ? (
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
                      تخفیف
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
                  <div className="flex w-full flex-row items-center justify-between">
                    <p className="text-sm font-normal leading-5 text-grey md:text-base">
                      {hasSingleItem ? "قیمت سیم کارت" : "مجموع قیمت سیم کارت‌ها"}
                    </p>
                    <p className="text-sm font-medium text-grey md:text-base">
                      {currentPriceText}
                    </p>
                  </div>
                  <HorizontalLine />
                  <div className="item-start flex w-full flex-col justify-between gap-2 md:flex-row md:items-center">
                    <p className="shrink-0 text-sm font-normal leading-5 text-grey md:text-base">
                      درصد تخفیف را وارد کنید
                    </p>
                    <div className="h-12 w-full md:h-14">
                      <Controller
                        control={control}
                        name="offPercent"
                        rules={{ required: true }}
                        render={({
                          field: { onChange, onBlur, value, ref },
                        }) => (
                          <TextField
                            id="pre-number-select"
                            label="درصد تخفیف بین ۱ تا ۴۹"
                            value={value}
                            onChange={(e) => {
                              const val = e.target.value;
                              const lastChar = val.slice(-1);
                              if (val && !numberInputRegex.test(lastChar)) return;
                              const engVal = Number(englishNumber(val));
                              if (val && (isNaN(engVal) || engVal > 49)) return;
                              onChange(val);
                            }}
                            onBlur={onBlur}
                            inputRef={ref}
                            inputProps={{ inputMode: "numeric" }}
                            sx={{
                              width: "100%",
                              height: "100%",
                              borderRadius: "8px",
                              "& .MuiInputBase-root": {
                                height: "100%",
                              },
                            }}
                            variant="outlined"
                            error={!!errors.offPercent}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{
                                    "& p": { fontSize: 12, fontWeight: 500 },
                                  }}
                                >
                                  درصد
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>
                  {discountedPrice !== undefined && (
                    <>
                      <HorizontalLine />
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-sm font-normal leading-5 text-grey md:text-base">
                          {hasSingleItem ? "قیمت پس از تخفیف" : "مجموع قیمت پس از تخفیف"}
                        </p>
                        <p className="text-base font-bold text-primary md:text-lg">
                          {`${persianNumber(discountedPrice)} تومان`}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="hidden w-full md:flex">
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
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
              disabled={loading}
              type="submit"
              className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold leading-6 text-white"
            >
              {loading ? <Spinner /> : "تایید"}
            </button>
          </div>
        </form>
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
