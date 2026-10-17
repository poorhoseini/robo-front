"use client";

import { ResponseProps } from "../entities/api";
import { ChangeChannelActivationRequestProps } from "../entities/channel";
import { ResponseError } from "./error";

export default async function changeChannelActivation(
  auth: string,
  data: ChangeChannelActivationRequestProps,
): Promise<ResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/social/channels/switchState`,
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
      errorResponse.message || "در تغییر وضعیت کانال خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
