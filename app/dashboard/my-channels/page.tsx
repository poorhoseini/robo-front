import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Space from "@/components/general/Space";
import Image from "next/image";
import ChannelsResultSection from "@/components/dashboard/ChannelsResultSection";

export default async function MyChannelsPage() {
  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header />
      <main className="flex w-full max-w-7xl flex-col gap-6 pb-24 md:pb-0">
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>
          <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
            <HintBoxSection />
            <Space value={56} />
            <ChannelsResultSection />
            <Space value={36} />
          </div>
        </div>
      </main>
      <Footer selectedMenu="dashboard" />
    </div>
  );
}

function HintBoxSection() {
  return (
    <div className="relative flex w-full flex-col items-start rounded-lg bg-grey-100 px-6 py-10">
      <p className="text-xl font-medium leading-8 text-grey">
        ربات روبورند مدیریت کانال شما را بر عهده می‌گیرد و پیام‌های شما را به
        صورت هشتگ گذاری شده در کانال شما ارسال می‌کند.
      </p>
      <Space value={24} />
      <ul className="flex list-inside list-disc flex-col items-start gap-[22px] text-xl font-normal leading-4 text-grey marker:text-blue">
        <li>ارسال آگهی‌های ثبت شده در کانال شخصی شما</li>
        <li>ارسال پیام‌های تغییر قیمت</li>
        <li>ارسال پیام فروخته شد.</li>
        <li>ارسال پیام ثبت تخفیف.</li>
      </ul>
      <div className="absolute -bottom-6 -left-14">
        <Image src="/icons/robot2.png" alt="" width={157} height={270} />
      </div>
    </div>
  );
}
