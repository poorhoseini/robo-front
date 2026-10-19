import DashboardResultSection from "@/components/dashboard/DashboardResultSection";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { LandingPageCard } from "@/lib/entities/landingPage";
import { RequestFilter, RequestSort } from "@/lib/entities/api";

export default async function StoresPage() {
  const filters: RequestFilter[] = [];
  let sort: RequestSort = { field: "_id", order: -1 };

  let cardStackData: LandingPageCard = {
    cardType: "store",
    title: "",
    data: [],
  };

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header />
      <main className="flex w-full max-w-7xl flex-col gap-6 pb-24 md:pb-0">
        <div className="relative flex w-full flex-col items-center justify-start px-4 md:hidden">
          <DashboardResultSection
            serverResult={cardStackData}
            filters={filters}
            sort={sort}
            searchType="store"
            serverTime={Date.now()}
            direction="vertical"
          />
        </div>
        <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
          <DashboardResultSection
            serverResult={cardStackData}
            filters={filters}
            sort={sort}
            searchType="store"
            serverTime={Date.now()}
          />
        </div>
      </main>
      <Footer selectedMenu="services" />
    </div>
  );
}
