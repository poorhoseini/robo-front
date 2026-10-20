"use client";

import { dashboardMenuItems } from "@/lib/constants/menuItems";
import Space from "../general/Space";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function DashboardMenu() {
  const pathname = usePathname();

  const selectedMenu = dashboardMenuItems.find(
    (item) => item.href === pathname,
  );

  return (
    <div className="ltr top-20 w-full rounded-lg border-grey-100 bg-white px-4 pt-6 md:sticky md:max-h-[80vh] md:w-[270px] md:overflow-y-auto md:border">
      <div className="rtl flex h-full w-full flex-col items-center justify-start">
        <h1 className="text-2xl font-bold leading-9 text-grey">روبورند</h1>
        <Space value={16} />
        <HorizontalLine />
        <Space value={16} />
        {dashboardMenuItems.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex h-14 w-[230px] flex-row items-center justify-start gap-3 rounded-lg px-6 py-4 transition-colors ${selectedMenu?.id === item.id ? "bg-grey text-white" : "text-grey hover:bg-grey-100"}`}
          >
            <div className="relative h-6 w-6 min-w-6">
              <Image
                src={
                  selectedMenu?.id === item.id && item.activeImageSrc
                    ? item.activeImageSrc
                    : item.imageSrc
                }
                alt=""
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <p className="text-nowrap text-sm font-medium leading-5">
              {item.label}
            </p>
          </Link>
        ))}
        <Space value={16} />
        <HorizontalLine />
        <Space value={16} />
        {dashboardMenuItems.slice(6).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex h-14 w-[230px] flex-row items-center justify-start gap-3 rounded-lg px-6 py-4 transition-colors ${selectedMenu?.id === item.id ? "bg-grey text-white" : "text-grey hover:bg-grey-100"}`}
          >
            <div className="relative h-6 w-6 min-w-6">
              <Image
                src={
                  selectedMenu?.id === item.id && item.activeImageSrc
                    ? item.activeImageSrc
                    : item.imageSrc
                }
                alt=""
                fill
                sizes="24px"
                className="object-contain"
              />
            </div>
            <p className="text-nowrap text-sm font-medium leading-5">
              {item.label}
            </p>
          </Link>
        ))}
        <Space value={148} />
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}
