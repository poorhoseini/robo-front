import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Header from "@/components/header/Header";
import { RequestFilter, RequestSort, SortType } from "@/lib/entities/api";
import Space from "@/components/general/Space";
import Link from "next/link";
import Image from "next/image";
import MyPlansResultSection from "@/components/dashboard/MyPlansResultSection";

export default async function MyPlansPage({
  searchParams,
}: {
  searchParams?: {
    sortBy?: SortType;
  };
}) {
  const sortBy = searchParams?.sortBy || "newest";

  const filters: RequestFilter[] = [];

  let sort: RequestSort = { field: "_id", order: -1 };
  // switch (sortBy) {
  //   case "newest":
  //     sort = { field: "_id", order: -1 };
  //     break;
  //   case "cheapest":
  //     sort = { field: "price", order: 1 };
  //     break;
  //   case "mostExpensive":
  //     sort = { field: "price", order: -1 };
  //     break;
  // }

  // let cardStackData: LandingPageCard = {
  //   cardType: "singleSim",
  //   title: "",
  //   data: [],
  // };

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header />
      <main className="flex w-full max-w-7xl flex-col gap-6">
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>
          <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
            <HintBoxSection />
            <Space value={40} />
            <MyPlansResultSection filters={filters} sort={sort} />
            <Space value={36} />
          </div>
        </div>
      </main>
    </div>
  );
}

function HintBoxSection() {
  return (
    <div className="flex w-full flex-col items-start rounded-lg border border-[#E8D0AB] bg-[#FAF5E8] px-9 py-7">
      <h2 className="text-xl font-semibold leading-7 text-grey">خرید بسته</h2>
      <Space value={4} />
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <p className="text-xl font-normal leading-7 text-grey">
          با بسته‌های متنوع روبورند در هزینه های خود صرفه جویی کنید.{" "}
        </p>
        <Link
          href="plans"
          className="flex flex-row items-center gap-4 rounded-md bg-grey px-8 py-3"
        >
          <span className="text-base font-medium leading-5 text-white">
            مشاهده و خرید بسته‌‌ها
          </span>
          <Image
            src="/icons/icon-arrow-left-white.svg"
            alt=""
            width={24}
            height={24}
          />
        </Link>
      </div>
    </div>
  );
}
