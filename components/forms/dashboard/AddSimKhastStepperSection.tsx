"use client";

import CustomStepper from "@/components/general/CustomStepper";
import { useStep } from "@/lib/zustand/addSimKhast";

export default function AddSimKhastStepperSection() {
  const step = useStep();

  return (
    <CustomStepper
      title="ثبت آگهی سیم خواست"
      step={step}
      stepperItems={addSimKhastStepperItems}
    />
  );
}

const addSimKhastStepperItems = [
  {
    title: "مشخصات سیم کارت",
    subTitles: [
      "وارد کردن شماره",
      "انتخاب انواع رندی",
      "شرایط سیم کارت",
      "وضعیت سیم کارت",
    ],
  },
  {
    title: "قیمت گذاری",
    subTitles: ["نوع قیمت گذاری", "انتخاب شهر و استان", "نوع اپراتور"],
  },
  { title: "مشخصات آگهی", subTitles: [] },
];
