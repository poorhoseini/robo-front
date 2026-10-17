import { RequestFilter, RequestSort } from "../entities/api";
import { SearchSimPackResponseProps } from "../entities/simPack";

export default async function searchSimPacks(
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<SearchSimPackResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simPack/view/search`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({ limit, filters, sort, skip }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
