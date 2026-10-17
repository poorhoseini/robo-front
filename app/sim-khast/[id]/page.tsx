import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import getSimKhastPage from "@/lib/api/getSimKhastPage";
import CardStack from "@/components/layout/CardStack";
import { GetSimKhastPageResponseProps } from "@/lib/entities/simKhast";
import SimCardDetailCard from "@/components/simCardPages/SimCardDetailCard";
import OfferSimKhastDialog from "@/components/simCardPages/OfferSimKhastDialog";
import OfferSimKhastCard from "@/components/simCardPages/OfferSimKhastCard";

export default async function SimKhastPage({
  params,
}: {
  params: { id: string };
}) {
  //For testing purposes:
  // await new Promise((r) => setTimeout(r, 5000));

  const simKhastPageResponse: GetSimKhastPageResponseProps =
    await getSimKhastPage(params.id);
  const simKhastData = simKhastPageResponse.data;

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] flex-col items-center gap-8 bg-white md:bg-neutral lg:h-full">
      <div className="hidden w-full md:block">
        <Header />
      </div>

      <main className="flex w-full max-w-7xl flex-col gap-12 overflow-y-auto pb-[104px] md:overflow-y-visible md:pb-0">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start">
          <SimCardDetailCard
            title="سیم خواست"
            itemDetail={{
              id: simKhastData._id,
              serviceType: simKhastData.serviceType,
              createTime: simKhastData.createDate,
              viewsCount: simKhastData.viewsCount,
              simCards: [
                {
                  sellerSpel: simKhastData.condition.sellerSpel,
                  operator: simKhastData.condition.operator,
                },
              ],
              priceData: {
                minPrice: simKhastData.condition.minPrice,
                maxPrice: simKhastData.condition.maxPrice,
              },
              loanData: {
                hasInstallment: simKhastData.condition.isInstallment,
              },
              rondLevelsFa: simKhastData.condition.rondLevelsFa,
              specificationsData: {
                simCardType: simKhastData.condition.type,
                preNumber: simKhastData.condition.preNumber,
                code: simKhastData.condition.code,
                simCardStatus: simKhastData.condition.state,
                provinceFa: simKhastData.condition.provinceFa,
                cityFa: simKhastData.condition.cityFa,
              },
            }}
          />
          <div className="hidden md:flex md:w-[820px]">
            <OfferSimKhastCard simKhastData={simKhastData} />
          </div>
        </div>
        {!!simKhastPageResponse.sameData.length && (
          <CardStack
            stackData={{
              cardType: "simKhast",
              title: "سیم خواست های مشابه",
              data: simKhastPageResponse.sameData,
            }}
            link="/search?searchType=simKhast"
            blue
          />
        )}
      </main>
      <div className="hidden w-full md:block">
        <Footer selectedMenu="packageDetail" />
      </div>
      <div className="absolute bottom-0 flex h-20 w-full items-center justify-center border-t border-grey-200 bg-white p-4 md:hidden">
        <OfferSimKhastDialog simKhastData={simKhastData} />
      </div>
    </div>
  );
}
