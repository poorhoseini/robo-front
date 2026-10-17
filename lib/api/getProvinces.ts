import { GetProvincesResponseProps } from "../entities/province";

export default async function getProvinces(): Promise<GetProvincesResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/provinces/view/get`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
