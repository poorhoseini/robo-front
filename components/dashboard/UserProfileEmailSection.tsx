"use client";

import React, {
  TouchEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dialog,
  DialogContent,
  IconButton,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { Controller, useForm } from "react-hook-form";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  SendUserEmailOTPFormProps,
  SendUserEmailOTPRequestProps,
  VerifyUserEmailFormProps,
  VerifyUserEmailRequestProps,
} from "@/lib/entities/userProfile";
import sendUserEmailOtp from "@/lib/api/sendUserEmailOtp";
import Space from "../general/Space";
import CustomButton from "../general/CustomButton";
import checkUserEmailOtp from "@/lib/api/checkUserEmailOtp";

const waitingTime = 30;

export default function UserProfileEmailSection({
  currentUserEmail,
}: {
  currentUserEmail: string;
}) {
  const { resetAuth, auth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingSendEmailOtp, setLoadingSendEmailOtp] =
    useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(waitingTime);

  const otpDigit1Ref = useRef<HTMLInputElement>(null);
  const otpDigit2Ref = useRef<HTMLInputElement>(null);
  const otpDigit3Ref = useRef<HTMLInputElement>(null);
  const otpDigit4Ref = useRef<HTMLInputElement>(null);
  const otpDigit5Ref = useRef<HTMLInputElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const sendOTPForm = useForm<SendUserEmailOTPFormProps>({
    defaultValues: {
      email: currentUserEmail,
    },
  });

  const verifyOTPForm = useForm<VerifyUserEmailFormProps>({
    defaultValues: {
      otpDigit1: "",
      otpDigit2: "",
      otpDigit3: "",
      otpDigit4: "",
      otpDigit5: "",
    },
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    verifyOTPForm.reset();
    setOpen(false);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev !== 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  async function handleSendOtp(vals: SendUserEmailOTPFormProps) {
    setLoadingSendEmailOtp(true);

    const payload: SendUserEmailOTPRequestProps = {
      email: vals.email,
    };

    try {
      const response = await sendUserEmailOtp(payload, auth.token);
      handleOpen();
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
        toast.error("خطا در تغییر ایمیل کاربر");
      }
    } finally {
      setLoadingSendEmailOtp(false);
    }
  }

  async function handleVerifyEmail(vals: VerifyUserEmailFormProps) {
    setLoading(true);

    const fullOtp =
      vals.otpDigit1 +
      vals.otpDigit2 +
      vals.otpDigit3 +
      vals.otpDigit4 +
      vals.otpDigit5;

    const payload: VerifyUserEmailRequestProps = {
      email: sendOTPForm.getValues("email"),
      otp: fullOtp,
    };

    try {
      const response = await checkUserEmailOtp(payload, auth.token);
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
        toast.error("خطا در تغییر ایمیل کاربر");
      }
    } finally {
      setLoading(false);
    }
  }

  const resetTimer = () => {
    setRemainingTime(waitingTime);
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <div className="flex w-full flex-col items-start rounded-xl border border-grey-300 bg-white p-6">
        <h2 className="text-base font-medium leading-5 text-grey">ایمیل</h2>
        <Space value={16} />
        <form
          onSubmit={sendOTPForm.handleSubmit(handleSendOtp)}
          className="flex w-full flex-row items-center justify-between gap-20"
        >
          <div className="w-full">
            <Controller
              name="email"
              control={sendOTPForm.control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="medium"
                  placeholder="robo@gmail.com"
                  value={value}
                  onChange={onChange}
                  sx={{ width: "100%" }}
                  variant="outlined"
                  error={!!sendOTPForm.formState.errors?.email}
                />
              )}
            />
          </div>
          <div className="w-full max-w-[230px]">
            <CustomButton
              type="submit"
              label="ثبت ایمیل"
              loading={loadingSendEmailOtp}
            />
          </div>
        </form>
      </div>
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
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent sx={{ p: "32px", pt: "48px" }}>
          <form
            onSubmit={verifyOTPForm.handleSubmit(handleVerifyEmail)}
            className="flex w-full flex-col items-start justify-start gap-10 text-grey"
          >
            <h3 className="text-2xl font-semibold">تایید ایمیل</h3>
            <div className="flex w-full flex-col items-start justify-start gap-4">
              <p className="text-lg font-medium">
                <span>کد تایید به ادرس </span>
                <span className="font-semibold">
                  {" " + sendOTPForm.getValues("email") + " "}
                </span>
                <span>فرستاده شد.</span>
              </p>
              <button
                type="button"
                className="flex flex-row items-center justify-start gap-3"
                onClick={handleClose}
              >
                <Image
                  src="/icons/icon-edit-blue.svg"
                  alt="Edit"
                  width={24}
                  height={24}
                />
                <p className="text-base font-medium text-blue">اصلاح ایمیل</p>
              </button>
            </div>
            <div className="flex w-full flex-col items-start justify-start gap-4">
              <div className="flex w-full flex-row-reverse items-center justify-center gap-4">
                <Controller
                  control={verifyOTPForm.control}
                  name="otpDigit1"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="otp-digit1-input"
                      value={persianNumber(value)}
                      onFocus={(e) => {
                        setTimeout(() => otpDigit1Ref.current?.select(), 0);
                      }}
                      onClick={(e) => {
                        setTimeout(() => otpDigit1Ref.current?.select(), 0);
                      }}
                      onKeyDown={(e) => {
                        const keyCode = e.key;
                        if (keyCode === "Backspace") {
                          setTimeout(() => otpDigit1Ref.current?.select(), 0);
                        } else {
                          setTimeout(() => otpDigit1Ref.current?.select(), 0);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!Number.isNaN(Number(value))) {
                          value &&
                            setTimeout(() => otpDigit2Ref.current?.select(), 0);
                          onChange(e);
                        }
                      }}
                      error={!!verifyOTPForm.formState.errors.otpDigit1}
                      inputRef={otpDigit1Ref}
                      sx={{
                        width: "64px",
                        height: "64px",
                        "& .MuiInputBase-root": {
                          height: "64px",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                        },
                      }}
                      inputProps={{ inputMode: "numeric" }}
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  control={verifyOTPForm.control}
                  name="otpDigit2"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="otp-digit2-input"
                      value={persianNumber(value)}
                      onFocus={(e) => {
                        setTimeout(() => otpDigit2Ref.current?.select(), 0);
                      }}
                      onClick={(e) => {
                        setTimeout(() => otpDigit2Ref.current?.select(), 0);
                      }}
                      onKeyDown={(e) => {
                        const keyCode = e.key;
                        if (keyCode === "Backspace") {
                          setTimeout(() => otpDigit1Ref.current?.select(), 0);
                        } else {
                          setTimeout(() => otpDigit2Ref.current?.select(), 0);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!Number.isNaN(Number(value))) {
                          value &&
                            setTimeout(() => otpDigit3Ref.current?.select(), 0);
                          onChange(e);
                        }
                      }}
                      error={!!verifyOTPForm.formState.errors.otpDigit2}
                      inputRef={otpDigit2Ref}
                      sx={{
                        width: "64px",
                        height: "64px",
                        "& .MuiInputBase-root": {
                          height: "64px",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                        },
                      }}
                      inputProps={{ inputMode: "numeric" }}
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  control={verifyOTPForm.control}
                  name="otpDigit3"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="otp-digit3-input"
                      value={persianNumber(value)}
                      onFocus={(e) => {
                        setTimeout(() => otpDigit3Ref.current?.select(), 0);
                      }}
                      onClick={(e) => {
                        setTimeout(() => otpDigit3Ref.current?.select(), 0);
                      }}
                      onKeyDown={(e) => {
                        const keyCode = e.key;
                        if (keyCode === "Backspace") {
                          setTimeout(() => otpDigit2Ref.current?.select(), 0);
                        } else {
                          setTimeout(() => otpDigit3Ref.current?.select(), 0);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!Number.isNaN(Number(value))) {
                          value &&
                            setTimeout(() => otpDigit4Ref.current?.select(), 0);
                          onChange(e);
                        }
                      }}
                      error={!!verifyOTPForm.formState.errors.otpDigit3}
                      inputRef={otpDigit3Ref}
                      sx={{
                        width: "64px",
                        height: "64px",
                        "& .MuiInputBase-root": {
                          height: "64px",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                        },
                      }}
                      inputProps={{ inputMode: "numeric" }}
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  control={verifyOTPForm.control}
                  name="otpDigit4"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="otp-digit4-input"
                      value={persianNumber(value)}
                      onFocus={(e) => {
                        setTimeout(() => otpDigit4Ref.current?.select(), 0);
                      }}
                      onClick={(e) => {
                        setTimeout(() => otpDigit4Ref.current?.select(), 0);
                      }}
                      onKeyDown={(e) => {
                        const keyCode = e.key;
                        if (keyCode === "Backspace") {
                          setTimeout(() => otpDigit3Ref.current?.select(), 0);
                        } else {
                          setTimeout(() => otpDigit4Ref.current?.select(), 0);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!Number.isNaN(Number(value))) {
                          value &&
                            setTimeout(() => otpDigit5Ref.current?.select(), 0);
                          onChange(e);
                        }
                      }}
                      error={!!verifyOTPForm.formState.errors.otpDigit4}
                      inputRef={otpDigit4Ref}
                      sx={{
                        width: "64px",
                        height: "64px",
                        "& .MuiInputBase-root": {
                          height: "64px",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                        },
                      }}
                      inputProps={{ inputMode: "numeric" }}
                      variant="outlined"
                    />
                  )}
                />
                <Controller
                  control={verifyOTPForm.control}
                  name="otpDigit5"
                  rules={{ required: true }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="digit5-input"
                      value={persianNumber(value)}
                      onFocus={(e) => {
                        setTimeout(() => otpDigit5Ref.current?.select(), 0);
                      }}
                      onClick={(e) => {
                        setTimeout(() => otpDigit5Ref.current?.select(), 0);
                      }}
                      onKeyDown={(e) => {
                        const keyCode = e.key;
                        if (keyCode === "Backspace") {
                          setTimeout(() => otpDigit4Ref.current?.select(), 0);
                        } else {
                          setTimeout(() => submitButtonRef.current?.click(), 0);
                        }
                      }}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (!Number.isNaN(Number(value))) {
                          //   value && setTimeout(() => digit6Ref.current?.select(), 0);
                          onChange(e);
                        }
                      }}
                      error={!!verifyOTPForm.formState.errors.otpDigit5}
                      inputRef={otpDigit5Ref}
                      sx={{
                        width: "64px",
                        height: "64px",
                        "& .MuiInputBase-root": {
                          height: "64px",
                        },
                        "& .MuiInputBase-input": {
                          textAlign: "center",
                        },
                      }}
                      inputProps={{ inputMode: "numeric" }}
                      variant="outlined"
                    />
                  )}
                />
              </div>
              <div className="felx flex w-full flex-row items-center justify-center gap-2 text-lg font-medium">
                <p className="text-blue">{`${persianNumber(("00" + Math.floor(remainingTime / 60)).slice(-2))}:${persianNumber(("00" + Math.floor(remainingTime % 60)).slice(-2))}`}</p>
                {remainingTime === 0 ? (
                  <button
                    type="button"
                    onClick={async () => {
                      await handleSendOtp({
                        email: sendOTPForm.getValues("email"),
                      });
                      resetTimer();
                    }}
                  >
                    ارسال مجدد
                  </button>
                ) : (
                  <p>شکیبا باشید</p>
                )}
              </div>
              <p className="text-base font-medium">
                استفاده از روبورند به معنی پذیرش{" "}
                <button type="button" className="text-blue">
                  شرایط و قوانین
                </button>{" "}
                این سرویس و{" "}
                <button type="button" className="text-blue">
                  قوانین حفظ حریم شخصی کاربران
                </button>{" "}
                است.
              </p>
            </div>
            <div className="flex w-full flex-row items-center justify-center gap-6">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex h-[56px] w-1/2 items-center justify-center rounded-md border border-grey bg-white text-base font-medium text-grey"
              >
                انصراف
              </button>
              <button
                type="submit"
                ref={submitButtonRef}
                disabled={loading || remainingTime === 0}
                className="flex h-[56px] w-1/2 items-center justify-center rounded-md bg-grey text-base font-medium text-white"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-4 border-slate-300 border-t-grey-800"></div>
                ) : (
                  <p>ادامه</p>
                )}
              </button>
            </div>
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
