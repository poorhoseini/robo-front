import { GetSimPackPageResponseProps } from "../entities/simPack";

export default async function getSimPackPage(
  simPackId: string,
): Promise<GetSimPackPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simPack/view/getSimPackPage`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ simPackId }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
