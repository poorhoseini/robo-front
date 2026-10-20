import AdRegistrationDialog from "@/components/cards/AdRegistrationDialog";
import FilterNumber from "@/components/cards/FilterNumber";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import CardStack from "@/components/layout/CardStack";
import LatestSimCardsSection from "@/components/sections/LatestSimCardsSection";
import ServicesIntroductionSection from "@/components/sections/ServicesIntroductionSection";
import GetLandingPage from "@/lib/api/getLandingPage";
import {
  GetLandingPageResponseProps,
  LandingPageCard,
} from "@/lib/entities/landingPage";
import Image from "next/image";
import ResponsiveLink from "@/components/general/ResponsiveLink";
import PriceAndRoundAnalysisDialog from "@/components/cards/PriceAndRoundAnalysisDialog";
import { GetRoundTypesResponseProps } from "@/lib/entities/roundType";
import getRoundTypes from "@/lib/api/getRoundTypeList";
import getProvinces from "@/lib/api/getProvinces";
import { GetProvincesResponseProps } from "@/lib/entities/province";

export default async function Home() {
  let landingPageData: GetLandingPageResponseProps["data"] = {
    cardDatas: {},
    pwaList: [],
    webList: [],
  };
  let roundTypesList: any[] = [];
  let provincesList: any[] = [];

  try {
    const [landingPageRes, roundTypesRes, provincesRes] =
      await Promise.allSettled([
        GetLandingPage(),
        getRoundTypes(),
        getProvinces(),
      ]);

    if (landingPageRes.status === "fulfilled" && landingPageRes.value?.data) {
      landingPageData = landingPageRes.value.data;
    }
    if (roundTypesRes.status === "fulfilled" && roundTypesRes.value?.data) {
      roundTypesList = Object.values(roundTypesRes.value.data || {});
    }
    if (
      provincesRes.status === "fulfilled" &&
      provincesRes.value?.data?.provinces
    ) {
      provincesList = provincesRes.value.data.provinces;
    }
  } catch (error) {
    console.error("Error loading home page data:", error);
  }

  function renderItemByCardType(
    item: LandingPageCard,
    key: number,
    width: "mobile" | "desktop",
    isSubItem?: boolean,
  ) {
    switch (item.cardType) {
      case "singleSim":
      case "store":
      case "highBidSimcard":
      case "simKhast":
      case "offPrice":
      case "simPack":
      case "highBidSimPack":
        return (
          !!item.data &&
          !!item.data.length && (
            <CardStack
              key={key}
              stackData={item}
              gap={isSubItem ? 3 : 6}
              link={item.path}
            />
          )
        );
      case "singleSim-table":
        return width === "desktop" ? (
          <LatestSimCardsSection key={key} />
        ) : (
          <CardStack
            key={key}
            stackData={item}
            gap={isSubItem ? 3 : 6}
            link={item.path}
            direction="vertical"
          />
        );
      case "button":
        return (
          <ResponsiveLink
            key={key}
            href={item.path || ""}
            className="flex h-[93px] flex-1 flex-col items-center justify-center gap-2 rounded-2xl border border-grey-200 bg-white p-2.5 shadow-sm transition-all hover:shadow-md md:h-[100px] md:w-[120px]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-grey text-white">
              <Image
                src="/icons/icon-plus-white.svg"
                alt="Plus"
                width={14}
                height={14}
              />
            </div>
            <p className="text-center text-xs font-medium text-grey leading-4">
              {item.title}
            </p>
          </ResponsiveLink>
        );
      case "search":
        return (
          <section
            key={key}
            className="flex flex-row items-center justify-between"
          >
            <FilterNumber
              roundTypesList={roundTypesList}
              provincesList={provincesList}
            />
            <div className="flex h-[468px] flex-col items-center justify-between">
              <AdRegistrationDialog type="card" />
              <PriceAndRoundAnalysisDialog type="card" />
            </div>
          </section>
        );
      case "videoCard":
        return <ServicesIntroductionSection key={key} />;
      case "group":
        return (
          <div
            key={key}
            className={`flex w-full flex-col items-center justify-between gap-4 rounded-3xl border border-grey-200 bg-white p-4 shadow-sm md:rounded-xl md:gap-6 md:px-4 md:py-7`}
            style={{ backgroundColor: item.bgColor || "#FFFFFF" }}
          >
            {item?.data?.map((subItem, index) =>
              renderItemByCardType(
                subItem as LandingPageCard,
                index,
                width,
                true,
              ),
            )}
          </div>
        );
      case "rowButton":
        return (
          <section
            key={key}
            className="grid w-full grid-cols-3 gap-3 px-4 md:flex md:w-full md:flex-row md:items-center md:justify-center md:gap-4"
          >
            {item.data?.map((subItem, index) =>
              renderItemByCardType(
                subItem as LandingPageCard,
                index,
                width,
                true,
              ),
            )}
          </section>
        );
      default:
        return undefined;
    }
  }

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] flex-col items-center gap-8 bg-neutral lg:h-full">
      <Header />

      <main className="mb-[68px] w-full max-w-7xl overflow-y-auto md:mb-0 md:overflow-y-visible">
        <div className="hidden w-full md:flex md:flex-col md:gap-8">
          {landingPageData?.webList?.map((item, index) =>
            landingPageData?.cardDatas?.[item]
              ? renderItemByCardType(
                  landingPageData.cardDatas[item],
                  index,
                  "desktop",
                )
              : null,
          )}
        </div>
        <div className="flex w-full flex-col gap-8 pb-8 md:hidden">
          {landingPageData?.pwaList?.map((item, index) =>
            landingPageData?.cardDatas?.[item]
              ? renderItemByCardType(
                  landingPageData.cardDatas[item],
                  index,
                  "mobile",
                )
              : null,
          )}
        </div>
      </main>
      <Footer selectedMenu="home" />
    </div>
  );
}
