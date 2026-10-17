"use client";

import {
  PreSendToChannelRequestProps,
  PreSendToChannelResponseProps,
} from "../entities/preSendToChannel";
import { ResponseError } from "./error";

export default async function preSendToChannel(
  data: PreSendToChannelRequestProps,
  auth: string,
): Promise<PreSendToChannelResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/pre/send/byId/`,
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
      errorResponse.message || "در ارسال پیام به کانال خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
