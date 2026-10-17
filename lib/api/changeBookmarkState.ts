"use client";

import {
  ChangeBookmarkStateRequestProps,
  ChangeBookmarkStateResponseProps,
} from "../entities/bookmark";
import { ResponseError } from "./error";

export default async function changeBookmarkState(
  data: ChangeBookmarkStateRequestProps,
  auth: string,
): Promise<ChangeBookmarkStateResponseProps> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/bookmark/add`, {
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
      errorResponse.message || "خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
