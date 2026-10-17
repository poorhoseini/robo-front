"use client";

import {
  ExtractExcelRequestProps,
  ExtractExcelResponseProps,
} from "../entities/extractExcel";
import { ResponseError } from "./error";

export default async function extractExcel(
  data: ExtractExcelRequestProps,
  auth: string,
): Promise<ExtractExcelResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simcard/addWithFile`,
    {
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: data,
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در پردازش فایل اکسل خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
