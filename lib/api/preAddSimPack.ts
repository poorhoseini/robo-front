"use client";

import {
  PreAddSimPackRequestProps,
  PreAddSimPackResponseProps,
} from "../entities/preAddSimPack";
import { ResponseError } from "./error";

export default async function preAddSimPack(
  data: PreAddSimPackRequestProps,
  auth: string,
): Promise<PreAddSimPackResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simcard/pre/addSimPack`,
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
      errorResponse.message || "در اضافه کردن سیم پک خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
