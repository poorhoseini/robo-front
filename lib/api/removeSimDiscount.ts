"use client";

import {
  RemoveSimDiscountRequestProps,
  RemoveSimDiscountResponseProps,
} from "../entities/removeSimDiscount";
import { ResponseError } from "./error";

export default async function removeSimDiscount(
  auth: string,
  data: RemoveSimDiscountRequestProps,
): Promise<RemoveSimDiscountResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/offPrice/remove`,
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
      errorResponse.message || "در حذف تخفیف سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
