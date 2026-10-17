"use client";

import {
  ApplyCartRequestProps,
  ApplyCartResponseProps,
} from "../entities/applyCart";
import { ResponseError } from "./error";

export default async function applyCart(
  data: ApplyCartRequestProps,
  auth: string,
): Promise<ApplyCartResponseProps> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/apply`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
    method: "post",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در ثبت سفارش خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
