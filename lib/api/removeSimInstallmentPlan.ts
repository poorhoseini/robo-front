"use client";

import {
  RemoveSimInstallmentPlanRequestProps,
  RemoveSimInstallmentPlanResponseProps,
} from "../entities/removeSimInstallmentPlan";
import { ResponseError } from "./error";

export default async function removeSimInstallmentPlan(
  auth: string,
  data: RemoveSimInstallmentPlanRequestProps,
): Promise<RemoveSimInstallmentPlanResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/installment/remove`,
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
      errorResponse.message || "در حذف طرح اقساطی سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
