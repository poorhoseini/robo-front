import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import SimCardDetailCard from "@/components/simCardPages/SimCardDetailCard";
import AdvertiserCard from "@/components/simCardPages/AdvertiserCard";
import CardStack from "@/components/layout/CardStack";
import { GetSimPackPageResponseProps } from "@/lib/entities/simPack";
import getSimPackPage from "@/lib/api/getSimPackPage";

export default async function SimPackPage({
  params,
}: {
  params: { id: string };
}) {
  const simPackPageResponse: GetSimPackPageResponseProps = await getSimPackPage(
    params.id,
  );
  const simPackData = simPackPageResponse.data;

  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-neutral">
      <Header />

      <main className="flex w-full max-w-7xl flex-col gap-12">
        <div className="flex flex-row items-start justify-center gap-8">
          <SimCardDetailCard
            title="سیم کارت گروهی"
            itemDetail={{
              id: simPackData._id,
              serviceType: simPackData.serviceType,
              createTime: simPackData.addvertiseTime,
              viewsCount: simPackData.viewsCount,
              simCards: simPackData.simcards.map((item) => ({
                sellerSpel: item.sellerSpel,
                operator: item.operator,
              })),
              priceData: {
                // isApprovedByExpert: simPackData.isExpert,
                price: simPackData.price,
                offPercent: simPackData.offPercent,
                offPrice: simPackData.offPrice,
                priceType: simPackData.priceType,
              },
              loanData: {
                hasInstallment: simPackData.isInstallment,
                installmentPlan: simPackData.installmentPlan,
              },
              specificationsData: {
                // simCardLevel: simPackData.vip,
                simPackType: simPackData.simPackType,
                // simCardType: simPackData.type,
                // preNumber: simPackData.preNumber,
                // code: simPackData.code,
                // simCardStatus: simPackData.state,
                provinceFa: simPackData.provinceFa,
                cityFa: simPackData.cityFa,
              },
            }}
          />
          <AdvertiserCard
            isStore={simPackData.isStore}
            user={simPackData.user}
            store={simPackData.store}
          />
        </div>
        {!!simPackPageResponse.sameData.length && (
          <CardStack
            stackData={{
              cardType: "simPack",
              title: "سیم کارت های گروهی مشابه",
              data: simPackPageResponse.sameData,
            }}
            link="/search?searchType=simPack"
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
