import { ResponseError } from "./error";
import {
  GetSimCardRoundTypesRequestProps,
  GetSimCardRoundTypesResponseProps,
} from "../entities/round";

export default async function getSimCardRoundTypes(
  data: GetSimCardRoundTypesRequestProps,
): Promise<GetSimCardRoundTypesResponseProps> {
  if (data.phoneNumber.includes("undefined"))
    throw new ResponseError("شماره موبایل صحیح نمی باشد!", {});

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/perdict/simcard/analayse`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(data),
      cache: "force-cache",
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
