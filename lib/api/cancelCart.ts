"use client";

import {
  CloseCartRequestProps,
  CloseCartResponseProps,
} from "../entities/closeCart";
import { ResponseError } from "./error";

export default async function cancelCart(
  data: CloseCartRequestProps,
  auth: string,
): Promise<CloseCartResponseProps> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/cart/close`, {
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
      errorResponse.message || "در بستن سفارش خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
