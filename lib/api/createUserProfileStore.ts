"use client";

import { ResponseProps } from "../entities/api";
import { PostUserProfileStoreRequestProps } from "../entities/store";
import { ResponseError } from "./error";

export default async function createUserProfileStore(
  data: PostUserProfileStoreRequestProps,
  auth: string,
): Promise<ResponseProps> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/store/add`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${auth}`,
    },
    method: "post",
    body: JSON.stringify(data),
    cache: "no-store",
  });

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در ساخت فروشگاه خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
