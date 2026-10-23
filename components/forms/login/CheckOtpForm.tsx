"use client";

import CustomNumberTextField from "@/components/general/CustomNumberTextField";
import PrivacyModal from "@/components/login/PrivacyModal";
import TermsModal from "@/components/login/TermsModal";
import { CheckOtpFormProps } from "@/lib/entities/auth";
import {
  formatPhoneNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Controller, UseFormReturn } from "react-hook-form";

export default function CheckOtpForm({
  loading,
  form,
  onSubmit,
  onResendClick,
  phoneNumber,
  email,
  waitingTime,
  onBack,
  onCancel,
}: {
  loading: boolean;
  form: UseFormReturn<CheckOtpFormProps, any, CheckOtpFormProps>;
  onSubmit: (formData: CheckOtpFormProps) => void;
  onResendClick: () => Promise<void>;
  phoneNumber?: string;
  email?: string;
  waitingTime: number;
  onBack: () => void;
  onCancel: () => void;
}) {
  const [remainingTime, setRemainingTime] = useState<number>(waitingTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => (prev !== 0 ? prev - 1 : prev));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = form;

  const otpDigitRefs = useRef<Array<HTMLInputElement | null>>([]);

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const selectDigitInput = (index: number) => {
    otpDigitRefs.current[index]?.select();
  };

  const handleDigitKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
    value: string | undefined,
    onChange: (...event: any[]) => void,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      // 1️⃣ Clear current cell
      if (value) {
        onChange({ target: { value: "" } });
      }

      // 2️⃣ Move to previous cell (if exists)
      if (index > 0) {
        selectDigitInput(index - 1);
      } else {
        selectDigitInput(index);
      }
    }
  };

  const handleDigitChange =
    (index: number, onChange: (...event: any[]) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (Number.isNaN(Number(value))) return;

      const char = value.slice(-1); // 🔒 enforce 1 char

      onChange({ target: { value: char } });

      if (char && index < otpDigitRefs.current.length - 1) {
        selectDigitInput(index + 1);
      }

      if (index === 4) submitButtonRef.current?.click();
    };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    startIndex: number,
  ) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text").replace(/\D/g, ""); // digits only

    if (!pastedText) return;
    const refinedText =
      pastedText.length > 5 ? pastedText.slice(0, 5) : pastedText;

    refinedText.split("").forEach((char, offset) => {
      const index = startIndex + offset;
      if (index < 5) {
        setValue(`otpDigit${index + 1}` as keyof CheckOtpFormProps, char, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    // focus/select the first empty input after the paste
    const nextIndex = Math.min(startIndex + refinedText.length, 4);
    if (nextIndex === 4) {
      submitButtonRef.current?.click();
    } else {
      otpDigitRefs.current[nextIndex]?.select();
    }
  };

  const resetTimer = () => {
    setRemainingTime(waitingTime);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-start justify-start gap-10 bg-white text-grey"
    >
      {phoneNumber ? (
        <>
          <h3 className="text-2xl font-semibold">تایید شماره</h3>
          <div className="flex w-full flex-col items-start justify-start gap-4">
            <p className="text-lg font-medium">
              <span>کد تایید به شماره </span>
              <span className="font-semibold ltr inline-block">
                {" " + formatPhoneNumber(phoneNumber) + " "}
              </span>
              <span>فرستاده شد.</span>
            </p>
            <button
              type="button"
              className="flex flex-row items-center justify-start gap-3"
              onClick={onBack}
            >
              <Image
                src="/icons/icon-edit-blue.svg"
                alt="Edit"
                width={24}
                height={24}
              />
              <p className="text-base font-medium text-blue">اصلاح شماره</p>
            </button>
          </div>
        </>
      ) : email ? (
        <>
          <h3 className="text-2xl font-semibold">تایید ایمیل</h3>
          <div className="flex w-full flex-col items-start justify-start gap-4">
            <p className="text-lg font-medium">
              <span>کد تایید به ادرس </span>
              <span className="font-semibold">{" " + email + " "}</span>
              <span>فرستاده شد.</span>
            </p>
            <button
              type="button"
              className="flex flex-row items-center justify-start gap-3"
              onClick={onBack}
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
        </>
      ) : (
        <></>
      )}
      <div className="flex w-full flex-col items-start justify-start gap-4">
        <div className="flex w-full flex-row-reverse items-center justify-center gap-4">
          {Array.from({ length: 5 }, (_, i) => ({
            name: `otpDigit${i + 1}` as keyof CheckOtpFormProps,
            index: i,
          })).map(({ name, index }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <div className="h-12 w-12 md:h-16 md:w-16">
                  <CustomNumberTextField
                    id={`${name}-input`}
                    value={persianNumber(value)}
                    error={!!errors[name]}
                    inputRef={(el) => (otpDigitRefs.current[index] = el)}
                    onKeyDown={(e) =>
                      handleDigitKeyDown(e, index, value, onChange)
                    }
                    onChange={handleDigitChange(index, onChange)}
                    onPaste={(e) => handlePaste(e, index)}
                  />
                </div>
              )}
            />
          ))}
        </div>
        <div className="felx flex w-full flex-row items-center justify-center gap-2 text-lg font-medium">
          <p className="text-blue">{`${persianNumber(("00" + Math.floor(remainingTime / 60)).slice(-2))}:${persianNumber(("00" + Math.floor(remainingTime % 60)).slice(-2))}`}</p>
          {remainingTime === 0 ? (
            <button
              type="button"
              onClick={async () => {
                await onResendClick();
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
          استفاده از روبورند به معنی پذیرش <TermsModal /> این سرویس و{" "}
          <PrivacyModal /> است.
        </p>
      </div>
      <div className="flex w-full flex-row items-center justify-center gap-6">
        <button
          type="button"
          onClick={onCancel}
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
  );
}
