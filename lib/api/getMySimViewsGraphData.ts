"use client";

import {
  SimViewsGraphDataRequestProps,
  SimViewsGraphDataResponseProps,
} from "../entities/simViewsGraphData";
import { ResponseError } from "./error";

export default async function getMySimViewsGraphData(
  auth: string,
  data: SimViewsGraphDataRequestProps,
): Promise<SimViewsGraphDataResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/view/chart/byRefrence`,
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
      errorResponse.message ||
        "در دریافت گزارشات تعداد مشاهده سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
