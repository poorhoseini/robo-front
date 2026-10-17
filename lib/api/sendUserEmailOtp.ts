"use client";

import { ResponseProps } from "../entities/api";
import { SendUserEmailOTPRequestProps } from "../entities/userProfile";
import { ResponseError } from "./error";

export default async function sendUserEmailOtp(
  data: SendUserEmailOTPRequestProps,
  auth: string,
): Promise<ResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/sso/email/set/verify/send`,
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
      errorResponse.message || "در تغییر ایمیل کاربر خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
