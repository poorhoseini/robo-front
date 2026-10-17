"use client";

import {
  ChangeSimPriceRequestProps,
  ChangeSimPriceResponseProps,
} from "../entities/changeSimPrice";
import { ResponseError } from "./error";

export default async function changeSimPrice(
  auth: string,
  data: ChangeSimPriceRequestProps,
): Promise<ChangeSimPriceResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/edit/changePrice`,
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
      errorResponse.message || "در تغییر قیمت سیمکارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
