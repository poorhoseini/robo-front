"use client";

import { ResponseProps } from "../entities/api";
import { PutUserProfileRequestProps } from "../entities/userProfile";
import { ResponseError } from "./error";

export default async function editUserProfile(
  data: PutUserProfileRequestProps,
  auth: string,
): Promise<ResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/sso/my/updatePersonalData`,
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
      errorResponse.message || "خطا در به روز رسانی اطلاعات کاربر",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
