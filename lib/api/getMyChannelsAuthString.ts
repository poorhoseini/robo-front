"use client";

import { GetMyAuthStringResponseProps } from "../entities/channel";
import { ResponseError } from "./error";

export default async function getMyChannelsAuthString(
  auth: string,
): Promise<GetMyAuthStringResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/channels/authString/get`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "get",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطا در دریافت کلمه رمز",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
