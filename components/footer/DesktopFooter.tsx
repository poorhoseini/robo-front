import Image from "next/image";

export default function DesktopFooter() {
  return (
    <div className="flex w-full max-w-7xl flex-row items-start justify-between">
      <div className="items-right flex w-80 flex-col gap-4">
        <h3 className="text-2xl font-extrabold">روبورند</h3>
        <p>
          ارائه انواع سیم کارت‌ها و اطلاعات و جزئیات مربوط به انواع مختلف سیم
          کارت‌‌ها
        </p>
        <p className="mt-12">روبورند در شبکه‌های اجتماعی</p>
        <div className="flex flex-row items-center gap-4">
          <Image
            src="/icons/icon-instagram.svg"
            alt="Instagram"
            width={32}
            height={32}
          />
          <Image
            src="/icons/icon-telegram.svg"
            alt="Telegram"
            width={32}
            height={32}
          />
        </div>
      </div>
      <div className="items-right flex flex-col gap-4">
        <h3 className="text-xl font-bold">روبورند</h3>
        <p>وبلاگ</p>
        <p>آموزش سرویس‌ها</p>
        <p>فروشگاه‌ها</p>
        <p>تماس با ما</p>
        <p>درباره ما</p>
      </div>
      <div className="items-right flex flex-col gap-4">
        <h3 className="text-xl font-bold">خدمات ما</h3>
        <p>سیم کارت سفارشی</p>
        <p>تخمین قیمت سیم کارت</p>
        <p>آنالیز سیم کارت</p>
        <p>پیشنهاد ویژه</p>
        <p>سیم کارت‌های تخفیف‌دار</p>
      </div>
      <div className="items-right flex flex-col gap-4">
        <Image
          className="rounded-2xl"
          src="/icons/enamad.png"
          alt="Enamad"
          width={250}
          height={250}
        />
      </div>
    </div>
  );
}
