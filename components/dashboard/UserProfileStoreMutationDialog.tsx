"use client";

import React, { Fragment, TouchEvent, useContext, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { Control, Controller, useForm } from "react-hook-form";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Space from "../general/Space";
import {
  PostUserProfileStoreRequestProps,
  UserProfileStoreFormProps,
} from "@/lib/entities/store";
import createUserProfileStore from "@/lib/api/createUserProfileStore";

export default function UserProfileStoreMutationDialog({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const { resetAuth, auth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UserProfileStoreFormProps>({
    defaultValues: {
      storeName: "",
      numbers: [""],
      addresses: "",
      storeType: "",
      services: [],
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    reset();
    setOpen(false);
  };

  async function handleCreateStore(vals: UserProfileStoreFormProps) {
    setLoading(true);

    const payload: PostUserProfileStoreRequestProps = {
      storeName: vals.storeName,
      storeType: vals.storeType,
      addresses: [vals.addresses],
      numbers: vals.numbers,
      services: vals.services,
    };

    try {
      const response = await createUserProfileStore(payload, auth.token);
      onFinish();
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
        toast.error("خطا در ساخت فروشگاه کاربر");
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
      <button
        onClick={handleOpen}
        className="flex h-12 w-[230px] flex-row items-center justify-center gap-2 rounded-md bg-grey"
      >
        <Image src="/icons/icon-plus-white.svg" alt="" width={24} height={24} />
        <span className="text-base font-medium leading-6 text-white">
          ثبت فروشگاه
        </span>
      </button>
      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "702px",
            maxWidth: "702px",
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
          className="flex flex-row items-center justify-between p-8 pb-0"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-base font-medium text-grey">
              ثبت مشخصات فروشگاه
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
        <DialogContent sx={{ p: "32px", pt: "48px" }}>
          <form
            onSubmit={handleSubmit(handleCreateStore)}
            className="flex h-full w-full flex-col items-start justify-start"
          >
            <label className="text-sm font-medium leading-5 text-grey">
              نام فروشگاه
            </label>
            <Space value={8} />
            <div className="w-full">
              <Controller
                name="storeName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    size="medium"
                    value={value}
                    onChange={onChange}
                    sx={{ width: "100%" }}
                    variant="outlined"
                    error={!!errors?.storeName}
                  />
                )}
              />
            </div>
            <Space value={16} />
            <Controller
              name="numbers"
              control={control}
              rules={{
                validate: {
                  required: (value) => {
                    if (value.includes("")) return "شماره تماس اجباری می باشد";
                  },
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <>
                  <div className="flex w-full items-center justify-between gap-2">
                    <label className="text-sm font-medium leading-5 text-grey">
                      شماره تماس فروشگاه
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        onChange([...value, ""]);
                      }}
                      className="flex flex-row items-center gap-1"
                    >
                      <Image
                        src="/icons/icon-plus-blue.svg"
                        alt="Enter"
                        width={18}
                        height={18}
                      />
                      <span className="text-xs font-medium leading-5 text-blue">
                        اضافه کردن شماره تماس
                      </span>
                    </button>
                  </div>
                  {value.map((storeNumberItem, formItemIndex) => (
                    <Fragment key={formItemIndex}>
                      <Space value={8} />
                      <div className="flex w-full flex-row items-center gap-1">
                        <TextField
                          size="medium"
                          value={storeNumberItem}
                          onChange={(e) =>
                            onChange(
                              value.map((item, index) =>
                                index === formItemIndex ? e.target.value : item,
                              ),
                            )
                          }
                          sx={{ width: "100%" }}
                          variant="outlined"
                          error={!!errors?.numbers}
                        />
                        {value.length > 1 && (
                          <IconButton
                            onClick={() =>
                              onChange(
                                value.filter(
                                  (item, index) => index !== formItemIndex,
                                ),
                              )
                            }
                          >
                            <Image
                              src="/icons/icon-close.svg"
                              alt="Close"
                              width={24}
                              height={24}
                            />
                          </IconButton>
                        )}
                      </div>
                    </Fragment>
                  ))}
                </>
              )}
            />
            <Space value={16} />
            <label className="text-sm font-medium leading-5 text-grey">
              آدرس فروشگاه
            </label>
            <Space value={8} />
            <div className="w-full">
              <Controller
                name="addresses"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    size="medium"
                    value={value}
                    onChange={onChange}
                    sx={{ width: "100%" }}
                    variant="outlined"
                    error={!!errors?.addresses}
                  />
                )}
              />
            </div>
            <Space value={16} />
            <label className="text-sm font-medium leading-5 text-grey">
              نوع فروشگاه
            </label>
            <Space value={8} />
            <StoreTypeSelector control={control} error={!!errors?.storeType} />
            <Space value={16} />
            <label className="text-sm font-medium leading-5 text-grey">
              نوع خدمات
            </label>
            <Space value={8} />
            <StoreServiceTypeSelector
              control={control}
              error={!!errors?.services}
            />
            <div className="grow" />
            <Space value={16} />
            <button
              type="submit"
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center rounded-md bg-grey text-base font-medium text-white"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-4 border-slate-300 border-t-grey-800"></div>
              ) : (
                <p>تایید</p>
              )}
            </button>
          </form>
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

function StoreTypeSelector({
  control,
  error,
}: {
  control: Control<UserProfileStoreFormProps, any>;
  error: boolean;
}) {
  return (
    <Controller
      control={control}
      name="storeType"
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex min-h-14 w-full flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onChange("pishkhan");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "pishkhan" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            پیشخوان
          </button>
          <button
            type="button"
            onClick={() => {
              onChange("agency");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "agency" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            دفتر فروش سیم کارت
          </button>
          <button
            type="button"
            onClick={() => {
              onChange("store");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "store" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            فروشگاه موبایل
          </button>
        </div>
      )}
    />
  );
}

function StoreServiceTypeSelector({
  control,
  error,
}: {
  control: Control<UserProfileStoreFormProps, any>;
  error: boolean;
}) {
  return (
    <Controller
      control={control}
      name="services"
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex min-h-14 w-full flex-row items-center justify-between gap-4">
          <div
            className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border px-3 text-sm font-normal leading-5 ${error ? "border-error bg-white text-error" : value.includes("خرید سیمکارت") ? "bg-grey-500 text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            <span className="w-full">خرید سیم کارت</span>
            <Checkbox
              checked={value.includes("خرید سیمکارت")}
              value="خرید سیمکارت"
              onChange={(e) =>
                onChange(
                  value.includes("خرید سیمکارت")
                    ? value.filter((item) => item !== "خرید سیمکارت")
                    : [...value, "خرید سیمکارت"],
                )
              }
              icon={
                <Image
                  src="/form/checkbox.svg"
                  alt="checkbox"
                  width={20}
                  height={20}
                />
              }
              checkedIcon={
                <Image
                  src="/form/checkbox-checked.svg"
                  alt="checked checkbox"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
          <div
            className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border px-3 text-sm font-normal leading-5 ${error ? "border-error bg-white text-error" : value.includes("فروش سیمکارت") ? "bg-grey-500 text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            <span className="w-full">فروش سیم کارت</span>
            <Checkbox
              checked={value.includes("فروش سیمکارت")}
              value="فروش سیمکارت"
              onChange={(e) =>
                onChange(
                  value.includes("فروش سیمکارت")
                    ? value.filter((item) => item !== "فروش سیمکارت")
                    : [...value, "فروش سیمکارت"],
                )
              }
              icon={
                <Image
                  src="/form/checkbox.svg"
                  alt="checkbox"
                  width={20}
                  height={20}
                />
              }
              checkedIcon={
                <Image
                  src="/form/checkbox-checked.svg"
                  alt="checked checkbox"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
          <div
            className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border px-3 text-sm font-normal leading-5 ${error ? "border-error bg-white text-error" : value.includes("قیمت گذاری") ? "bg-grey-500 text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            <span className="w-full">قیمت گذاری</span>
            <Checkbox
              checked={value.includes("قیمت گذاری")}
              value="قیمت گذاری"
              onChange={(e) =>
                onChange(
                  value.includes("قیمت گذاری")
                    ? value.filter((item) => item !== "قیمت گذاری")
                    : [...value, "قیمت گذاری"],
                )
              }
              icon={
                <Image
                  src="/form/checkbox.svg"
                  alt="checkbox"
                  width={20}
                  height={20}
                />
              }
              checkedIcon={
                <Image
                  src="/form/checkbox-checked.svg"
                  alt="checked checkbox"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
          <div
            className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border px-3 text-sm font-normal leading-5 ${error ? "border-error bg-white text-error" : value.includes("نقل و انتقال") ? "bg-grey-500 text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            <span className="w-full">نقل و انتقال</span>
            <Checkbox
              checked={value.includes("نقل و انتقال")}
              value="نقل و انتقال"
              onChange={(e) =>
                onChange(
                  value.includes("نقل و انتقال")
                    ? value.filter((item) => item !== "نقل و انتقال")
                    : [...value, "نقل و انتقال"],
                )
              }
              icon={
                <Image
                  src="/form/checkbox.svg"
                  alt="checkbox"
                  width={20}
                  height={20}
                />
              }
              checkedIcon={
                <Image
                  src="/form/checkbox-checked.svg"
                  alt="checked checkbox"
                  width={20}
                  height={20}
                />
              }
            />
          </div>
        </div>
      )}
    />
  );
}
