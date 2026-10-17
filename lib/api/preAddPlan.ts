"use client";

import {
  PreAddPlanResponseProps,
  preAddPlanRequestProps,
} from "../entities/plan";
import { ResponseError } from "./error";

export default async function preAddPlan(
  auth: string,
  data: preAddPlanRequestProps,
): Promise<PreAddPlanResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/plan/pre/add`,
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
