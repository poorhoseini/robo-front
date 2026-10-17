"use client";

import { RequestFilter, RequestSort } from "../entities/api";
import { GetPredictByExpertsResponseProps } from "../entities/predict";
import { ResponseError } from "./error";

export default async function getPredictByExperts(
  auth: string,
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<GetPredictByExpertsResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/expert/view/results`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({ limit, filters, sort, skip }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message ||
        "در دریافت اطلاعات کارشناسی قیمت ها خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
