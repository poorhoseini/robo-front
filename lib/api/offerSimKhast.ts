"use client";

import {
  OfferSimKhastRequestProps,
  OfferSimKhastResponseProps,
} from "../entities/simKhast";
import { ResponseError } from "./error";

export default async function offerSimKhast(
  data: OfferSimKhastRequestProps,
  auth: string,
): Promise<OfferSimKhastResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/specialSim/pre/add/offer`,
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
      errorResponse.message || "خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
