"use client";

import CustomStepper from "@/components/general/CustomStepper";
import { useStep } from "@/lib/zustand/addSimPack";

export default function AddSimPackStepperSection() {
  const step = useStep();
  return (
    <CustomStepper
      title="ثبت آگهی سیم پک"
      step={step}
      stepperItems={addSimPackStepperItems}
    />
  );
}

const addSimPackStepperItems = [
  {
    title: "مشخصات سیم کارت ها",
    subTitles: ["وارد کردن شماره ها", "شرایط سیم کارت ها"],
  },
  {
    title: "قیمت گذاری",
    subTitles: [
      "نوع سیم پک",
      "انتخاب شهر و استان",
      "نوع قیمت گذاری",
      "پلن اقساطی",
    ],
  },
  { title: "مشخصات آگهی", subTitles: [] },
  { title: "تایید نهایی", subTitles: [] },
];
