import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import { GetSingleSimCardPageResponseProps } from "@/lib/entities/singleSimCard";
import getSingleSimCardPage from "@/lib/api/getSingleSimCardPage";
import SimCardDetailCard from "@/components/simCardPages/SimCardDetailCard";
import AdvertiserCard from "@/components/simCardPages/AdvertiserCard";
import RoundListCard from "@/components/simCardPages/RoundListCard";
import CardStack from "@/components/layout/CardStack";
import AdvertiserInformationDialog from "@/components/simCardPages/AdvertiserInformationDialog";
import { ResponseError } from "@/lib/api/error";

export default async function SingleSimCardPage({
  params,
}: {
  params: { id: string };
}) {
  let singleSimCardPageResponse: GetSingleSimCardPageResponseProps | undefined =
    undefined;

  try {
    singleSimCardPageResponse = await getSingleSimCardPage(params.id);
  } catch (error) {
    console.log(error);
    if (error instanceof ResponseError) {
      const errorReason = error.getErrorReason();
      return <p>{errorReason + " " + error.message}</p>;
    } else {
      return error;
    }
  }

  if (!singleSimCardPageResponse) return <p>خطا در دریافت اطلاعات سیم کارت</p>;

  const singleSimCardData = singleSimCardPageResponse.data;

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center gap-8 bg-white md:bg-neutral">
      <div className="hidden w-full md:block">
        <Header />
      </div>

      <main className="flex w-full max-w-7xl flex-col gap-12 overflow-y-auto pb-[104px] md:overflow-y-visible md:pb-0">
        <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start">
          <SimCardDetailCard
            title="سیم کارت تکی"
            itemDetail={{
              id: singleSimCardData._id,
              serviceType: singleSimCardData.serviceType,
              createTime: singleSimCardData.addvertiseTime,
              viewsCount: singleSimCardData.viewsCount,
              simCards: [
                {
                  sellerSpel: singleSimCardData.sellerSpel,
                  operator: singleSimCardData.operator,
                },
              ],
              priceData: {
                isApprovedByExpert: singleSimCardData.isExpert,
                price: singleSimCardData.price,
                offPercent: singleSimCardData.offPercent,
                offPrice: singleSimCardData.offPrice,
                priceType: singleSimCardData.priceType,
              },
              loanData: {
                hasInstallment: singleSimCardData.isInstallment,
                installmentPlan: singleSimCardData.installmentPlan,
              },
              roundData: singleSimCardData.rondData,
              specificationsData: {
                simCardLevel: singleSimCardData.vip,
                simCardType: singleSimCardData.type,
                preNumber: singleSimCardData.preNumber,
                code: singleSimCardData.code,
                simCardStatus: singleSimCardData.state,
                provinceFa: singleSimCardData.provinceFa,
                cityFa: singleSimCardData.cityFa,
              },
            }}
          />
          <div className="flex w-full flex-col items-center gap-10 px-6 md:px-0">
            <AdvertiserCard
              isStore={singleSimCardData.isStore}
              user={singleSimCardData.user}
              store={singleSimCardData.store}
            />
            {!!singleSimCardData.rondData.rondData.length && (
              <div className="hidden w-full md:flex">
                <RoundListCard rondData={singleSimCardData.rondData} />
              </div>
            )}
          </div>
        </div>
        {!!singleSimCardPageResponse.sameData.length && (
          <CardStack
            stackData={{
              cardType: "singleSim",
              title: "سیم کارت های مشابه",
              data: singleSimCardPageResponse.sameData,
            }}
            link="/search?searchType=simcard"
            blue
          />
        )}
      </main>
      <div className="hidden w-full md:block">
        <Footer selectedMenu="packageDetail" />
      </div>
      <div className="absolute bottom-0 flex h-20 w-full items-center justify-center border-t border-grey-200 bg-white p-4 md:hidden">
        <AdvertiserInformationDialog
          isStore={singleSimCardData.isStore}
          user={singleSimCardData.user}
          store={singleSimCardData.store}
        />
      </div>
    </div>
  );
}
