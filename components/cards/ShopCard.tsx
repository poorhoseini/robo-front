import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import ResponsiveLink from "../general/ResponsiveLink";

export type ShopCardProps = {
  shopId: string;
  shopName: string;
  viewsCount: number;
  phoneNumbers: string[];
};

export default function ShopCard({
  shopId,
  shopName,
  viewsCount,
  phoneNumbers,
}: ShopCardProps) {
  return (
    <ResponsiveLink
      href={`/search?shopId=${shopId}`}
      className="flex h-[160px] w-[300px] flex-col items-center justify-between gap-2 rounded-xl border border-grey-200 bg-white px-4 py-5"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-1">
          <Image src="/icons/icon-shop.svg" alt="Shop" width={24} height={24} />
          <p className="text-sm font-medium text-grey">{shopName}</p>
        </div>
        <div className="flex h-[20px] min-w-[67px] flex-row items-center justify-center gap-2 rounded-md bg-biege p-2">
          <Image
            src="/icons/icon-eye-brown.svg"
            alt="Shop"
            width={16}
            height={16}
          />
          <p className="mt-1 text-xs font-normal text-brown">
            {persianNumber(viewsCount)}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm font-normal text-grey">شماره تماس</p>
        <div className="flex flex-col items-start justify-start">
          <p className="w-full text-left text-sm font-medium text-grey">
            {persianNumber(phoneNumbers[0])}
          </p>
        </div>
      </div>
      <div className="flex h-[32px] w-full flex-row items-center justify-end gap-2">
        <div className="itemx-center flex flex-row text-sm font-medium text-grey">
          <p>مشاهده فروشگاه</p>
        </div>
        <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] bg-blue-900">
          <Image
            src="/icons/icon-arrow-left.svg"
            alt="Enter"
            width={16}
            height={16}
          />
        </div>
      </div>
    </ResponsiveLink>
  );
}
