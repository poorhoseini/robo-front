import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import CardStack from "@/components/layout/CardStack";
import TitleCard from "@/components/simCardPages/SimCardDetailCard";
import {
  GetHighestBidPageResponseProps,
  HighestBidSimPackSimCard,
  HighestBidSingleSimCard,
  HighestBidType,
} from "@/lib/entities/highestBid";
import getHighestBidPage from "@/lib/api/getHighestBidPage";
import RoundListCard from "@/components/simCardPages/RoundListCard";
import OfferHighestBidCard from "@/components/simCardPages/OfferHighestBidCard";
import OfferHighestBidDialog from "@/components/simCardPages/OfferHighestBidDialog";

export default async function HighestBidPage({
  params,
  searchParams,
}: {
  params: { id: string; highestBidType: string };
  searchParams: { highestBidType: string };
}) {
  const highestBidPageResponse: GetHighestBidPageResponseProps =
    await getHighestBidPage(
      searchParams.highestBidType as HighestBidType,
      params.id,
    );
  const highestBidData = highestBidPageResponse.data;

  const highestBidSingleSimCardData =
    highestBidData.type === "simcard"
      ? (highestBidData.simcard as HighestBidSingleSimCard)
      : undefined;
  const highestBidSimPackSimCardData =
    highestBidData.type === "simPack"
      ? (highestBidData.simcard as HighestBidSimPackSimCard[])
      : undefined;

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center gap-8 bg-white md:bg-neutral">
      <div className="hidden w-full md:block">
        <Header />
      </div>

      <main className="flex w-full max-w-7xl flex-col gap-12 overflow-y-auto pb-[104px] md:overflow-y-visible md:pb-0">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start">
          {highestBidData.type === "simcard" ? (
            <TitleCard
              title="بالاترین پیشنهاد تکی"
              itemDetail={{
                id: highestBidData._id,
                serviceType: highestBidData.serviceType,
                createTime: highestBidData.createDate,
                viewsCount: highestBidData.viewsCount,
                simCards: [
                  {
                    sellerSpel: highestBidSingleSimCardData?.sellerSpel!,
                    operator: highestBidSingleSimCardData?.operator!,
                  },
                ],
                priceData: {
                  startPrice: highestBidSingleSimCardData?.price,
                  priceType: highestBidSingleSimCardData?.priceType,
                },
                loanData: {
                  hasInstallment: highestBidSingleSimCardData?.isInstallment!,
                },
                roundData: highestBidSingleSimCardData?.rondData[0],
                specificationsData: {
                  simCardType: highestBidSingleSimCardData?.type!,
                  simCardLevel: highestBidData?.vip,
                  code: highestBidSingleSimCardData?.code!,
                  simCardStatus: highestBidSingleSimCardData?.state!,
                  provinceFa: highestBidSingleSimCardData?.provinceFa!,
                  cityFa: highestBidSingleSimCardData?.cityFa!,
                },
              }}
            />
          ) : (
            <TitleCard
              title="بالاترین پیشنهاد گروهی"
              itemDetail={{
                id: highestBidData._id,
                serviceType: highestBidData.serviceType,
                createTime: highestBidData.createDate,
                viewsCount: highestBidData.viewsCount,
                simCards: highestBidSimPackSimCardData!.map((item) => {
                  return {
                    sellerSpel: item.sellerSpel,
                    operator: item.operator,
                  };
                }),
                priceData: {
                  startPrice: highestBidData.startPrice,
                  priceType: highestBidData.priceType,
                },
                loanData: {
                  hasInstallment: highestBidData?.isInstallment!,
                },
                specificationsData: {
                  provinceFa: highestBidData?.provinceFa!,
                  cityFa: highestBidData?.cityFa!,
                },
              }}
            />
          )}

          <div className="flex w-full flex-col items-center gap-10 px-6 md:px-0">
            <div className="hidden md:flex md:w-[820px]">
              <OfferHighestBidCard highestBidData={highestBidData} />
            </div>
            {!!(
              highestBidData.type === "simcard" &&
              highestBidSingleSimCardData &&
              highestBidSingleSimCardData.rondData[0].rondData.length
            ) && (
              <div className="hidden w-full md:flex">
                <RoundListCard
                  rondData={highestBidSingleSimCardData?.rondData[0]}
                />
              </div>
            )}
          </div>
        </div>
        {highestBidData.type === "simcard"
          ? !!highestBidPageResponse.sameData.length && (
              <CardStack
                stackData={{
                  cardType: "highBidSimcard",
                  title: "بالاترین پیشنهادهای تکی مشابه",
                  data: highestBidPageResponse.sameData,
                }}
                link="/search?searchType=simcard&isHighestBid=true"
              />
            )
          : !!highestBidPageResponse.sameData.length && (
              <CardStack
                stackData={{
                  cardType: "highBidSimPack",
                  title: "بالاترین پیشنهادهای گروهی مشابه",
                  data: highestBidPageResponse.sameData,
                }}
                link="/search?searchType=simPack&isHighestBid=true"
              />
            )}
      </main>
      <div className="hidden w-full md:block">
        <Footer selectedMenu="packageDetail" />
      </div>
      <div className="absolute bottom-0 flex h-20 w-full items-center justify-center border-t border-grey-200 bg-white p-4 md:hidden">
        <OfferHighestBidDialog highestBidData={highestBidData} />
      </div>
    </div>
  );
}
