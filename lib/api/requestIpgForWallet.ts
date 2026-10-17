"use client";

import {
  PostRequestIpgForWalletRequestProps,
  RequestIpgForWalletResponseProps,
} from "../entities/ipg";
import { ResponseError } from "./error";

export default async function requestIpgForWallet(
  auth: string,
  data: PostRequestIpgForWalletRequestProps,
): Promise<RequestIpgForWalletResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/cerdit/request/`,
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
