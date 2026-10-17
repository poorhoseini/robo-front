"use client";

import Space from "@/components/general/Space";
import { SendOtpFormProps } from "@/lib/entities/auth";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { emailInputRegex, numberInputRegex } from "@/lib/helpers/regex";
import { Button, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

export default function SendOtpForm({
  loginMethod,
  onLoginMethodChange,
  loading,
  form,
  onSubmit,
}: {
  loginMethod: "phoneNumber" | "email";
  onLoginMethodChange: (value: "phoneNumber" | "email") => void;
  loading: boolean;
  form: UseFormReturn<SendOtpFormProps, any, SendOtpFormProps>;
  onSubmit: (formData: SendOtpFormProps) => void;
}) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = form;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-start justify-start bg-white text-grey"
    >
      <h3 className="text-2xl font-semibold">
        <span>ورود</span> <span className="font-normal">یا</span>{" "}
        <span>عضویت</span>
      </h3>
      <Space value={40} />
      <div className="w-full">
        <RadioGroup
          value={loginMethod}
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
            onClick={() => onLoginMethodChange("phoneNumber")}
          >
            <span className="text-sm font-normal leading-5">شماره موبایل</span>
            <Radio
              checked={loginMethod === "phoneNumber"}
              value={"phoneNumber"}
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
            onClick={() => onLoginMethodChange("email")}
          >
            <span className="text-sm font-normal leading-5">ایمیل</span>
            <Radio
              checked={loginMethod === "email"}
              value={"email"}
              sx={{ mr: "-9px" }}
            />
          </Button>
        </RadioGroup>
      </div>
      <Space value={20} />
      {loginMethod === "phoneNumber" ? (
        <div className="w-full">
          <Controller
            control={control}
            name="phoneNumber"
            rules={{
              required: "شماره تلفن همراه اجباری می باشد",
              minLength: {
                value: 11,
                message: "شماره تلفن همراه باید ۱۱ رقم باشد",
              },
              maxLength: {
                value: 11,
                message: "شماره تلفن همراه باید ۱۱ رقم باشد",
              },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                id="phoneNumber"
                label="شماره تلفن همراه"
                value={value}
                onChange={(e) => {
                  const lastCharacter = e.target.value.slice(-1);
                  if (!numberInputRegex.test(lastCharacter)) return;

                  onChange(persianNumber(e.target.value));
                }}
                error={!!errors.phoneNumber}
                sx={{
                  width: "100%",
                  height: "56px",
                  "& .MuiInputBase-root": {
                    height: "56px",
                  },
                }}
                inputProps={{ inputMode: "numeric" }}
                variant="outlined"
              />
            )}
          />
          <span
            className={`text-xs font-normal ${!!errors.phoneNumber ? "text-red" : "text-grey"}`}
          >
            {errors?.phoneNumber?.message || "شماره با ۰۹ شروع می شود"}
          </span>
        </div>
      ) : (
        <div className="w-full">
          <Controller
            control={control}
            name="email"
            rules={{
              required: "آدرس ایمیل اجباری می باشد",
              pattern: {
                value: emailInputRegex,
                message: "فرمت ایمیل صحیح نمی باشد",
              },
            }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                id="email"
                label="ایمیل"
                value={value}
                onChange={onChange}
                error={!!errors.email}
                sx={{
                  width: "100%",
                  height: "56px",
                  "& .MuiInputBase-root": {
                    height: "56px",
                  },
                }}
                inputProps={{ inputMode: "email" }}
                variant="outlined"
              />
            )}
          />
          <span
            className={`text-xs font-normal ${!!errors.email ? "text-red" : "text-grey"}`}
          >
            {errors?.email?.message}
          </span>
        </div>
      )}
      <Space value={40} />
      <button
        type="submit"
        disabled={loading}
        className="flex h-[56px] w-full items-center justify-center rounded-lg bg-grey text-base font-medium text-white"
      >
        {loading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-4 border-slate-300 border-t-grey-800"></div>
        ) : (
          <p>ادامه</p>
        )}
      </button>
    </form>
  );
}
