import DashboardSearchActionBar from "@/components/dashboard/DashboardSearchActionBar";
import DashboardMenu from "@/components/dashboard/DashboardMenu";
import DashboardResultSection from "@/components/dashboard/DashboardResultSection";
import Header from "@/components/header/Header";
import { LandingPageCard } from "@/lib/entities/landingPage";
import {
  RequestFilter,
  RequestSort,
  SearchType,
  SortType,
  ViewType,
} from "@/lib/entities/api";
import DashboardHintBox from "@/components/dashboard/DashboardHintBox";
import Space from "@/components/general/Space";
import { GetProvincesResponseProps } from "@/lib/entities/province";
import getProvinces from "@/lib/api/getProvinces";
import { GetRoundTypesResponseProps } from "@/lib/entities/roundType";
import getRoundTypes from "@/lib/api/getRoundTypeList";
import DashboardSimcardTabs from "@/components/dashboard/DashboardSimcardTabs";
import SortAndFilterSelector from "@/components/forms/search/SortAndFilterSelector";

export default async function MySimKhastsPage({
  searchParams,
}: {
  searchParams?: {
    shopId?: string;
    sortBy?: SortType;
    viewType?: ViewType;
    searchType: SearchType;
    preNumber?: string;
    code?: string;
    digit1?: string;
    digit2?: string;
    digit3?: string;
    digit4?: string;
    digit5?: string;
    digit6?: string;
    minPrice?: string;
    maxPrice?: string;
    roundTypes?: string;
    provinces?: string;
    operator?: string;
    type?: string;
    state?: string;
    hasDiscount?: string;
    isHighestBid?: string;
    hasPrice?: string;
    advertiserType?: string;
    simPackCounts?: string;
    simPackType?: string;
  };
}) {
  const shopId = searchParams?.shopId || "";
  const sortBy = searchParams?.sortBy || "newest";
  const viewType = searchParams?.viewType || "card";
  const searchType = searchParams?.searchType || "simKhast";
  const preNumber = searchParams?.preNumber || "";
  const code = searchParams?.code || "";
  const digit1 = searchParams?.digit1 || "";
  const digit2 = searchParams?.digit2 || "";
  const digit3 = searchParams?.digit3 || "";
  const digit4 = searchParams?.digit4 || "";
  const digit5 = searchParams?.digit5 || "";
  const digit6 = searchParams?.digit6 || "";
  const minPrice = searchParams?.minPrice || "";
  const maxPrice = searchParams?.maxPrice || "";
  const roundTypes = searchParams?.roundTypes || "";
  const provinces = searchParams?.provinces || "";
  const operator = searchParams?.operator || "";
  const simCardType = searchParams?.type || "";
  const simCardState = searchParams?.state || "";
  const hasDiscount = searchParams?.hasDiscount || "";
  const isHighestBid = searchParams?.isHighestBid || "";
  const hasPrice = searchParams?.hasPrice || "";
  const advertiserType = searchParams?.advertiserType || "";
  const simPackCounts = searchParams?.simPackCounts || "";
  const simPackType = searchParams?.simPackType || "";

  const getProvincesResponse: GetProvincesResponseProps = await getProvinces();
  const provincesList = getProvincesResponse.data.provinces;
  const getRoundTypesResponse: GetRoundTypesResponseProps =
    await getRoundTypes();
  const roundTypesList = Object.values(getRoundTypesResponse.data);

  const filters: RequestFilter[] = [];
  shopId &&
    searchType !== "simKhast" &&
    filters.push({
      field: "storeId",
      oprand: "=",
      value: shopId,
    });
  preNumber &&
    !preNumber.includes("all") &&
    searchType !== "simPack" &&
    filters.push({
      field: "preNumber",
      oprand: "or",
      value: [preNumber],
    });
  code &&
    !code.includes("all") &&
    searchType !== "simPack" &&
    filters.push({ field: "code", oprand: "or", value: [Number(code)] });
  digit1 &&
    searchType !== "simPack" &&
    filters.push({ field: "digit5", oprand: "=", value: Number(digit1) });
  digit2 &&
    searchType !== "simPack" &&
    filters.push({ field: "digit6", oprand: "=", value: Number(digit2) });
  digit3 &&
    searchType !== "simPack" &&
    filters.push({ field: "digit7", oprand: "=", value: Number(digit3) });
  digit4 &&
    searchType !== "simPack" &&
    filters.push({ field: "digit8", oprand: "=", value: Number(digit4) });
  digit5 &&
    searchType !== "simPack" &&
    filters.push({ field: "digit9", oprand: "=", value: Number(digit5) });
  digit6 &&
    searchType !== "simPack" &&
    filters.push({ field: "digit10", oprand: "=", value: Number(digit6) });
  minPrice &&
    filters.push({ field: "price", oprand: ">", value: Number(minPrice) });
  maxPrice &&
    filters.push({ field: "price", oprand: "<", value: Number(maxPrice) });
  roundTypes &&
    !roundTypes.includes("all") &&
    searchType === "simcard" &&
    filters.push({
      field: "rondLevels",
      oprand: "or",
      value: roundTypes
        .split(",")
        .map(
          (item) =>
            roundTypesList.find((roundType) => roundType.id === Number(item))
              ?.rondLevel || "",
        ),
    });
  provinces &&
    !provinces.includes("all") &&
    filters.push({
      field: "provinceId",
      oprand: "or",
      value: provinces.split(",").map((item) => Number(item)),
    });
  operator &&
    !operator.includes("all") &&
    searchType !== "simPack" &&
    filters.push({
      field: "operator",
      oprand: "or",
      value: operator.split(","),
    });
  simCardType &&
    !simCardType.includes("all") &&
    searchType !== "simPack" &&
    filters.push({
      field: "type",
      oprand: "or",
      value: simCardType.split(",").map((item) => Number(item)),
    });
  simPackType &&
    !simPackType.includes("all") &&
    searchType === "simPack" &&
    filters.push({
      field: "simPackType",
      oprand: "or",
      value: simPackType.split(","),
    });
  simCardState &&
    !simCardState.includes("all") &&
    searchType !== "simPack" &&
    filters.push({
      field: "state",
      oprand: "or",
      value: simCardState.split(",").map((item) => Number(item)),
    });
  hasDiscount &&
    searchType !== "simKhast" &&
    filters.push({ field: "priceType", oprand: "or", value: [3] });
  isHighestBid &&
    searchType !== "simKhast" &&
    filters.push({ field: "priceType", oprand: "or", value: [2] });
  hasPrice &&
    searchType !== "simKhast" &&
    filters.push({ field: "hasPrice", oprand: "=", value: 1 });
  advertiserType &&
    !advertiserType.includes("all") &&
    searchType !== "simKhast" &&
    filters.push({
      field: "storeType",
      oprand: "or",
      value: advertiserType.split(","),
    });

  let sort: RequestSort = { field: "_id", order: -1 };
  switch (sortBy) {
    case "newest":
      sort = { field: "_id", order: -1 };
      break;
    case "cheapest":
      sort = { field: "price", order: 1 };
      break;
    case "mostExpensive":
      sort = { field: "price", order: -1 };
      break;
  }

  let cardStackData: LandingPageCard = {
    cardType: "simKhast",
    title: "",
    data: [],
  };

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header selectedMenu="my-simkhasts" />
      <main className="flex w-full max-w-7xl flex-col gap-6">
        <div className="flex w-full px-4 md:hidden">
          <DashboardSimcardTabs searchType="simKhast" />
        </div>
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>
          <div className="relative flex w-full flex-col items-end justify-start md:hidden">
            <SortAndFilterSelector
              filtersCount={filters.length}
              sortBy={sortBy}
              searchType={searchType}
              preNumber={preNumber}
              code={code}
              digit1={digit1}
              digit2={digit2}
              digit3={digit3}
              digit4={digit4}
              digit5={digit5}
              digit6={digit6}
              minPrice={minPrice}
              maxPrice={maxPrice}
              roundTypesList={roundTypesList}
              roundTypes={roundTypes}
              provincesList={provincesList}
              provinces={provinces}
              operator={operator}
              simCardType={simCardType}
              simCardState={simCardState}
              hasDiscount={hasDiscount}
              isHighestBid={isHighestBid}
              hasPrice={hasPrice}
              advertiserType={advertiserType}
              simPackCounts={simPackCounts}
              simPackType={simPackType}
            />
            <DashboardResultSection
              serverResult={cardStackData}
              filters={filters}
              sort={sort}
              searchType={searchType}
              serverTime={Date.now()}
              direction="vertical"
            />
          </div>
          <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
            <DashboardHintBox />
            <Space value={24} />
            <DashboardSearchActionBar
              serviceType="specialSim"
              filtersCount={filters.length}
              sortBy={sortBy}
              searchType={searchType}
              preNumber={preNumber}
              code={code}
              digit1={digit1}
              digit2={digit2}
              digit3={digit3}
              digit4={digit4}
              digit5={digit5}
              digit6={digit6}
              minPrice={minPrice}
              maxPrice={maxPrice}
              roundTypesList={roundTypesList}
              roundTypes={roundTypes}
              provincesList={provincesList}
              provinces={provinces}
              operator={operator}
              simCardType={simCardType}
              simCardState={simCardState}
              hasDiscount={hasDiscount}
              isHighestBid={isHighestBid}
              hasPrice={hasPrice}
              advertiserType={advertiserType}
              simPackCounts={simPackCounts}
              simPackType={simPackType}
            />
            <DashboardResultSection
              serverResult={cardStackData}
              filters={filters}
              sort={sort}
              searchType={searchType}
              serverTime={Date.now()}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
