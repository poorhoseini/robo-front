"use client";

import CustomStepper from "@/components/general/CustomStepper";
import { useStep } from "@/lib/zustand/addSimCard";

export default function AddExcelStepperSection() {
  const step = useStep();
  return (
    <CustomStepper
      title="آگهی سیم کارت با فایل اکسل"
      step={step}
      stepperItems={addSimCardStepperItems}
    />
  );
}

const addSimCardStepperItems = [
  {
    title: "آپلود فایل",
    subTitles: ["بارگذاری فایل اکسل"],
  },
  {
    title: "مشخصات مشترک سیم کارت‌ها",
    subTitles: ["انتخاب شهر و استان", "پلن اقساطی"],
  },
  { title: "تایید نهایی", subTitles: [] },
];
