import { GetSingleSimCardPageResponseProps } from "../entities/singleSimCard";
import { ResponseError } from "./error";

export default async function getSingleSimCardPage(
  simcardId: string,
): Promise<GetSingleSimCardPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simcard/view/getPage`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ simcardId }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در دریافت اطلاعات سیمکارت خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
