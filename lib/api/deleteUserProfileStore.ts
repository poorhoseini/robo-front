"use client";

import { ResponseProps } from "../entities/api";
import { DeactiveUserProfileStoreRequestProps } from "../entities/store";
import { ResponseError } from "./error";

export default async function deleteUserProfileStore(
  data: DeactiveUserProfileStoreRequestProps,
  auth: string,
): Promise<ResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/diactive`,
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
      errorResponse.message || "در حذف فروشگاه خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
