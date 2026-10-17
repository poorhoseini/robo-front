"use client";

import { GetMyWalletBalanceResponseProps } from "../entities/wallet";
import { ResponseError } from "./error";

export default async function getMyWalletBalance(
  auth: string,
): Promise<GetMyWalletBalanceResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/view/getBalance`,
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
      errorResponse.message || "در دریافت موجودی کیف پول خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
