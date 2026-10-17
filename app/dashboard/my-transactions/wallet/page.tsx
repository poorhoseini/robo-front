import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Header from "@/components/header/Header";
import { RequestFilter, RequestSort, SortType } from "@/lib/entities/api";
import Space from "@/components/general/Space";
import WalletBalanceSection from "@/components/dashboard/WalletBalanceSection";
import TransactionTabsSection from "@/components/dashboard/TransactionTabsSection";
import TransactionsResultSection from "@/components/dashboard/TransactionsResultSection";

export default async function MyWalletTransactionsPage({
  searchParams,
}: {
  searchParams?: {
    sortBy?: SortType;
    createDate?: string;
  };
}) {
  const tab = "wallet";
  const sortBy = searchParams?.sortBy || "newest";
  const createDate = searchParams?.createDate || "";

  const filters: RequestFilter[] = [];

  createDate &&
    filters.push({
      field: "createDate",
      oprand: "<",
      value: Number(createDate),
    });

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
            <WalletBalanceSection />
            <Space value={24} />
            <TransactionTabsSection selectedTab={tab} createDate={createDate} />
            <Space value={24} />
            <TransactionsResultSection
              filters={filters}
              sort={sort}
              selectedTab={tab}
            />
            <Space value={36} />
          </div>
        </div>
      </main>
    </div>
  );
}
