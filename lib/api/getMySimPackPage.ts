import { GetSimPackPageResponseProps } from "../entities/simPack";
import { ResponseError } from "./error";

export default async function getMySimPackPage(
  auth: string,
  simPackId: string,
): Promise<GetSimPackPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simPack/view/my/getSimPackPage`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({ simPackId }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const errorResponse = await res.json();
    throw new ResponseError(
      errorResponse.message || "در دریافت اطلاعات سیم پک خطایی رخ داده است",
      errorResponse.data,
      errorResponse.reason,
    );
  }

  return res.json();
}
