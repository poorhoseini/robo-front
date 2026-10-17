"use client";

import {
  PreVitrinStoreRequestProps,
  PreVitrinStoreResponseProps,
} from "../entities/preVitrinStore";
import { ResponseError } from "./error";

export default async function preVitrinStore(
  auth: string,
  data: PreVitrinStoreRequestProps,
): Promise<PreVitrinStoreResponseProps> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/vitrin/add`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
    method: "post",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در ویترین کردن فروشگاه خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
