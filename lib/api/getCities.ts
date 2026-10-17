import {
  GetCitiesRequestProps,
  GetCitiesResponseProps,
} from "../entities/city";

export default async function getCities(
  data: GetCitiesRequestProps,
): Promise<GetCitiesResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/cities/view/get`,
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
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
