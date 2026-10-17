"use client";

import {
  PreUpgradeSimRequestProps,
  PreUpgradeSimResponseProps,
} from "../entities/preUpgradeSim";
import { ResponseError } from "./error";

export default async function preUpgradeSim(
  data: PreUpgradeSimRequestProps,
  auth: string,
): Promise<PreUpgradeSimResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simcard/pre/upgradeVip`,
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
      errorResponse.message || "در اعمال تعیین سطح سیم کارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
