"use client";

import { ResponseError } from "@/lib/api/error";
import offerSimKhast from "@/lib/api/offerSimKhast";
import {
  OfferSimKhastFormProps,
  OfferSimKhastRequestProps,
  OfferSimKhastResponseProps,
} from "@/lib/entities/simKhast";
import {
  englishNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CartModal from "../cart/CartModal";

type FilterNumberFormProps = {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  price: string;
  type: string;
  status: string;
};

type BidOnSimKhastSectionProps = {
  simCardId: string;
};

export default function BidOnSimKhastForm({
  simCardId,
}: BidOnSimKhastSectionProps) {
  const { auth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorReasons, setErrorReasons] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);
  const [showError, setShowError] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FilterNumberFormProps>({
    defaultValues: {
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
      digit7: "",
      digit8: "",
      digit9: "",
      price: "",
      type: "",
      status: "",
    },
  });

  const digit1Ref = useRef<HTMLInputElement>(null);
  const digit2Ref = useRef<HTMLInputElement>(null);
  const digit3Ref = useRef<HTMLInputElement>(null);
  const digit4Ref = useRef<HTMLInputElement>(null);
  const digit5Ref = useRef<HTMLInputElement>(null);
  const digit6Ref = useRef<HTMLInputElement>(null);
  const digit7Ref = useRef<HTMLInputElement>(null);
  const digit8Ref = useRef<HTMLInputElement>(null);
  const digit9Ref = useRef<HTMLInputElement>(null);

  async function handleOfferSimKhastClick(formData: OfferSimKhastFormProps) {
    setLoading(true);
    setShowError(false);
    setErrorReasons([]);

    const payload: OfferSimKhastRequestProps = {
      specialSimId: simCardId,
      phoneNumber:
        "09" +
        formData.digit1 +
        formData.digit2 +
        formData.digit3 +
        formData.digit4 +
        formData.digit5 +
        formData.digit6 +
        formData.digit7 +
        formData.digit8 +
        formData.digit9,
      type: Number(formData.type),
      state: Number(formData.status),
      price: Number(englishNumber(formData.price.replaceAll("٬", ""))),
      provinceId: 8,
      cityId: 301,
    };

    try {
      const response: OfferSimKhastResponseProps = await offerSimKhast(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
    } catch (error) {
      if (error instanceof ResponseError) {
        toast.error(error.printError());

        const errorData = error.getErrorData();
        const errorReason = error.getErrorReason();
        if (errorData) {
          setShowError(true);
          setErrorReasons(error.getErrorData().confilicts);
        }
        if (errorReason === 163) {
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطایی رخ داده است");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleOfferSimKhastClick)}
        className="flex w-full flex-col items-center justify-start gap-4 bg-white pb-[104px] md:gap-6 md:pb-0"
      >
        <p className="w-full text-right text-sm font-medium text-grey">
          شماره پیشنهادی خود را وارد کنید
        </p>
        <div className="flex w-full flex-row-reverse items-center justify-between md:gap-5">
          <div className="h-[30px] w-[30px] md:h-12 md:w-12">
            <TextField
              disabled
              value={persianNumber(0)}
              sx={{
                width: "100%",
                height: "100%",
                "& .MuiInputBase-root": {
                  height: "100%",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: 0,
                },
              }}
              variant="outlined"
            />
          </div>
          <div className="h-[30px] w-[30px] md:h-12 md:w-12">
            <TextField
              disabled
              value={persianNumber(9)}
              sx={{
                width: "100%",
                height: "100%",
                "& .MuiInputBase-root": {
                  height: "100%",
                },
                "& .MuiInputBase-input": {
                  textAlign: "center",
                  padding: 0,
                },
              }}
              variant="outlined"
            />
          </div>

          <Controller
            control={control}
            name="digit1"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit1-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit1Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit1Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit1Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit1Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit2Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit1}
                  inputRef={digit1Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit2"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit2-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit2Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit2Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit1Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit2Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit3Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit2}
                  inputRef={digit2Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit3"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit3-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit3Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit3Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit2Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit3Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit4Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit3}
                  inputRef={digit3Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit4"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit4-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit4Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit4Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit3Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit4Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit5Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit4}
                  inputRef={digit4Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit5"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit5-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit5Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit5Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit4Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit5Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit6Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit5}
                  inputRef={digit5Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit6"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                {" "}
                <TextField
                  id="digit6-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit6Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit6Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit5Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit6Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit7Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit6}
                  inputRef={digit6Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit7"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit7-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit7Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit7Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit6Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit7Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit8Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit7}
                  inputRef={digit7Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit8"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit8-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit8Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit8Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit7Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit8Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit9Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit8}
                  inputRef={digit8Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="digit9"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                <TextField
                  id="digit9-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit9Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit9Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit8Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit9Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      //   value && setTimeout(() => digit7Ref.current?.select(), 0);
                      onChange(e);
                    }
                  }}
                  error={!!errors.digit9}
                  inputRef={digit9Ref}
                  sx={{
                    width: "100%",
                    height: "100%",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                    "& .MuiInputBase-input": {
                      textAlign: "center",
                      padding: 0,
                    },
                  }}
                  inputProps={{ inputMode: "numeric" }}
                  variant="outlined"
                />
              </div>
            )}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">
          <p className="w-full text-right text-sm font-medium text-grey md:w-1/2">
            قیمت پیشنهادی خود را وارد کنید:
          </p>
          <div className="w-full md:w-1/2">
            <Controller
              control={control}
              name="price"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  id="price"
                  label="مثلا ۷۰,۰۰۰,۰۰۰"
                  value={value}
                  onChange={(e) => {
                    const lastCharacter = e.target.value.slice(-1);
                    if (!numberInputRegex.test(lastCharacter)) return;

                    const result = Number(
                      englishNumber(e.target.value.replaceAll("٬", "")),
                    ).toLocaleString("fa-ir");

                    onChange(result === "۰" ? "" : result);
                  }}
                  error={!!errors.price}
                  sx={{
                    width: "100%",
                    height: "56px",
                    "& .MuiInputBase-root": {
                      height: "56px",
                    },
                    "& label": {
                      top: "3px !important",
                      fontSize: 12,
                    },
                    "& legend": {
                      fontSize: 9,
                    },
                  }}
                  variant="outlined"
                  inputProps={{ inputMode: "numeric" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ "& p": { fontSize: 12, fontWeight: 500 } }}
                      >
                        تومان
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">
          <p className="w-full text-right text-sm font-medium text-grey md:w-1/2">
            نوع سیم کارت خود را مشخص کنید:
          </p>
          <div
            className={`h-[56px] w-full rounded-lg border md:w-1/2 ${!!errors.type ? "border-red" : "border-grey-300"}`}
          >
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <RadioGroup
                  name="type"
                  value={value}
                  onChange={onChange}
                  row
                  sx={{ height: "100%" }}
                >
                  <FormControlLabel
                    value="0"
                    control={<Radio />}
                    label="دائمی"
                    slotProps={{
                      typography: { fontSize: 14, fontWeight: 400 },
                    }}
                    sx={{ width: "50%" }}
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio />}
                    label="اعتباری"
                    slotProps={{
                      typography: { fontSize: 14, fontWeight: 400 },
                    }}
                  />
                </RadioGroup>
              )}
            />
          </div>
        </div>
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">
          <p className="w-full text-right text-sm font-medium text-grey md:w-1/2">
            وضعیت سیم کارت خود را مشخص کنید:
          </p>
          <div className="h-[56px] w-full md:w-1/2">
            <Controller
              control={control}
              name="status"
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  id="pre-number-select"
                  select
                  label="وضعیت سیم کارت"
                  defaultValue=""
                  value={value}
                  onChange={onChange}
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                  variant="outlined"
                  error={!!errors.status}
                >
                  <MenuItem value="0">نو</MenuItem>
                  <MenuItem value="1">کارکرده</MenuItem>
                  <MenuItem value="2">در حد نو</MenuItem>
                  <MenuItem value="3">صفر به نام</MenuItem>
                </TextField>
              )}
            />
          </div>
        </div>
        {showError && (
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red p-4 text-sm font-normal text-grey">
            <div className="flex w-full flex-row items-center gap-3">
              <Image
                src="/icons/icon-close-square.svg"
                alt="Error"
                width={32}
                height={32}
              />
              <p className="font-medium">لطفا موارد زیر را اصلاح کنید</p>
            </div>
            {errorReasons.map((item, index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center gap-2"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-red pt-1 text-red">
                  {persianNumber(index)}
                </div>
                <p>{persianNumber(item.message)}</p>
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-0 z-20 flex h-20 w-full flex-row-reverse items-center justify-start border-t border-grey-200 bg-white p-4 md:static md:justify-between md:border-0 md:p-0">
          <button
            type="submit"
            disabled={loading}
            className="flex h-[56px] w-full items-center justify-center rounded-lg bg-grey text-base font-semibold text-white md:w-1/2"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-4 border-slate-300 border-t-grey-800"></div>
            ) : (
              <p> ثبت پیشنهاد</p>
            )}
          </button>
        </div>
      </form>
      <CartModal cartId={cartId} />
    </>
  );
}
