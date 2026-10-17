import { GetAdvertiserPageResponseProps } from "../entities/advertiser";
import { ResponseError } from "./error";

export default async function getAdvertiserPage(
  storeId: string,
): Promise<GetAdvertiserPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/store/view/getStorePage`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ storeId }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "خطایی رخ داده است",
      errorResponse.data,
    );
  }

  return res.json();
}
