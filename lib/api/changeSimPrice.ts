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
    let errorResponse: any = {};
    try {
      errorResponse = await res.json();
    } catch {
      // response body was empty or not JSON
    }
    const message =
      errorResponse?.message ||
      (res.status === 510
        ? "تغییر قیمت برای این سیم کارت امکان‌پذیر نیست. در صورت داشتن تخفیف فعال، ابتدا تخفیف را حذف کنید."
        : "در تغییر قیمت سیمکارت خطایی رخ داده است");
    throw new ResponseError(
      message,
      errorResponse?.data,
      errorResponse?.reason || res.status,
    );
  }

  return res.json();
}
