"use client";

import { RoundType } from "@/lib/entities/roundType";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { MenuItem, TextField } from "@mui/material";
import Image from "next/image";
import { useRef } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import RoundTypesMultipleSelectModal from "../search/RoundTypesMultipleSelectModal";
import { simCardStateFilterOptions } from "@/lib/constants/filters";
import {
  useDigit1,
  useDigit2,
  useDigit3,
  useDigit4,
  useDigit5,
  useDigit6,
  useDigit7,
  useDigit8,
  useDigit9,
  useType,
  useStatus,
  useAddSimKhastActions,
  useRoundTypeIds,
} from "@/lib/zustand/addSimKhast";

type AddSimKhastNumberFormProps = {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  roundTypes: string;
  type: string;
  status: string;
};

export default function AddSimKhastNumberStep({
  roundTypesList,
}: {
  roundTypesList: RoundType[];
}) {
  const digit1 = useDigit1();
  const digit2 = useDigit2();
  const digit3 = useDigit3();
  const digit4 = useDigit4();
  const digit5 = useDigit5();
  const digit6 = useDigit6();
  const digit7 = useDigit7();
  const digit8 = useDigit8();
  const digit9 = useDigit9();
  const type = useType();
  const status = useStatus();
  const roundTypeIds = useRoundTypeIds();
  const {
    setStep,
    setDigit1,
    setDigit2,
    setDigit3,
    setDigit4,
    setDigit5,
    setDigit6,
    setDigit7,
    setDigit8,
    setDigit9,
    setStatus,
  } = useAddSimKhastActions();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<AddSimKhastNumberFormProps>({
    defaultValues: {
      digit1: digit1,
      digit2: digit2,
      digit3: digit3,
      digit4: digit4,
      digit5: digit5,
      digit6: digit6,
      digit7: digit7,
      digit8: digit8,
      digit9: digit9,
      roundTypes: roundTypeIds.toString(),
      type: type,
      status: status,
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

  const handleSubmitSimCardNumber = (values: AddSimKhastNumberFormProps) => {
    setStep(2);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSimCardNumber)}
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <div className="flex w-full flex-col items-start gap-6">
        <p className="text-base font-medium text-grey">
          شماره مورد نظر خود را وارد کنید
        </p>
        <div className="flex w-full flex-row items-start justify-start rounded-lg bg-blue-900 p-4">
          <Image
            src="/icons/icon-info-blue.svg"
            alt=""
            width={24}
            height={24}
          />
          <p className="text-base font-medium leading-9 text-grey">
            شما می‌توانید فرمت شماره دلخواه خود را وارد کنید. برای این منظور
            نیازی نیست تک تک شماه‌ها مشخص شود. صرفا با تغییر چند جایگاه
            می‌توانید پیشنهاد مشابه فرمت مورد نظر خود را دریافت کنید.
          </p>
        </div>
        <div className="flex w-full flex-col items-start gap-6">
          <div className="flex w-full flex-row-reverse items-center justify-between">
            <div className="h-[30px] w-[30px] md:h-12 md:w-12">
              <TextField
                disabled
                value={persianNumber("09")}
                sx={{
                  width: "100%",
                  height: "100%",
                  "& .MuiInputBase-root": {
                    height: "100%",
                    "&.Mui-disabled": {
                      backgroundColor: "#404040",
                    },
                    "& .Mui-disabled": {
                      WebkitTextFillColor: "white !important",
                    },
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit2Ref.current?.select(), 0);
                        onChange(e);
                        setDigit1(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit3Ref.current?.select(), 0);
                        onChange(e);
                        setDigit2(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit4Ref.current?.select(), 0);
                        onChange(e);
                        setDigit3(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit5Ref.current?.select(), 0);
                        onChange(e);
                        setDigit4(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit6Ref.current?.select(), 0);
                        onChange(e);
                        setDigit5(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit7Ref.current?.select(), 0);
                        onChange(e);
                        setDigit6(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit8Ref.current?.select(), 0);
                        onChange(e);
                        setDigit7(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        value &&
                          setTimeout(() => digit9Ref.current?.select(), 0);
                        onChange(e);
                        setDigit8(value);
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
                      if (!Number.isNaN(Number(value)) || value === "*") {
                        //   value && setTimeout(() => digit7Ref.current?.select(), 0);
                        onChange(e);
                        setDigit9(value);
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
          <div className="flex w-full flex-col items-start gap-4">
            <p className="text-base font-medium text-grey">
              انتخاب انواع رندی (اختیاری):
            </p>
            <RoundTypesMultipleSelectModal
              options={roundTypesList.map((roundType) => ({
                id: roundType.id,
                label: roundType.rondLevelFa,
                value: roundType.id.toString(),
              }))}
              defaultValues={roundTypeIds.toString()}
              control={control}
              setValue={setValue}
            />
            <p className="text-base font-medium text-grey">
              شرایط سیم کارت (اختیاری):
            </p>
            <SimKhastTypeSelector control={control} error={!!errors?.type} />
            <div className="h-[56px] w-full md:w-[375px]">
              <Controller
                control={control}
                name="status"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    id="pre-number-select"
                    select
                    label="وضعیت سیم کارت (اختیاری)"
                    defaultValue=""
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      setStatus(e.target.value);
                    }}
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
                    {simCardStateFilterOptions.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
        <button
          type="submit"
          className="flex h-12 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          ادامه
        </button>
      </div>
      <div className="hidden w-full flex-row items-center justify-center gap-4 md:flex">
        <button
          type="submit"
          className="flex h-14 w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
        >
          تایید
        </button>
        <button
          type="button"
          className="invisible flex h-14 min-w-14 items-center justify-center rounded-xl border border-grey bg-white"
        >
          <Image
            src="/icons/icon-arrow-left-grey.svg"
            alt="Back"
            width={24}
            height={24}
          />
        </button>
      </div>
    </form>
  );
}

function SimKhastTypeSelector({
  control,
  error,
}: {
  control: Control<AddSimKhastNumberFormProps, any>;
  error: boolean;
}) {
  const { setType } = useAddSimKhastActions();

  return (
    <Controller
      control={control}
      name="type"
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex h-14 w-full flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onChange("0");
              setType("0");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "0" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            دائمی
          </button>
          <button
            type="button"
            onClick={() => {
              onChange("1");
              setType("1");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "1" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            اعتباری
          </button>
        </div>
      )}
    ></Controller>
  );
}
