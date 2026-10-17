"use client";

import {
  PreAddSimKhastRequestProps,
  PreAddSimKhastResponseProps,
} from "../entities/preAddSimKhast";
import { ResponseError } from "./error";

export default async function preAddSimKhast(
  data: PreAddSimKhastRequestProps,
  auth: string,
): Promise<PreAddSimKhastResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/specialSim/pre/add/addvertise`,
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
      errorResponse.message || "در اضافه کردن سیم خواست خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
