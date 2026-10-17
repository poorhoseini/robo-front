"use client";

import {
  PreAddSimCardRequestProps,
  PreAddSimCardResponseProps,
} from "../entities/preAddSimCard";
import { ResponseError } from "./error";

export default async function preAddHighestBid(
  data: PreAddSimCardRequestProps,
  auth: string,
): Promise<PreAddSimCardResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/highBid/pre/add/simcard`,
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
      errorResponse.message ||
        "در اضافه کردن بالاترین پیشنهاد سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
