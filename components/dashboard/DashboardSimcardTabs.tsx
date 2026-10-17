"use client";

import { SearchType } from "@/lib/entities/api";
import { useRouter } from "next/navigation";

export default function DashboardSimcardTabs({
  searchType,
}: {
  searchType: SearchType;
}) {
  const router = useRouter();

  const handleChangeTab = (searchType: SearchType) => {
    router.push(
      searchType === "simcard"
        ? "my-simcards"
        : searchType === "simPack"
          ? "my-sim-packs"
          : searchType === "simKhast"
            ? "my-sim-khasts"
            : "/dashboard",
      { scroll: false },
    );
  };

  return (
    <div className="flex w-full flex-row items-center justify-around overflow-hidden border-grey-200 bg-neutral text-sm font-medium text-grey-500 md:rounded-lg md:border md:bg-white">
      <button
        type="button"
        className={`flex w-full items-center justify-center py-4 ${searchType === "simcard" ? "border-b-2 border-grey text-grey md:border-0 md:bg-grey-100" : ""}`}
        onClick={() => handleChangeTab("simcard")}
        disabled={searchType === "simcard"}
      >
        سیم کارت
      </button>
      <VerticalLine />
      <button
        type="button"
        className={`flex w-full items-center justify-center py-4 ${searchType === "simPack" ? "border-b-2 border-grey text-grey md:border-0 md:bg-grey-100" : ""}`}
        onClick={() => handleChangeTab("simPack")}
        disabled={searchType === "simPack"}
      >
        سیم پک
      </button>
      <VerticalLine />
      <button
        type="button"
        className={`flex w-full items-center justify-center py-4 ${searchType === "simKhast" ? "border-b-2 border-grey text-grey md:border-0 md:bg-grey-100" : ""}`}
        onClick={() => handleChangeTab("simKhast")}
        disabled={searchType === "simKhast"}
      >
        سیم خواست
      </button>
    </div>
  );
}

function VerticalLine() {
  return <div className="hidden h-8 w-[1px] bg-grey-100 md:block" />;
}
