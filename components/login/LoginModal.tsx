"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import React, { TouchEvent, useContext, useState } from "react";
import SendOtpForm from "../forms/login/SendOtpForm";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import CheckOtpForm from "../forms/login/CheckOtpForm";
import {
  CheckOtpFormProps,
  CheckOtpRequestProps,
  CheckOtpResponseProps,
  SendOtpFormProps,
  SendOtpRequestProps,
  SendOtpResponseProps,
} from "@/lib/entities/auth";
import { useForm } from "react-hook-form";
import { englishNumber } from "@/lib/helpers/persianNumber.helper";
import sendOtp from "@/lib/api/sendOtp";
import checkOtp from "@/lib/api/checkOtp";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";

export default function LoginModal() {
  const { setAuthAndRedirect } = useContext(AuthContext);
  const { loginDialogOpen, setLoginDialogOpen } =
    useContext(LoginDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [loginStep, setLoginStep] = useState<number>(0);
  const [waitingTime, setWaitingTime] = useState<number>();
  const [loading, setLoading] = useState<boolean>(false);
  const [draggable, setDraggable] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"phoneNumber" | "email">(
    "phoneNumber",
  );

  const sendOtpForm = useForm<SendOtpFormProps>({
    defaultValues: {
      phoneNumber: "",
      email: "",
    },
  });
  const checkOtpForm = useForm<CheckOtpFormProps>({
    defaultValues: {
      otpDigit1: "",
      otpDigit2: "",
      otpDigit3: "",
      otpDigit4: "",
      otpDigit5: "",
    },
  });

  async function handleSendOtpSubmit(formData: SendOtpFormProps) {
    setLoading(true);

    const payload: SendOtpRequestProps = {
      interface: "web", //get this from device
      ...(loginMethod === "phoneNumber" &&
        formData.phoneNumber && {
          phoneNumber: englishNumber(formData.phoneNumber),
        }),
      ...(loginMethod === "email" &&
        formData.email && {
          email: formData.email,
        }),
    };

    try {
      const response: SendOtpResponseProps = await sendOtp(payload);
      setWaitingTime(response.data.waiting);
      setLoginStep(1);
      checkOtpForm.reset();
    } catch (error) {
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        console.log(error.printError());
      } else {
        toast.error("خطایی رخ داده است");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckOtpSubmit(formData: CheckOtpFormProps) {
    setLoading(true);

    const fullOtp =
      formData.otpDigit1 +
      formData.otpDigit2 +
      formData.otpDigit3 +
      formData.otpDigit4 +
      formData.otpDigit5;

    const payload: CheckOtpRequestProps = {
      ...(loginMethod === "phoneNumber" &&
        sendOtpForm.getValues("phoneNumber") && {
          phoneNumber: englishNumber(
            sendOtpForm.getValues("phoneNumber") || "",
          ),
        }),
      ...(loginMethod === "email" &&
        sendOtpForm.getValues("email") && {
          email: sendOtpForm.getValues("email"),
        }),
      code: Number(englishNumber(fullOtp)),
    };

    try {
      const response: CheckOtpResponseProps = await checkOtp(payload);
      setAuthAndRedirect(response.data, "/dashboard");
      handleClose();
    } catch (error) {
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        console.log(error.printError());
      } else {
        toast.error("خطایی رخ داده است");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  const handleOpen = () => {
    setLoginDialogOpen(true);
  };

  const handleClose = () => {
    sendOtpForm.reset();
    checkOtpForm.reset();
    setLoginStep(0);
    setLoginDialogOpen(false);
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      {fullScreen ? (
        <IconButton onClick={handleOpen}>
          <Image
            src="/icons/icon-avatar-black.svg"
            alt=""
            width={24}
            height={24}
          />
        </IconButton>
      ) : (
        <button
          onClick={handleOpen}
          className="min-h-[48px] min-w-[168px] rounded-[100px] bg-secondary px-6 py-3 text-base font-medium text-grey"
        >
          <div className="flex flex-row items-center justify-between">
            <Image
              src="/icons/icon-login.svg"
              alt="Login"
              width={24}
              height={24}
            />
            <p>ورود | ثبت نام</p>
          </div>
        </button>
      )}
      <Dialog
        open={loginDialogOpen}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{ sx: { width: "545px", borderRadius: "12px" } }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between p-8 pb-0"
        >
          {loginStep === 1 ? (
            <IconButton onClick={() => setLoginStep((prev) => prev - 1)}>
              <Image
                src="/icons/icon-arrow-right.svg"
                alt="Back"
                width={24}
                height={24}
              />
            </IconButton>
          ) : (
            <IconButton onClick={handleClose}>
              <Image
                src="/icons/icon-close.svg"
                alt="Close"
                width={24}
                height={24}
              />
            </IconButton>
          )}
          {!!(loginStep === 0) && (
            <DialogTitle sx={{ p: 0 }} component="h1">
              <span className="text-2xl font-extrabold text-black">
                روبورند
              </span>
            </DialogTitle>
          )}
        </div>
        <DialogContent sx={{ p: "32px", pt: "48px" }}>
          {loginStep === 0 ? (
            <SendOtpForm
              loginMethod={loginMethod}
              onLoginMethodChange={(value) => {
                sendOtpForm.reset();
                setLoginMethod(value);
              }}
              loading={loading}
              form={sendOtpForm}
              onSubmit={handleSendOtpSubmit}
            />
          ) : loginStep === 1 ? (
            <CheckOtpForm
              loading={loading}
              form={checkOtpForm}
              onSubmit={handleCheckOtpSubmit}
              onResendClick={async () =>
                handleSendOtpSubmit({
                  phoneNumber: sendOtpForm.getValues("phoneNumber"),
                })
              }
              phoneNumber={sendOtpForm.getValues("phoneNumber")}
              email={sendOtpForm.getValues("email")}
              waitingTime={waitingTime || 0}
              onBack={() => setLoginStep((prev) => prev - 1)}
              onCancel={handleClose}
            />
          ) : (
            <p>مشکلی پیش آمده. بعدا تلاش کنید</p>
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
