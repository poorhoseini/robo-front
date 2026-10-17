import AdvertiserCard from "@/components/simCardPages/AdvertiserCard";
import { ResponseError } from "@/lib/api/error";
import getAdvertiserPage from "@/lib/api/getAdvertiserPage";
import { GetAdvertiserPageResponseProps } from "@/lib/entities/advertiser";

export default async function AdvertiserSection({
  shopId,
}: {
  shopId: string;
}) {
  try {
    const advertiserPageResponse: GetAdvertiserPageResponseProps =
      await getAdvertiserPage(shopId);
    const advertiserData = advertiserPageResponse.data;

    return (
      <AdvertiserCard
        searchPage
        isStore={true}
        user={[]}
        store={{
          _id: shopId,
          storeName: advertiserData.storeName,
          storeType: advertiserData.storeType,
          services: advertiserData.services,
          addresses: advertiserData.addresses,
          numbers: advertiserData.numbers,
          telegram: advertiserData.telegram,
          viewsCount: advertiserData.viewsCount,
        }}
      />
    );
  } catch (error) {
    if (error instanceof ResponseError) {
      console.log(error.printError());
      return <p className="text-red">{error.printError()}</p>;
    } else {
      console.log(error);
      return <p className="text-red">خطایی رخ داده است</p>;
    }
  }
}
