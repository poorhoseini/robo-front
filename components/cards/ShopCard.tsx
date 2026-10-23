import {
  formatPhoneNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
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
      className="flex h-auto min-h-[144px] w-[295px] shrink-0 select-none flex-col items-center justify-between gap-3 rounded-2xl border border-grey-200 bg-white p-4 shadow-sm transition-all hover:shadow-md md:w-[302px]"
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FDF6E8]">
            <Image src="/icons/icon-shop.svg" alt="Shop" width={16} height={16} />
          </div>
          <p className="text-xs md:text-sm font-bold text-grey">{shopName}</p>
        </div>
        <div className="flex h-5 items-center justify-center gap-1 rounded-md bg-[#FDF6E8] px-2 py-0.5">
          <Image
            src="/icons/icon-eye-brown.svg"
            alt="Views"
            width={12}
            height={12}
          />
          <span className="text-[11px] font-medium text-[#6B592F]">
            {persianNumber(viewsCount || 3243)}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between text-xs font-normal text-grey">
        <p className="text-grey-500">شماره تماس</p>
        <p className="font-bold text-grey ltr">
          {formatPhoneNumber(phoneNumbers?.[0] || "۰۲۱-۲۲۳۳۴۴۵۵")}
        </p>
      </div>
      <div className="flex w-full flex-row items-center justify-between pt-1">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#EAF5FF] transition-colors hover:bg-blue-100">
          <Image
            src="/icons/icon-arrow-left.svg"
            alt="Enter"
            width={14}
            height={14}
          />
        </div>
        <p className="text-xs font-medium text-grey">مشاهده فروشگاه</p>
      </div>
    </ResponsiveLink>
  );
}
