"use client";

import { GetPlanSubscriptionsResponseProps } from "../entities/subscription";
import { ResponseError } from "./error";

export default async function getMyPlanSubscriptions(
  auth: string,
  planId: string,
): Promise<GetPlanSubscriptionsResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/subscription/view/byPlanId`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({
        planId: planId,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در دریافت اطلاعات بسته خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
