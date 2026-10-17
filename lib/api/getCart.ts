"use client";

import { GetCartPageResponseProps } from "../entities/cart";
import { ResponseError } from "./error";

export default async function getCart(
  cartId: string,
  auth: string,
): Promise<GetCartPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cart/view/cartData`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({
        cartId: cartId,
      }),
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
