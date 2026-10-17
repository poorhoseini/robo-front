import { GetRoundTypesResponseProps } from "../entities/roundType";

export default async function getRoundTypes(): Promise<GetRoundTypesResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/perdict/rondLevels/view/list`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rondId: "all" }),
      method: "post",
      cache: "force-cache",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
