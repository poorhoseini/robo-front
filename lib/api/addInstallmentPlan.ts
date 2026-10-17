"use client";

import {
  AddInstallmentPlanRequestProps,
  AddInstallmentPlanResponseProps,
} from "../entities/installment";
import { ResponseError } from "./error";

export default async function addInstallmentPlans(
  auth: string,
  data: AddInstallmentPlanRequestProps,
): Promise<AddInstallmentPlanResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/installment/addPlan`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطا در ثبت شرایط اقساطی جدید",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
