import { GetSimKhastPageResponseProps } from "../entities/simKhast";

export default async function getSimKhastPage(
  specialSimId: string,
): Promise<GetSimKhastPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/specialSim/view/getPage`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ specialSimId }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
