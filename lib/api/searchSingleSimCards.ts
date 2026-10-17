import { RequestFilter, RequestSort } from "../entities/api";
import { SearchSingleSimCardResponseProps } from "../entities/singleSimCard";

export default async function searchSingleSimCards(
  limit: number,
  filters: RequestFilter[],
  sort: RequestSort,
  skip?: number,
): Promise<SearchSingleSimCardResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/simcard/view/search`,
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
