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
            className="flex h-[100px] w-[100px] flex-col items-center justify-start gap-5 rounded-lg border border-grey-100 bg-white p-3"
          >
            <Image
              src="/icons/icon-plus-black.svg"
              alt="Plus"
              width={24}
              height={24}
            />
            <p className="text-center text-xs font-medium text-grey">
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
            className={`flex w-full flex-col items-center justify-between gap-6 rounded-xl border border-grey-200 px-4 py-7`}
            style={{ backgroundColor: item.bgColor }}
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
            className="flex w-full flex-row items-center justify-center gap-4 px-4"
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
        <div className="flex w-full flex-col gap-8 md:hidden">
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
