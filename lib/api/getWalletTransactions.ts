"use client";

import { RequestFilter, RequestSort } from "../entities/api";
import { GetWalletTransactionsResponseProps } from "../entities/transaction";
import { ResponseError } from "./error";

export default async function getWalletTransactions(
  auth: string,
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<GetWalletTransactionsResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/wallet/view/transactions`,
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
      errorResponse.message || "خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
