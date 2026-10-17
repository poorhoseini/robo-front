import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type MyOffer = {
  _id: string;
  bidPrice: number;
  createDate: number;
  desc: string;
  highBidData: {
    _id: string;
    basePrice: number;
    expireDate: EpochTimeStamp;
    highestBidOfferId: string | null;
    highestOfferPrice: number;
    serviceType: ServiceType;
    startPrice: number;
  };
  highestBidPrice: number;
  isHighBidEnded: true;
  redirect: string;
  simcards: [
    {
      price: number;
      priceType: number;
      sellerSpel: string;
      state: number;
      type: number;
    },
  ];
  userData: {
    phoneNumber: string[];
  };
  userId: string | null;
  visibleAt: EpochTimeStamp;
};

export interface GetMyOffersResponseProps extends ResponseProps {
  data: MyOffer[];
}
