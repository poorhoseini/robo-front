"use client";

import {
  ChangeSimInstallmentPlanRequestProps,
  ChangeSimInstallmentPlanResponseProps,
} from "../entities/changeSimInstallmentPlan";
import { ResponseError } from "./error";

export default async function changeSimInstallmentPlan(
  auth: string,
  data: ChangeSimInstallmentPlanRequestProps,
): Promise<ChangeSimInstallmentPlanResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/installment/change/byId`,
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
      errorResponse.message || "در تغییر طرح اقساطی سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
