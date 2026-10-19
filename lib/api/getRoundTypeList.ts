import { GetRoundTypesResponseProps } from "../entities/roundType";

export default async function getRoundTypes(): Promise<GetRoundTypesResponseProps> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/perdict/rondLevels/view/list`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rondId: "all" }),
        method: "post",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return { status: res.status, data: {} } as any;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch round types:", error);
    return { status: 500, data: {} } as any;
  }
}
