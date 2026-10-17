"use client";

import { RequestFilter, RequestSort } from "../entities/api";
import { GetMyOffersResponseProps } from "../entities/myOffer";
import { ResponseError } from "./error";

export default async function getOffers(
  auth: string,
  mode: string,
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<GetMyOffersResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/highBid/view/offers`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({ limit, filters, sort, skip, mode }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در دریافت اطلاعات پیشنهادها خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
