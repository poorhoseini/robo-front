"use client";

import { englishNumber } from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import { Control, Controller, useForm } from "react-hook-form";
import {
  useAddSimcardActions,
  useHasInstallmentPlan,
  useLoanId,
  useMyInstallmentPlans,
  usePrice,
  usePriceType,
} from "@/lib/zustand/addSimCard";
import CustomSelector from "@/components/general/CustomSelector";
import { simcardPriceTypeSelectOptions } from "@/lib/constants/selectOptions/simcard";
import InstallmentPlanSelectorSwitch from "./InstallmentPlanSelectorSwitch";

type AddSimCardPriceFormProps = {
  priceType: string;
  price: string;
  hasInstallmentPlan: boolean;
  loanId: string;
};

export default function AddSimCardPriceStep({
  isHighestBid = false,
  installmentsLoading,
  installmentsError,
  handleGetMyInstallmentPlans,
}: {
  isHighestBid: boolean;
  installmentsLoading: boolean;
  installmentsError: boolean;
  handleGetMyInstallmentPlans: () => void;
}) {
  const priceType = usePriceType();
  const price = usePrice();
  const hasInstallmentPlan = useHasInstallmentPlan();
  const loanId = useLoanId();
  const myInstallmentPlans = useMyInstallmentPlans();
  const { setStep, setPriceType, setPrice, setHasInstallmentPlan, setLoanId } =
    useAddSimcardActions();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AddSimCardPriceFormProps>({
    defaultValues: {
      priceType: priceType,
      price: price
        ? Number(englishNumber(price.replaceAll("٬", ""))).toLocaleString(
            "fa-ir",
          )
        : "",
      hasInstallmentPlan: hasInstallmentPlan,
      loanId: loanId,
    },
  });

  const priceTypeWatcher = watch("priceType");

  const handleSubmitPrice = (values: AddSimCardPriceFormProps) => {
    setPriceType(values.priceType);
    setPrice(
      isHighestBid || values.priceType === "0"
        ? englishNumber(values.price.replaceAll("٬", ""))
        : "",
    );
    setHasInstallmentPlan(values.hasInstallmentPlan);
    setLoanId(values.loanId);

    setStep(4);
  };

  const handleStepBack = () => {
    setStep(2);
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitPrice)}
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <div className="flex w-full flex-col items-start gap-8">
        <p className="text-base font-medium text-grey">
          نوع قیمت گذاری سیم کارت را مشخص کنید
        </p>
        <div className="flex w-full flex-col items-start gap-4">
          {!isHighestBid && (
            <Controller
              control={control}
              name="priceType"
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomSelector
                  options={simcardPriceTypeSelectOptions}
                  value={value}
                  error={!!error}
                  onChange={onChange}
                />
              )}
            />
          )}
          {(priceTypeWatcher === "0" || isHighestBid) && (
            <div className="h-[56px] w-full">
              <Controller
                control={control}
                name="price"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    id="price"
                    label={isHighestBid ? "قیمت پایه" : "قیمت"}
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
          )}
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
