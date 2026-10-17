import Image from "next/image";
import ResponsiveLink from "../general/ResponsiveLink";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import BidOnSimKhastForm from "../forms/BidOnSimKhastForm";
import { SimKhast } from "@/lib/entities/simKhast";

export default function OfferSimKhastCard({
  simKhastData,
}: {
  simKhastData: SimKhast;
}) {
  return (
    <div className="flex flex-col items-center justify-start gap-4 rounded-2xl bg-white md:w-[820px] md:gap-8 md:p-8">
      <div className="hidden w-full flex-row items-center gap-2 md:flex">
        <Image
          src="/icons/icon-shield.svg"
          alt="Your Bid"
          width={40}
          height={40}
        />
        <h3 className="text-base font-medium text-grey">پیشنهاد شما</h3>
      </div>
      <p className="text-sm font-medium text-grey-700">
        کاربر گرامی برای استفاده از این سرویس نیاز است برای حساب کاربری‌تان
        اشتراک خریداری کنید. برای دریافت اطلاعات بیشتر می‌توانید به صفحه توضیحات{" "}
        <ResponsiveLink
          href="/description/simkhast"
          className="text-blue"
          display="inline"
          mdDisplay="md:inline"
        >
          سیم خواست
        </ResponsiveLink>{" "}
        و{" "}
        <ResponsiveLink
          href="/description/highestBid"
          className="text-blue"
          display="inline"
          mdDisplay="md:inline"
        >
          بالاترین پیشنهاد
        </ResponsiveLink>{" "}
        مراجعه کنید.
      </p>
      <div className="flex h-[72px] w-full flex-row items-center justify-between gap-2 whitespace-nowrap rounded-2xl bg-biege px-3 py-3 text-sm font-medium text-grey md:h-[80px] md:px-6">
        <p>پیشنهاد باقی مانده</p>
        <div className="flex flex-row items-center justify-end gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white pt-1 text-xs md:text-sm">
              {persianNumber(simKhastData.offerLimit)}
            </div>
            <p className="text-xs font-light">کل پیشنهادات</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white pt-1 text-xs md:text-sm">
              {persianNumber(simKhastData.offerCount)}
            </div>
            <p className="text-xs font-light">پیشنهاد باقی مانده</p>
          </div>
        </div>
      </div>
      <BidOnSimKhastForm simCardId={simKhastData["_id"]} />
    </div>
  );
}
