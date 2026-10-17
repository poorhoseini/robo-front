"use client";

import { englishNumber } from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { Autocomplete, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { useMemo } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { Province } from "@/lib/entities/province";
import {
  useAddSimKhastActions,
  useCitiesList,
  useCity,
  useMaxPrice,
  useMinPrice,
  useOperator,
  useProvince,
} from "@/lib/zustand/addSimKhast";

type AddSimKhastPriceFormProps = {
  minPrice: string;
  maxPrice: string;
  province: string;
  city: string;
  operator: string;
};

export default function AddSimKhastPriceStep({
  provincesList = [],
}: {
  provincesList?: Province[];
}) {
  const minPrice = useMinPrice();
  const maxPrice = useMaxPrice();
  const province = useProvince();
  const city = useCity();
  const operator = useOperator();
  const citiesList = useCitiesList();
  const { setStep, setMinPrice, setMaxPrice, setProvince, setCity } =
    useAddSimKhastActions();

  const provinceSelectOptions = useMemo(() => {
    return [
      { id: 0, label: "", value: "" },
      ...provincesList.map((province) => ({
        id: province.id,
        label: province.name,
        value: province.id.toString(),
      })),
    ];
  }, [provincesList]);

  const citySelectOptions = useMemo(() => {
    return [
      { id: 0, label: "", value: "" },
      ...citiesList.map((city) => ({
        id: city.id,
        label: city.name,
        value: city.id.toString(),
      })),
    ];
  }, [citiesList]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<AddSimKhastPriceFormProps>({
    defaultValues: {
      minPrice: minPrice
        ? Number(englishNumber(minPrice.replaceAll("٬", ""))).toLocaleString(
            "fa-ir",
          )
        : "",
      maxPrice: maxPrice
        ? Number(englishNumber(maxPrice.replaceAll("٬", ""))).toLocaleString(
            "fa-ir",
          )
        : "",
      province: province?.id.toString(),
      city: city?.id.toString(),
      operator: operator,
    },
  });

  const handleSubmitPrice = (values: AddSimKhastPriceFormProps) => {
    setMinPrice(englishNumber(minPrice.replaceAll("٬", "")));
    setMaxPrice(englishNumber(maxPrice.replaceAll("٬", "")));
    setStep(3);
  };

  const handleStepBack = () => {
    setStep(1);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitPrice)}
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <div className="flex w-full flex-col items-start gap-4">
        <p className="text-base font-medium text-grey">
          بازه قیمت سیم کارت را مشخص کنید
        </p>
        <div className="flex h-[56px] w-full flex-row items-center gap-4">
          <Controller
            control={control}
            name="minPrice"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                id="minPrice"
                label="قیمت از"
                value={value}
                onChange={(e) => {
                  const lastCharacter = e.target.value.slice(-1);
                  if (!numberInputRegex.test(lastCharacter)) return;

                  const result = Number(
                    englishNumber(e.target.value.replaceAll("٬", "")),
                  ).toLocaleString("fa-ir");

                  onChange(result === "۰" ? "" : result);
                  setMinPrice(result === "۰" ? "" : result);
                }}
                error={!!errors.minPrice}
                sx={{
                  width: "100%",
                  height: "100%",
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
          <Controller
            control={control}
            name="maxPrice"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <TextField
                id="maxPrice"
                label="قیمت تا"
                value={value}
                onChange={(e) => {
                  const lastCharacter = e.target.value.slice(-1);
                  if (!numberInputRegex.test(lastCharacter)) return;

                  const result = Number(
                    englishNumber(e.target.value.replaceAll("٬", "")),
                  ).toLocaleString("fa-ir");

                  onChange(result === "۰" ? "" : result);
                  setMaxPrice(result === "۰" ? "" : result);
                }}
                error={!!errors.maxPrice}
                sx={{
                  width: "100%",
                  height: "100%",
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
        <p className="text-base font-medium text-grey">
          انتخاب شهر و استان (اختیاری)
        </p>
        <div className="h-[56px] w-full md:w-[375px]">
          <Controller
            control={control}
            name="province"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Autocomplete
                disablePortal
                value={
                  provinceSelectOptions.find((item) => item.value === value) ||
                  provinceSelectOptions[0]
                }
                getOptionLabel={(option) => option.label}
                onChange={(e, value) => {
                  onChange(value?.value || "");
                  setProvince(
                    value?.value
                      ? provincesList.find(
                          (province) => province.id.toString() === value.value,
                        ) || null
                      : null,
                  );
                  setValue("city", "");
                }}
                options={provinceSelectOptions}
                filterOptions={(options, state) =>
                  options.filter(
                    (option) =>
                      !!option.value && option.label.includes(state.inputValue),
                  )
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="انتخاب استان"
                    error={!!errors.province}
                  />
                )}
              />
            )}
          />
        </div>
        <div className="h-[56px] w-full md:w-[375px]">
          <Controller
            control={control}
            name="city"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Autocomplete
                disablePortal
                value={
                  citySelectOptions.find((item) => item.value === value) ||
                  citySelectOptions[0]
                }
                getOptionLabel={(option) => option.label}
                onChange={(e, value) => {
                  onChange(value?.value || "");
                  setCity(
                    value?.value
                      ? citiesList.find(
                          (city) => city.id.toString() === value.value,
                        ) || null
                      : null,
                  );
                }}
                options={citySelectOptions}
                filterOptions={(options, state) =>
                  options.filter(
                    (option) =>
                      !!option.value && option.label.includes(state.inputValue),
                  )
                }
                isOptionEqualToValue={(option, value) =>
                  option.value === value?.value
                }
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  "& .MuiInputBase-root": {
                    height: "100%",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="انتخاب شهر"
                    error={!!errors.city}
                  />
                )}
              />
            )}
          />
        </div>
        <p className="text-base font-medium text-grey">
          انتخاب اپراتور (اختیاری)
        </p>
        <SimKhastOperatorSelector control={control} />
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
          onClick={handleStepBack}
          className="flex h-14 min-w-14 items-center justify-center rounded-xl border border-grey bg-white"
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

function SimKhastOperatorSelector({
  control,
  error = false,
}: {
  control: Control<AddSimKhastPriceFormProps, any>;
  error?: boolean;
}) {
  const { setOperator } = useAddSimKhastActions();

  return (
    <Controller
      control={control}
      name="operator"
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex h-14 w-full flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              onChange(value === "mci" ? "" : "mci");
              setOperator(value === "mci" ? "" : "mci");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "mci" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            همراه اول
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value === "mtn" ? "" : "mtn");
              setOperator(value === "mtn" ? "" : "mtn");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "mtn" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            ایرانسل
          </button>
          <button
            type="button"
            onClick={() => {
              onChange(value === "rightel" ? "" : "rightel");
              setOperator(value === "rightel" ? "" : "rightel");
            }}
            className={`flex h-full w-full items-center justify-center rounded-md border text-base font-normal ${error ? "border-error bg-white text-error" : value === "rightel" ? "bg-grey text-white" : "border-grey-200 bg-white text-grey"}`}
          >
            رایتل
          </button>
        </div>
      )}
    ></Controller>
  );
}
