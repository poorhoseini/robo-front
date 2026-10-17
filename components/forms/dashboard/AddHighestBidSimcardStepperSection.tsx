"use client";

import CustomStepper from "@/components/general/CustomStepper";
import { useStep } from "@/lib/zustand/addSimCard";

export default function AddHighestBidSimcardStepperSection() {
  const step = useStep();

  return (
    <CustomStepper
      title="آگهی بالاترین پیشنهاد سیم کارت"
      step={step}
      stepperItems={addSimCardStepperItems}
    />
  );
}

const addSimCardStepperItems = [
  {
    title: "مشخصات سیم کارت",
    subTitles: ["وارد کردن شماره", "شرایط سیم کارت", "انتخاب شهر و استان"],
  },
  { title: "مشاهده نوع رندی", subTitles: [] },
  { title: "قیمت گذاری", subTitles: ["نوع قیمت گذاری", "پلن اقساطی"] },
  { title: "مشخصات آگهی", subTitles: [] },
  { title: "تایید نهایی / اضافه کردن سیم کارت جدید", subTitles: [] },
];
