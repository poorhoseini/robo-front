"use client";

import {
  PreSetDiscountRequestProps,
  PreSetDiscountResponseProps,
} from "../entities/preSetDiscount";
import { ResponseError } from "./error";

export default async function preSetDiscount(
  data: PreSetDiscountRequestProps,
  auth: string,
): Promise<PreSetDiscountResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/offPrice/pre/set`,
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
      errorResponse.message || "در اعمال تخفیف سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
