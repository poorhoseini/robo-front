"use client";

import Space from "@/components/general/Space";
import UploadButton from "@/components/general/UploadButton";
import { ResponseError } from "@/lib/api/error";
import extractExcel from "@/lib/api/extractExcel";
import {
  ExtractExcelFormProps,
  ExtractExcelResponseProps,
} from "@/lib/entities/extractExcel";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { useAddSimcardActions } from "@/lib/zustand/addSimCard";
import Image from "next/image";
import { useContext, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function AddExcelUploadStep() {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { setStep, setSavedItems } = useAddSimcardActions();
  const [loading, setLoading] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ExtractExcelFormProps>({
    defaultValues: {
      file: undefined,
    },
  });

  const handleSubmitSimCardNumber = async (values: ExtractExcelFormProps) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("file", values.file);

    try {
      const response: ExtractExcelResponseProps = await extractExcel(
        formData,
        auth.token,
      );

      setSavedItems(
        response.data.simcards.map((simcard) => ({
          phoneNumber: simcard.phoneNumber.replaceAll(" ", ""),
          type: simcard.type.toString(),
          status: simcard.state.toString(),
          price: simcard.price.toString(),
          priceType: simcard.priceType.toString(),
          province: null,
          city: null,
          roundData: undefined,
          hasInstallmentPlan: false,
          loanId: "",
        })),
      );
      setStep(2);
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
        toast.error("خطا در پردازش اکسل");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSimCardNumber)}
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <div className="flex w-full flex-col items-start">
        <p className="text-base font-medium text-grey">بارگزاری فایل اکسل:</p>
        <Space value={24} />
        <div className="flex w-full flex-col items-start gap-2 md:flex-row-reverse md:items-start md:gap-7">
          <div className="flex w-full flex-col items-center gap-2">
            {[
              " نمونه اکسل را دانلود کنید.",
              "سیم‌کارت‌های خود وارد فایل کنید.",
              "فایل نهایی را با استفاده از گزینه “آپلود فایل اکسل” بارگذاری کنید.",
            ].map((item, index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center justify-start gap-2"
              >
                <div className="flex min-h-5 min-w-5 items-center justify-center rounded-full bg-biege text-xs font-normal leading-[14px] text-grey">
                  {persianNumber(index + 1)}
                </div>
                <p className="text-sm font-medium leading-7">{item}</p>
              </div>
            ))}
          </div>
          <div className="relative flex h-[200px] w-full items-center justify-center md:h-[293px] md:min-w-[539px]">
            <div className="absolute inset-0 bg-[url('/images/excel.png')] bg-cover bg-center opacity-10" />
            <div className="relative z-10">
              <a href="/files/simListWithFile.xlsx" download>
                <button
                  type="button"
                  className="flex flex-row items-center justify-center gap-2 rounded-xl bg-grey px-6 py-3"
                >
                  <Image
                    src="/icons/icon-download-white.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                  <span className="text-sm font-medium leading-5 text-white">
                    دانلود نمونه
                  </span>
                </button>
              </a>
            </div>
          </div>
        </div>
        <Space value={16} />
        <div className="flex w-full flex-col items-center gap-2 rounded-xl bg-biege px-6 py-4 md:flex-row md:justify-between">
          <p className="text-base font-normal leading-5 text-grey md:text-xl md:font-medium">
            آگهی گروهی سیم کارت‌های شما با استفاده از فایل اکسل
          </p>
          <Controller
            control={control}
            name="file"
            rules={{
              required: true,
            }}
            render={({ field, fieldState }) => (
              <UploadButton
                {...field}
                loading={loading}
                onChange={(e) => {
                  field.onChange(e);
                  submitButtonRef.current?.click();
                }}
                label="آپلود فایل اکسل"
                type="excel"
                fullWidth
                compress
              />
            )}
          />
        </div>
      </div>
      <button type="submit" className="hidden" ref={submitButtonRef}>
        ادامه
      </button>
    </form>
  );
}
