"use client";

import { GetMyInstallmentPlansResponseProps } from "../entities/installment";
import { ResponseError } from "./error";

export default async function getMyInstallmentPlans(
  auth: string,
): Promise<GetMyInstallmentPlansResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/installment/getMyInstallmentPlans`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "get",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطا در دریافت اطلاعات شرایط اقساطی",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
