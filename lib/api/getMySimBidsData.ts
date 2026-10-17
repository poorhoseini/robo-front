"use client";

import {
  GetSimBidsRequestProps,
  GetSimBidsResponseProps,
} from "../entities/bid";
import { ResponseError } from "./error";

export default async function getMySimBidsData(
  auth: string,
  data: GetSimBidsRequestProps,
): Promise<GetSimBidsResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/highBid/view/offers`,
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
      errorResponse.message || "در دریافت پیشنهادات سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
