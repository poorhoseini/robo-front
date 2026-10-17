"use client";

import {
  ChangeSimActivationRequestProps,
  ChangeSimActivationResponseProps,
} from "../entities/changeSimActivation";
import { ResponseError } from "./error";

export default async function changeSimActivation(
  auth: string,
  data: ChangeSimActivationRequestProps,
): Promise<ChangeSimActivationResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/edit/changeState`,
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
      errorResponse.message || "در تغییر وضعیت سیمکارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
