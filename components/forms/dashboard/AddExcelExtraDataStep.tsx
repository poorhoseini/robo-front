"use client";

import { Autocomplete, TextField } from "@mui/material";
import Image from "next/image";
import { Control, Controller, useForm } from "react-hook-form";
import {
  useAddSimcardActions,
  useCitiesList,
  useCity,
  useHasInstallmentPlan,
  useLoanId,
  useMyInstallmentPlans,
  useProvince,
  useSavedItems,
} from "@/lib/zustand/addSimCard";
import InstallmentPlanSelectorSwitch from "./InstallmentPlanSelectorSwitch";
import { Province } from "@/lib/entities/province";
import { useMemo } from "react";

type AddExcelExtraDataFormProps = {
  province: string;
  city: string;
  hasInstallmentPlan: boolean;
  loanId: string;
};

export default function AddExcelExtraDataStep({
  provincesList,
  installmentsLoading,
  installmentsError,
  handleGetMyInstallmentPlans,
}: {
  provincesList: Province[];
  installmentsLoading: boolean;
  installmentsError: boolean;
  handleGetMyInstallmentPlans: () => void;
}) {
  const savedItems = useSavedItems();
  const province = useProvince();
  const city = useCity();
  const citiesList = useCitiesList();
  const hasInstallmentPlan = useHasInstallmentPlan();
  const loanId = useLoanId();
  const myInstallmentPlans = useMyInstallmentPlans();
  const { setStep, setProvince, setSavedItems } = useAddSimcardActions();

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
    watch,
  } = useForm<AddExcelExtraDataFormProps>({
    defaultValues: {
      province: province?.id.toString(),
      city: city?.id.toString(),
      hasInstallmentPlan: hasInstallmentPlan,
      loanId: loanId,
    },
  });

  const handleSubmitExtraData = (values: AddExcelExtraDataFormProps) => {
    setSavedItems(
      savedItems.map((item) => ({
        ...item,
        province: values.province
          ? provincesList.find(
              (province) => province.id.toString() === values.province,
            ) || null
          : null,
        city: values.city
          ? citiesList.find((city) => city.id.toString() === values.city) ||
            null
          : null,
        hasInstallmentPlan: !!values.loanId,
        loanId: values.loanId,
      })),
    );

    setStep(3);
  };

  const handleStepBack = () => {
    setStep(1);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitExtraData)}
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <div className="flex w-full flex-col items-start gap-8">
        <div className="h-[56px] w-full md:w-[375px]">
          <Controller
            control={control}
            name="province"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                disablePortal
                value={
                  provinceSelectOptions.find((item) => item.value === value) ||
                  provinceSelectOptions[0]
                }
                getOptionLabel={(option) => option.label}
                onChange={(e, option) => {
                  onChange(option?.value || "");
                  setProvince(
                    option?.value
                      ? provincesList.find(
                          (province) => province.id.toString() === option.value,
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
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Autocomplete
                disablePortal
                value={
                  citySelectOptions.find((item) => item.value === value) ||
                  citySelectOptions[0]
                }
                getOptionLabel={(option) => option.label}
                onChange={(e, option) => {
                  onChange(option?.value || "");
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
        <div className="flex w-full flex-col items-start gap-4">
          <InstallmentPlanSelectorSwitch
            control={control as Control<any, any, any>}
            watch={watch}
            errors={errors}
            setValue={setValue}
            fetchLoading={installmentsLoading}
            fetchError={installmentsError}
            installmentPlans={myInstallmentPlans}
            handleGetMyInstallmentPlans={handleGetMyInstallmentPlans}
          />
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
