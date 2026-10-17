"use client";

import { GetUserProfileResponseProps } from "../entities/userProfile";
import { ResponseError } from "./error";

export default async function getUserData(
  auth: string,
): Promise<GetUserProfileResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/sso/my/getData`,
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
      errorResponse.message || "در دریافت اطلاعات کاربر خطایی رخ داده است",
      errorResponse.data,

      errorResponse.reason,
    );
  }

  return res.json();
}
