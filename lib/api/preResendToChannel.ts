"use client";

import {
  PreResendToChannelRequestProps,
  PreResendToChannelResponseProps,
} from "../entities/preResendToChannel";
import { ResponseError } from "./error";

export default async function preResendToChannel(
  auth: string,
  data: PreResendToChannelRequestProps,
): Promise<PreResendToChannelResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/pre/reSend/byId/`,
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
      errorResponse.message || "در ارسال مجدد پیام به کانال خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
