import { GetProvincesResponseProps } from "../entities/province";

export default async function getProvinces(): Promise<GetProvincesResponseProps> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/provinces/view/get`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "get",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return { status: res.status, data: { provinces: [] } } as any;
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch provinces:", error);
    return { status: 500, data: { provinces: [] } } as any;
  }
}
