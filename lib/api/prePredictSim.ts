"use client";

import {
  PrePredictSimRequestProps,
  PrePredictSimResponseProps,
} from "../entities/prePredictSim";
import { ResponseError } from "./error";

export default async function prePredictSim(
  data: PrePredictSimRequestProps,
  auth: string,
): Promise<PrePredictSimResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/perdict/pre/perdict/run`,
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
      errorResponse.message || "در تخمین قیمت سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
