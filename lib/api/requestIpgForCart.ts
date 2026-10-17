"use client";

import {
  PostRequestIpgForCartRequestProps,
  RequestIpgForCartResponseProps,
} from "../entities/ipg";
import { ResponseError } from "./error";

export default async function requestIpgForCart(
  auth: string,
  data: PostRequestIpgForCartRequestProps,
): Promise<RequestIpgForCartResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/pay/requestIPG/completePaymnet`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(data),
      method: "post",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطا در انتقال به درگاه بانکی",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
