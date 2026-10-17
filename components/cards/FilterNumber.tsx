"use client";

import {
  codeSelectOptions,
  preNumberSelectOptions,
  simCardStateFilterOptions,
  simCardTypeFilterOptions,
} from "@/lib/constants/filters";
import { RoundType } from "@/lib/entities/roundType";
import {
  englishNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import { InputAdornment, MenuItem, TextField } from "@mui/material";
import React, { useRef, useState } from "react";
import { useForm, Controller, Control } from "react-hook-form";
import RoundTypesFilterModal from "../forms/search/RoundTypesFilterModal";
import ProvincesFilterModal from "../forms/search/ProvincesFilterModal";
import { Province } from "@/lib/entities/province";
import { numberInputRegex } from "@/lib/helpers/regex";
import { useRouter } from "next/navigation";

type FilterNumberFormProps = {
  preNumber: string;
  code: string;
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  provinces: string;
  roundTypes: string;
  minimumPrice: string;
  type: string;
  maximumPrice: string;
  status: string;
};

export default function FilterNumber({
  roundTypesList = [],
  provincesList = [],
}: {
  roundTypesList?: RoundType[];
  provincesList?: Province[];
}) {
  const { handleSubmit, control, setValue } = useForm<FilterNumberFormProps>({
    defaultValues: {
      preNumber: "",
      code: "",
      digit1: "",
      digit2: "",
      digit3: "",
      digit4: "",
      digit5: "",
      digit6: "",
      provinces: "",
      roundTypes: "",
      minimumPrice: "",
      type: "",
      maximumPrice: "",
      status: "",
    },
  });

  const router = useRouter();
  const preNumberRef = useRef<HTMLInputElement>(null);
  const codeRef = useRef<HTMLInputElement>(null);
  const [codeOpen, setCodeOpen] = useState<boolean>(false);
  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);

  const selectDigitInput = (index: number) => {
    digitRefs.current[index]?.select();
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

      if (char && index < digitRefs.current.length - 1) {
        selectDigitInput(index + 1);
      }
    };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    startIndex: number,
  ) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text").replace(/\D/g, ""); // digits only

    if (!pastedText) return;
    const refinedText =
      pastedText.length === 11 && pastedText.startsWith("09")
        ? pastedText.slice(5, 11)
        : pastedText.length === 12 && pastedText.startsWith("98")
          ? pastedText.slice(6, 12)
          : pastedText;

    refinedText.split("").forEach((char, offset) => {
      const index = startIndex + offset;
      if (index < 6) {
        setValue(`digit${index + 1}` as keyof FilterNumberFormProps, char, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    // focus/select the first empty input after the paste
    const nextIndex = Math.min(startIndex + refinedText.length, 5);
    digitRefs.current[nextIndex]?.select();
  };

  const handleSubmitSimcardSearch = (values: FilterNumberFormProps) => {
    const params = new URLSearchParams();
    if (values.preNumber) params.append("preNumber", values.preNumber);
    if (values.code) params.append("code", values.code);
    if (values.digit1) params.append("digit1", values.digit1);
    if (values.digit2) params.append("digit2", values.digit2);
    if (values.digit3) params.append("digit3", values.digit3);
    if (values.digit4) params.append("digit4", values.digit4);
    if (values.digit5) params.append("digit5", values.digit5);
    if (values.digit6) params.append("digit6", values.digit6);
    if (values.provinces) params.append("provinces", values.provinces);
    if (values.roundTypes) params.append("roundTypes", values.roundTypes);
    if (values.type) params.append("type", values.type);
    if (values.status) params.append("state", values.status);
    if (values.minimumPrice)
      params.append(
        "minPrice",
        englishNumber(values.minimumPrice.replaceAll("٬", "")),
      );
    if (values.maximumPrice)
      params.append(
        "maxPrice",
        englishNumber(values.maximumPrice.replaceAll("٬", "")),
      );

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSimcardSearch)}
      className="flex h-[468px] w-[768px] flex-col items-center justify-start gap-6 rounded-xl border border-grey-200 bg-white px-11 py-5"
    >
      <p className="w-full text-right text-base font-medium text-black">
        سیم کارت مورد نظر خود را پیدا کنید
      </p>
      <div className="flex w-full flex-row-reverse items-center justify-center gap-5">
        <Controller
          control={control}
          name="preNumber"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id="pre-number-select"
              select
              label="پیش شماره"
              defaultValue=""
              value={value}
              onChange={(e) => {
                setCodeOpen(true);
                onChange(e);
              }}
              inputRef={preNumberRef}
              sx={{
                width: "165px",
                height: "48px",
                mr: 5,
                "& .MuiInputBase-root": {
                  height: "48px",
                },
              }}
              variant="outlined"
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
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id="code-select"
              select
              label="کد"
              defaultValue=""
              value={value}
              onChange={(e) => {
                setTimeout(() => selectDigitInput(0), 0);
                onChange(e);
              }}
              inputRef={codeRef}
              SelectProps={{
                open: codeOpen,
                onClose: () => setCodeOpen(false),
                onOpen: () => setCodeOpen(true),
              }}
              sx={{
                width: "60px",
                height: "48px",
                "& .MuiInputBase-root": {
                  height: "48px",
                },
              }}
              variant="outlined"
            >
              {codeSelectOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {persianNumber(option.label)}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
        {Array.from({ length: 6 }, (_, i) => ({
          name: `digit${i + 1}` as keyof FilterNumberFormProps,
          index: i,
        })).map(({ name, index }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <TextField
                id={`${name}-input`}
                value={persianNumber(value)}
                onKeyDown={(e) => handleDigitKeyDown(e, index, value, onChange)}
                onChange={handleDigitChange(index, onChange)}
                onPaste={(e) => handlePaste(e, index)}
                inputRef={(el) => (digitRefs.current[index] = el)}
                sx={{
                  width: "48px",
                  height: "48px",
                  "& .MuiInputBase-root": {
                    height: "48px",
                  },
                  "& .MuiInputBase-input": {
                    textAlign: "center",
                  },
                }}
                variant="outlined"
              />
            )}
          />
        ))}
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <RoundTypesFilterModal
          options={roundTypesList.map((roundType) => ({
            id: roundType.id,
            label: roundType.rondLevelFa,
            value: roundType.id.toString(),
          }))}
          defaultValues=""
          control={control as Control<any, any, any>}
          setValue={setValue}
          setAccordionExpanded={() => {}}
          isTextField
        />
        <ProvincesFilterModal
          options={provincesList.map((province) => ({
            id: province.id,
            label: province.name,
            value: province.slug,
          }))}
          defaultValues=""
          control={control as Control<any, any, any>}
          setValue={setValue}
          setAccordionExpanded={() => {}}
          isTextField
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <Controller
          control={control}
          name="minimumPrice"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id="minPrice"
              label="حداقل قیمت"
              value={value}
              onChange={(e) => {
                const lastCharacter = e.target.value.slice(-1);
                if (!numberInputRegex.test(lastCharacter)) return;

                const result = Number(
                  englishNumber(e.target.value.replaceAll("٬", "")),
                ).toLocaleString("fa-ir");

                onChange(result === "۰" ? "" : result);
              }}
              sx={{
                width: "320px",
                height: "56px",
                "& .MuiInputBase-root": {
                  height: "56px",
                },
              }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">تومان</InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id="type-select"
              select
              label="نوع"
              defaultValue=""
              value={value}
              onChange={onChange}
              sx={{
                width: "320px",
                height: "56px",
                "& .MuiInputBase-root": {
                  height: "56px",
                },
              }}
              variant="outlined"
            >
              {simCardTypeFilterOptions.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        />
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <Controller
          control={control}
          name="maximumPrice"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id="maxPrice"
              label="حداکثر قیمت"
              value={value}
              onChange={(e) => {
                const lastCharacter = e.target.value.slice(-1);
                if (!numberInputRegex.test(lastCharacter)) return;

                const result = Number(
                  englishNumber(e.target.value.replaceAll("٬", "")),
                ).toLocaleString("fa-ir");

                onChange(result === "۰" ? "" : result);
              }}
              sx={{
                width: "320px",
                height: "56px",
                "& .MuiInputBase-root": {
                  height: "56px",
                },
              }}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">تومان</InputAdornment>
                ),
              }}
            />
          )}
        />
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id="status-select"
              select
              label="وضعیت"
              defaultValue=""
              value={value}
              onChange={onChange}
              sx={{
                width: "320px",
                height: "56px",
                "& .MuiInputBase-root": {
                  height: "56px",
                },
              }}
              variant="outlined"
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
      <div className="flex w-full flex-row items-center justify-end">
        <button
          type="submit"
          className="h-[48px] w-[320px] rounded-md bg-grey text-[17px] font-bold text-white"
        >
          جستجو
        </button>
      </div>
    </form>
  );
}
