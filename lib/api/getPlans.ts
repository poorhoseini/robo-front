"use client";

import { RequestFilter, RequestSort } from "../entities/api";
import { GetAvailablePlansResponseProps } from "../entities/plan";
import { ResponseError } from "./error";

export default async function getOfferedPlans(
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<GetAvailablePlansResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/plan/view/getAll`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ limit, filters, sort, skip }),
      cache: "no-store",
    },
  );

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
