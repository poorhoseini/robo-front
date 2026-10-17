import {
  GetHighestBidPageResponseProps,
  HighestBidType,
} from "../entities/highestBid";

export default async function getHighestBidPage(
  highestBidType: HighestBidType,
  highestBidId: string,
): Promise<GetHighestBidPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/highBid/view/addvertisePage`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify({
        highBidType: highestBidType,
        highBidId: highestBidId,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
