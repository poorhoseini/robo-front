"use client";

import addChannel from "@/lib/api/addChannel";
import { ResponseError } from "@/lib/api/error";
import getMyChannelsAuthString from "@/lib/api/getMyChannelsAuthString";
import {
  ChannelPlatform,
  GetMyAuthStringResponseProps,
  PostChannelRequestProps,
} from "@/lib/entities/channel";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { forwardRef, TouchEvent, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Space from "../general/Space";
import Spinner from "../general/Spinner";
import Script from "next/script";
import { TransitionProps } from "@mui/material/transitions";

export default function AddChannelDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { auth } = useContext(AuthContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authString, setAuthString] = useState("");
  const [platformRadioValue, setPlatformRadioValue] =
    useState<ChannelPlatform | null>(null);
  const [channelInputValue, setChannelInputValue] = useState("");

  useEffect(() => {
    if (!auth.token || !open) return;

    handleGetAuthString();
  }, [auth.token, open]);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleGetAuthString = async () => {
    if (!auth.token) return;

    setLoading(true);

    try {
      const response: GetMyAuthStringResponseProps =
        await getMyChannelsAuthString(auth.token);
      setAuthString(response.data.string);
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
        toast.error("خطا در دریافت کلمه رمز");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddChannel = async () => {
    if (!auth.token || !platformRadioValue) return;

    setLoading(true);

    const payload: PostChannelRequestProps = {
      channelId: channelInputValue,
      channelPlatform: platformRadioValue,
    };

    try {
      const response = await addChannel(auth.token, payload);
      handleClose();
      onSuccess();
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
        toast.error("خطا در افزودن کانال");
      }
    } finally {
      setLoading(false);
    }
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <Button variant="text" size="large" onClick={handleOpen}>
        <div className="flex flex-row items-center gap-2">
          <Image
            src="/icons/icon-plus-blue.svg"
            alt=""
            width={24}
            height={24}
          />
          <span className="text-sm font-medium leading-5 text-blue">
            کانال جدید
          </span>
        </div>
      </Button>

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
            ...(!fullScreen && { height: "665px" }),
            ...(fullScreen && { paddingBottom: "104px" }),
            borderRadius: "24px",
            backgroundColor: "white",
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
              اضافه کردن کانال جدید
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
        <DialogContent
          sx={{
            p: fullScreen ? "24px" : "32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex h-full w-full flex-col items-start justify-start gap-6 md:flex-row md:items-center md:justify-center">
            <div className="flex h-full w-full flex-col items-start rounded-xl md:w-1/2 md:bg-neutral md:px-6 md:py-4">
              <p className="text-base font-normal leading-7 text-grey">
                با استفاده از این سرویس می‌توانید آگهی‌های خود را به صورت خودکار
                در کانال تلگرام یا بله شخصی خود ارسال نمایید.
              </p>
              <Space value={16} />
              <p className="text-base font-medium leading-5 text-grey">
                در کدام‌یک از سرویس‌های زیر می‌خواهید کانال ایجاد کنید؟
              </p>
              <Space value={16} />
              <RadioGroup
                value={platformRadioValue}
                sx={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  flexWrap: "nowrap",
                  width: "100%",
                  gap: "12px",
                }}
              >
                <Button
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
                  onClick={() => setPlatformRadioValue("bale")}
                >
                  <span className="text-sm font-normal leading-5">بله</span>
                  <Radio
                    checked={platformRadioValue === "bale"}
                    value={"bale"}
                    sx={{ mr: "-9px" }}
                  />
                </Button>
                <Button
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
                  onClick={() => setPlatformRadioValue("telegram")}
                >
                  <span className="text-sm font-normal leading-5">تلگرام</span>
                  <Radio
                    checked={platformRadioValue === "telegram"}
                    value={"telegram"}
                    sx={{ mr: "-9px" }}
                  />
                </Button>
              </RadioGroup>
              <Space value={16} />
              <TextField
                label="نام کانال"
                value={channelInputValue}
                onChange={(e) => setChannelInputValue(e.target.value)}
                sx={{
                  width: "100%",
                  height: "56px",
                  backgroundColor: "white",
                  "& .MuiInputBase-root": {
                    height: "56px",
                  },
                }}
                variant="outlined"
              />
              <div className="flex-grow" />
              <div className="hidden w-full md:flex">
                <button
                  type="button"
                  disabled={
                    loading || !platformRadioValue || !channelInputValue
                  }
                  className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
                  onClick={handleAddChannel}
                >
                  {loading ? <Spinner /> : "تایید"}
                </button>
              </div>
            </div>
            <div className="flex h-full w-full flex-col items-start rounded-xl bg-neutral px-6 py-4 md:w-1/2">
              <h2 className="text-base font-medium leading-7 text-grey">
                مراحل دسترسی ربات روبورند به کانال شما:
              </h2>
              <Space value={4} />
              <div className="flxe-row flex w-full items-start rounded-md bg-biege p-2">
                <p className="text-sm font-normal leading-7 text-grey">
                  برای این کار ربات روبورند باید در کانال شما دسترسی ارسال پیام
                  داشته باشد.
                </p>
              </div>
              <Space value={16} />
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-biege text-xs font-normal leading-[14px] text-brown">
                  ۱
                </div>
                <p className="text-base font-normal leading-7 text-grey">
                  وارد تنطیمات کانال خود شوید
                </p>
              </div>
              <Space value={8} />
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-biege text-xs font-normal leading-[14px] text-brown">
                  ۲
                </div>
                <p className="text-base font-normal leading-7 text-grey">
                  گزینهAdminstrators یا (مدیران) انتخاب کنید.
                </p>
              </div>
              <Space value={8} />
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-biege text-xs font-normal leading-[14px] text-brown">
                  ۳
                </div>
                <p className="text-base font-normal leading-7 text-grey">
                  اسم Roborond را سرچ کنید
                </p>
              </div>
              <Space value={8} />
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-biege text-xs font-normal leading-[14px] text-brown">
                  ۴
                </div>
                <p className="text-base font-normal leading-7 text-grey">
                  {`در توضیحات کانال کلمه ${loading ? "***" : authString} را وارد کنید.`}
                </p>
              </div>
              <Space value={8} />
              <div className="flex w-full flex-row items-center justify-start gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-biege text-xs font-normal leading-[14px] text-brown">
                  ۵
                </div>
                <p className="text-base font-normal leading-7 text-grey">
                  در نهایت گزینه تایید را انتخاب کنید.
                </p>
              </div>
              <Space value={16} />
              <div
                id="37638297068"
                className="w-full overflow-hidden rounded-xl"
              >
                <Script
                  type="text/JavaScript"
                  src="https://www.aparat.com/embed/xmLEe?data[rnddiv]=37638297068&data[responsive]=yes"
                ></Script>
              </div>
            </div>
          </div>
        </DialogContent>
        <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
          <button
            type="button"
            disabled={loading || !platformRadioValue || !channelInputValue}
            className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white"
            onClick={handleAddChannel}
          >
            {loading ? <Spinner /> : "تایید"}
          </button>
        </div>
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
