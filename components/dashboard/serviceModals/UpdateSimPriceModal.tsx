"use client";

import React, { TouchEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Radio,
  RadioGroup,
  Slide,
  TextField,
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
import { englishNumber, persianNumber } from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";
import { useRouter } from "next/navigation";
import {
  ChangeSimPriceRequestProps,
  ChangeSimPriceResponseProps,
} from "@/lib/entities/changeSimPrice";
import changeSimPrice from "@/lib/api/changeSimPrice";
import { SimKhast } from "@/lib/entities/simKhast";
import { SimPack } from "@/lib/entities/simPack";
import { ServiceType } from "@/lib/entities/landingPage";

import removeSimDiscount from "@/lib/api/removeSimDiscount";

export default function UpdateSimPriceModal({
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
  const [priceTypeRadioValue, setPriceTypeRadioValue] = useState<"0" | "1">();
  const [priceInputValue, setPriceInputValue] = useState<string>("");

  const cleanNumber = (val: string | number) => {
    const digits = englishNumber(String(val)).replace(/\D/g, "");
    return digits ? Number(digits) : 0;
  };

  const hasSingleItem = selectedItems.length === 1;
  const currentItem = selectedItems[0] as SingleSimCard | SimPack | undefined;
  const isNegotiable =
    hasSingleItem && currentItem?.priceType === 1;

  const hasExistingDiscount = Boolean(
    hasSingleItem &&
      ((currentItem?.offPercent !== undefined &&
        currentItem?.offPercent !== null &&
        currentItem.offPercent > 0) ||
        currentItem?.priceType === 3),
  );
  const existingOffPercent = currentItem?.offPercent;
  const existingOffPrice = currentItem?.offPrice;

  const normalizedRefrence: ServiceType =
    serviceType === "simcardHighBid"
      ? "simcard"
      : serviceType === "simPackHighBid"
        ? "simPack"
        : serviceType;

  const currentPriceText = isNegotiable
    ? "توافقی"
    : hasSingleItem
      ? currentItem?.price !== undefined && currentItem?.price !== null
        ? `${persianNumber(currentItem.price)} تومان`
        : "نامشخص"
      : `${persianNumber(
          selectedItems.reduce(
            (acc, item) =>
              acc + ((item as SingleSimCard | SimPack)?.price || 0),
            0,
          ),
        )} تومان`;

  useEffect(() => {
    if (open && selectedItems.length > 0) {
      const item = selectedItems[0] as SingleSimCard | SimPack;
      if (item) {
        if (item.priceType === 1) {
          setPriceTypeRadioValue("1");
          setPriceInputValue("");
        } else if (item.price !== undefined && item.price !== null) {
          setPriceTypeRadioValue("0");
          setPriceInputValue(item.price === 0 ? "" : Number(item.price).toLocaleString("fa-ir"));
        } else {
          setPriceTypeRadioValue(undefined);
          setPriceInputValue("");
        }
      }
    } else if (!open) {
      setPriceTypeRadioValue(undefined);
      setPriceInputValue("");
    }
  }, [open, selectedItems]);

  async function handleRemoveExistingDiscount() {
    const id = selectedItems.map((item) => item._id)[0];
    if (!id) return;
    setLoading(true);
    try {
      await removeSimDiscount(auth.token, {
        refrence: normalizedRefrence,
        refrenceIds: [id],
      });
      toast.success("تخفیف سیم کارت با موفقیت حذف شد");
      router.refresh();
      handleClose();
    } catch (err) {
      console.error(err);
      if (err instanceof ResponseError) {
        toast.error(err.printError());
      } else {
        toast.error("خطا در حذف تخفیف سیم کارت");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitPreDiscount() {
    if (!priceTypeRadioValue) return;

    const id = selectedItems.map((item) => item._id)[0];
    if (!id) {
      toast.error("سیم کارتی انتخاب نشده است");
      return;
    }

    const isNegotiableSelected = priceTypeRadioValue === "1";
    const numericPrice = cleanNumber(priceInputValue);

    if (!isNegotiableSelected && numericPrice <= 0) {
      toast.warning("لطفاً قیمت جدید سیم کارت را وارد کنید");
      return;
    }

    setLoading(true);

    const payload: ChangeSimPriceRequestProps = {
      refrence: normalizedRefrence,
      refrenceId: id,
      newPriceType: Number(priceTypeRadioValue),
      newPrice: isNegotiableSelected ? 0 : numericPrice,
      socialReply: false,
    };

    try {
      const response: ChangeSimPriceResponseProps = await changeSimPrice(
        auth.token,
        payload,
      );
      toast.success("قیمت سیم کارت با موفقیت تغییر کرد");
      flushItems();
      handleClose();
      router.refresh();
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        let errorMsg = error.printError();
        const errData = error.getErrorData();
        if (errData && typeof errData === "object") {
          const fieldErrors = Object.entries(errData)
            .map(
              ([field, val]) =>
                `${field}: ${Array.isArray(val) ? val.join("، ") : val}`,
            )
            .join(" | ");
          if (fieldErrors) {
            errorMsg = `${errorMsg} (${fieldErrors})`;
          }
        }
        toast.error(errorMsg);
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در تغییر قیمت سیم کارت");
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
                  تغییر قیمت
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
              <div className="flex w-full flex-col gap-2">
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    {hasSingleItem ? "قیمت سیم کارت" : "مجموع قیمت سیم کارت‌ها"}
                  </p>
                  <p className="text-sm font-medium text-grey md:text-base">
                    {currentPriceText}
                  </p>
                </div>
                {hasExistingDiscount && (
                  <div className="mt-2 flex w-full flex-col gap-2 rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-xs leading-5 text-amber-900">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-bold">
                        تخفیف فعال: {persianNumber(existingOffPercent || 0)}٪
                      </span>
                      {existingOffPrice && (
                        <span className="font-semibold text-amber-800">
                          قیمت فعلی با تخفیف: {persianNumber(existingOffPrice)} تومان
                        </span>
                      )}
                    </div>
                    <p className="text-amber-800/90">
                      این سیم کارت دارای تخفیف فعال است. در صورت نیاز می‌توانید ابتدا تخفیف را حذف کنید.
                    </p>
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        disabled={loading}
                        onClick={handleRemoveExistingDiscount}
                        className="flex items-center gap-1 rounded bg-amber-600 px-3 py-1 font-medium text-white hover:bg-amber-700 disabled:opacity-50"
                      >
                        <Image src="/icons/garbage-red.svg" alt="" width={14} height={14} className="brightness-0 invert" />
                        حذف تخفیف فعلی
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <HorizontalLine />
              <p className="shrink-0 text-sm font-normal leading-5 text-grey md:text-base">
                تعیین قیمت جدید:
              </p>
              <PriceTypeSelector
                value={priceTypeRadioValue}
                onChange={(value) => {
                  setPriceTypeRadioValue(value);
                  if (value === "0" && !priceInputValue && currentItem?.price && !isNegotiable) {
                    setPriceInputValue(Number(currentItem.price).toLocaleString("fa-ir"));
                  }
                }}
              />
              {priceTypeRadioValue === "0" && (
                <div className="flex w-full flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
                  <p className="text-nowrap text-sm font-medium leading-5 text-grey">
                    قیمت جدید را وارد کنید:
                  </p>
                  <TextField
                    id="price"
                    label="قیمت"
                    value={priceInputValue}
                    onChange={(e) => {
                      const rawDigits = englishNumber(e.target.value).replace(/\D/g, "");
                      if (!rawDigits) {
                        setPriceInputValue("");
                        return;
                      }
                      const num = Number(rawDigits);
                      setPriceInputValue(num.toLocaleString("fa-ir"));
                    }}
                    sx={{
                      width: "100%",
                      height: "56px",
                      backgroundColor: "white",
                      "& .MuiInputBase-root": {
                        height: "56px",
                      },
                    }}
                    variant="outlined"
                    inputProps={{ inputMode: "numeric" }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment
                          position="end"
                          sx={{
                            "& p": { fontSize: 12, fontWeight: 500 },
                          }}
                        >
                          تومان
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>
              )}
              <div className="hidden w-full md:flex">
                <button
                  type="button"
                  disabled={
                    loading ||
                    !priceTypeRadioValue ||
                    (priceTypeRadioValue === "0" && cleanNumber(priceInputValue) <= 0)
                  }
                  className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white disabled:opacity-50"
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
          disabled={
            loading ||
            !priceTypeRadioValue ||
            (priceTypeRadioValue === "0" && cleanNumber(priceInputValue) <= 0)
          }
          className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white disabled:opacity-50"
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

function PriceTypeSelector({
  value,
  onChange,
}: {
  value?: "0" | "1";
  onChange: (value: "0" | "1") => void;
}) {
  return (
    <div className="w-ful flex h-12 flex-row items-center justify-center gap-6 md:h-[60px]">
      <RadioGroup
        value={value || null}
        sx={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "nowrap",
          width: "100%",
          height: "100%",
          gap: "12px",
        }}
      >
        {priceTypeOptions.map((option) => (
          <Button
            key={option.id}
            variant="text"
            size="large"
            type="button"
            sx={{
              width: "100%",
              height: "100%",
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
              value={option.value}
              sx={{ mr: "-9px" }}
            />
          </Button>
        ))}
      </RadioGroup>
    </div>
  );
}

const priceTypeOptions: Array<{
  id: number;
  label: string;
  value: "0" | "1";
}> = [
  {
    id: 1,
    label: "توافقی",
    value: "1",
  },
  {
    id: 2,
    label: "تغییر قیمت",
    value: "0",
  },
];
