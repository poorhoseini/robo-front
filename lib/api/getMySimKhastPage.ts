import { GetSimKhastPageResponseProps } from "../entities/simKhast";
import { ResponseError } from "./error";

export default async function getMySimKhastPage(
  auth: string,
  specialSimId: string,
): Promise<GetSimKhastPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/specialSim/view/my/getPage`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      },
      method: "post",
      body: JSON.stringify({ specialSimId }),
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
