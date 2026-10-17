"use client";

import {
  GetMyChannelsRequestProps,
  GetMyChannelsResponseProps,
} from "../entities/channel";
import { ResponseError } from "./error";

export default async function getMyChannels(
  auth: string,
  data: GetMyChannelsRequestProps,
): Promise<GetMyChannelsResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/channels/my/get`,
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
      errorResponse.message || "خطا در دریافت لیست کانال ها",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
