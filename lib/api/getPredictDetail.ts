"use client";

import {
  GetPredictDetailRequestProps,
  GetPredictDetailResponseProps,
} from "../entities/predict";
import { ResponseError } from "./error";

export default async function getPredictDetail(
  auth: string,
  data: GetPredictDetailRequestProps,
): Promise<GetPredictDetailResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/perdict/get/detial`,
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
      errorResponse.message || "در دریافت جزئیات تخمین قیمت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
