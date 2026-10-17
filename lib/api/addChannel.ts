"use client";

import { ResponseProps } from "../entities/api";
import { PostChannelRequestProps } from "../entities/channel";
import { ResponseError } from "./error";

export default async function addChannel(
  auth: string,
  data: PostChannelRequestProps,
): Promise<ResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/channel/addChannel`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      body: JSON.stringify(data),
      method: "post",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطا در افزودن کانال",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
