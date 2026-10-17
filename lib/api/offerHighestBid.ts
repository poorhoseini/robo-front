"use client";

import {
  OfferHighestBidRequestProps,
  OfferHighestBidResponseProps,
} from "../entities/highestBid";
import { ResponseError } from "./error";

export default async function offerHighestBid(
  data: OfferHighestBidRequestProps,
  auth: string,
): Promise<OfferHighestBidResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/highBid/pre/add/offer`,
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
      errorResponse.message || "خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
