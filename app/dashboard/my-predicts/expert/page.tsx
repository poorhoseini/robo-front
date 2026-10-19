import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { RequestFilter, RequestSort, SortType } from "@/lib/entities/api";
import Space from "@/components/general/Space";
import PredictTabsSection from "@/components/dashboard/PredictTabsSection";
import PredictByExpertsResultSection from "@/components/dashboard/PredictByExpertsResultSection";

export default async function MyPredictByExpertsPage({
  searchParams,
}: {
  searchParams?: {
    sortBy?: SortType;
    createDate?: string;
    id?: string;
  };
}) {
  const tab = "expert";
  const sortBy = searchParams?.sortBy || "newest";
  const createDate = searchParams?.createDate || "";
  const selectedPredictByExpertId = searchParams?.id || "";

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
      <Header selectedMenu="my-predicts" />
      <main className="flex w-full max-w-7xl flex-col gap-6 pb-24 md:pb-0">
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>
          <div className="relative flex w-full flex-col items-end justify-start md:w-[938px]">
            <PredictTabsSection selectedTab={tab} createDate={createDate} />
            <div className="flex w-full flex-col items-center justify-start md:hidden">
              <Space value={24} />
              <PredictByExpertsResultSection
                filters={filters}
                sort={sort}
                initialPredictId={selectedPredictByExpertId}
                direction="vertical"
              />
              <Space value={36} />
            </div>
            <div className="hidden w-full flex-col items-end justify-start md:flex">
              <Space value={24} />
              <PredictByExpertsResultSection
                filters={filters}
                sort={sort}
                initialPredictId={selectedPredictByExpertId}
              />
              <Space value={36} />
            </div>
          </div>
        </div>
      </main>
      <Footer selectedMenu="dashboard" />
    </div>
  );
}
