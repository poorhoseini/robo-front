import { GetLandingPageResponseProps } from "../entities/landingPage";

export default async function GetLandingPage(): Promise<GetLandingPageResponseProps> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/menuConfig/web`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "get",
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
