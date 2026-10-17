import {
  codeSelectOptions,
  preNumberSelectOptions,
} from "@/lib/constants/filters";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { useAnalysisActions } from "@/lib/zustand/analysis";
import { MenuItem, TextField } from "@mui/material";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import CustomButton from "../general/CustomButton";
import { toast } from "react-toastify";
import { ResponseError } from "@/lib/api/error";
import { GetSimCardRoundTypesResponseProps } from "@/lib/entities/round";
import getSimCardRoundTypes from "@/lib/api/getSimCardRoundTypes";

type AnalysisFormProps = {
  step: number;
  preNumber: string;
  code: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  digit10: string;
  digit11: string;
  simcardState: string;
  simcardType: string;
};

export default function PhoneNumberStep() {
  const [loading, setLoading] = useState(false);
  const {
    setStep,
    setRoundData,
    setPreNumber,
    setCode,
    setDigit6,
    setDigit7,
    setDigit8,
    setDigit9,
    setDigit10,
    setDigit11,
  } = useAnalysisActions();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnalysisFormProps>({
    defaultValues: {
      preNumber: "",
      code: "",
      digit6: "",
      digit7: "",
      digit8: "",
      digit9: "",
      digit10: "",
      digit11: "",
      simcardState: "",
      simcardType: "",
    },
  });

  const [codeOpen, setCodeOpen] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const digit6Ref = useRef<HTMLInputElement>(null);
  const digit7Ref = useRef<HTMLInputElement>(null);
  const digit8Ref = useRef<HTMLInputElement>(null);
  const digit9Ref = useRef<HTMLInputElement>(null);
  const digit10Ref = useRef<HTMLInputElement>(null);
  const digit11Ref = useRef<HTMLInputElement>(null);

  const handleSubmitFilters = async (values: AnalysisFormProps) => {
    setLoading(true);

    try {
      const getSimCardRoundTypesResponse: GetSimCardRoundTypesResponseProps =
        await getSimCardRoundTypes({
          phoneNumber:
            "09" +
            values.preNumber +
            values.code +
            values.digit6 +
            values.digit7 +
            values.digit8 +
            values.digit9 +
            values.digit10 +
            values.digit11,
        });
      setRoundData(getSimCardRoundTypesResponse?.data);
      setStep(2);
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
      } else {
        toast.error("خطا در دریافت آنالیز شماره");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full items-start justify-center">
      <form
        onSubmit={handleSubmit(handleSubmitFilters)}
        className="flex w-full flex-row items-center justify-start gap-6 rounded-2xl border border-grey-200 bg-white px-6 py-4"
      >
        <div className="ltr flex flex-row items-center justify-end gap-3">
          <Controller
            name="preNumber"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
                id="pre-number-select"
                select
                label="پیش شماره"
                value={value}
                onChange={(e) => {
                  setCodeOpen(true);
                  onChange(e);
                  setPreNumber(e.target.value);
                }}
                sx={{ width: "185px" }}
                variant="outlined"
                error={!!errors?.preNumber}
              >
                {preNumberSelectOptions.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {persianNumber(option.label)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="code"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
                id="code-select"
                select
                label="کد"
                value={value}
                onChange={(e) => {
                  setTimeout(() => digit6Ref.current?.focus(), 0);
                  onChange(e);
                  setCode(e.target.value);
                }}
                inputRef={codeRef}
                SelectProps={{
                  open: codeOpen,
                  onClose: () => setCodeOpen(false),
                  onOpen: () => setCodeOpen(true),
                }}
                sx={{ width: "80px" }}
                variant="outlined"
                error={!!errors?.code}
              >
                {codeSelectOptions.map((option) => (
                  <MenuItem key={option.id} value={option.value}>
                    {persianNumber(option.label)}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            name="digit6"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
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
                    setTimeout(() => digit6Ref.current?.select(), 0);
                  } else {
                    setTimeout(() => digit6Ref.current?.select(), 0);
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!Number.isNaN(Number(value))) {
                    value && setTimeout(() => digit7Ref.current?.select(), 0);
                    onChange(e);
                    setDigit6(e.target.value);
                  }
                }}
                inputRef={digit6Ref}
                sx={{ width: "56px" }}
                variant="outlined"
                error={!!errors?.digit6}
              />
            )}
          />
          <Controller
            name="digit7"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
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
                    setDigit7(e.target.value);
                  }
                }}
                inputRef={digit7Ref}
                sx={{ width: "56px" }}
                variant="outlined"
                error={!!errors?.digit7}
              />
            )}
          />
          <Controller
            name="digit8"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
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
                    setDigit8(e.target.value);
                  }
                }}
                inputRef={digit8Ref}
                sx={{ width: "56px" }}
                variant="outlined"
                error={!!errors?.digit8}
              />
            )}
          />
          <Controller
            name="digit9"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
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
                    value && setTimeout(() => digit10Ref.current?.select(), 0);
                    onChange(e);
                    setDigit9(e.target.value);
                  }
                }}
                inputRef={digit9Ref}
                sx={{ width: "56px" }}
                variant="outlined"
                error={!!errors?.digit9}
              />
            )}
          />
          <Controller
            name="digit10"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
                id="digit10-input"
                value={persianNumber(value)}
                onFocus={(e) => {
                  setTimeout(() => digit10Ref.current?.select(), 0);
                }}
                onClick={(e) => {
                  setTimeout(() => digit10Ref.current?.select(), 0);
                }}
                onKeyDown={(e) => {
                  const keyCode = e.key;
                  if (keyCode === "Backspace") {
                    setTimeout(() => digit9Ref.current?.select(), 0);
                  } else {
                    setTimeout(() => digit10Ref.current?.select(), 0);
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!Number.isNaN(Number(value))) {
                    value && setTimeout(() => digit11Ref.current?.select(), 0);
                    onChange(e);
                    setDigit10(e.target.value);
                  }
                }}
                inputRef={digit10Ref}
                sx={{ width: "56px" }}
                variant="outlined"
                error={!!errors?.digit10}
              />
            )}
          />
          <Controller
            name="digit11"
            control={control}
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                size="medium"
                id="digit11-input"
                value={persianNumber(value)}
                onFocus={(e) => {
                  setTimeout(() => digit11Ref.current?.select(), 0);
                }}
                onClick={(e) => {
                  setTimeout(() => digit11Ref.current?.select(), 0);
                }}
                onKeyDown={(e) => {
                  const keyCode = e.key;
                  if (keyCode === "Backspace") {
                    setTimeout(() => digit10Ref.current?.select(), 0);
                  } else {
                    setTimeout(() => digit11Ref.current?.select(), 0);
                  }
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!Number.isNaN(Number(value))) {
                    // value && setTimeout(() => digit7Ref.current?.select(), 0);
                    onChange(e);
                    setDigit11(e.target.value);
                  }
                }}
                inputRef={digit11Ref}
                sx={{ width: "56px" }}
                variant="outlined"
                error={!!errors?.digit11}
              />
            )}
          />
        </div>
        <div className="w-full max-w-[170px]">
          <CustomButton
            type="submit"
            loading={loading}
            label="تایید"
            disabled={loading}
          />
        </div>
      </form>
    </div>
  );
}
