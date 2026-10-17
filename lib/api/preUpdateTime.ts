"use client";

import {
  PreUpdateTimeRequestProps,
  PreUpdateTimeResponseProps,
} from "../entities/preUpdateTime";
import { ResponseError } from "./error";

export default async function preUpdateTime(
  auth: string,
  data: PreUpdateTimeRequestProps,
): Promise<PreUpdateTimeResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/refrence/pre/updateTime`,
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
      errorResponse.message || "در بروزرسانی تاریخ سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
