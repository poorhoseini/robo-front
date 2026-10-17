"use client";

import {
  GetMyChannelMessagesRequestProps,
  GetMyChannelMessagesResponseProps,
} from "../entities/channelMessage";
import { ResponseError } from "./error";

export default async function getMyChannelMessages(
  auth: string,
  data: GetMyChannelMessagesRequestProps,
): Promise<GetMyChannelMessagesResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/messages/my/get`,
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
      errorResponse.message || "خطا در دریافت لیست پیام های کانال",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
