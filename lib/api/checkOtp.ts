"use client";

import { CheckOtpRequestProps, CheckOtpResponseProps } from "../entities/auth";
import { ResponseError } from "./error";

export default async function checkOtp(
  data: CheckOtpRequestProps,
): Promise<CheckOtpResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/otp/checkOtpCode`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(data),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطایی رخ داده است",
      errorResponse.data,
    );
  }

  return res.json();
}
