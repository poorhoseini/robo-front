"use client";

import { RequestFilter, RequestSort } from "../entities/api";
import { SearchStoresResponseProps } from "../entities/store";
import { ResponseError } from "./error";

export default async function getUserStores(
  auth: string,
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<SearchStoresResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/view/myStore`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({
        limit: 15,
        filters: [{ field: "isActive", oprand: "=", value: true }],
      }),
      // body: JSON.stringify({ limit, filters, sort, skip }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در دریافت اطلاعات فروشگاه خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
