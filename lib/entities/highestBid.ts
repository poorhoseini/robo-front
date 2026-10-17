import { Operator } from "./operator";
import { ResponseProps } from "./api";
import { RoundData } from "./round";
import { ServiceType } from "./landingPage";

export type HighestBidType = "simcard" | "simPack";
export type HighestBidOffer = {
  bidPrice: number;
  createDate: number;
};
export type HighestBidSingleSimCard = {
  cityFa: string;
  code: number;
  isInstallment: boolean;
  operator: Operator;
  price: number;
  priceType: number;
  provinceFa: string;
  rondData: RoundData[]; //Bad structure. no reason for array
  sellerSpel: string;
  state: number;
  totalScore: number;
  type: number;
  vipType: number;
};

export type HighestBidSimPackSimCard = {
  sellerSpel: string;
  operator: Operator;
  state: number;
  type: number;
};

export type HighestBid = {
  _id: string;
  cityFa?: string;
  createDate: EpochTimeStamp;
  expireDate: EpochTimeStamp;
  highBidOffers: HighestBidOffer[];
  maximumAcceptableOffer: number;
  minimumAcceptableOffer: number;
  isInstallment?: boolean;
  offerLimit: number;
  priceType: number;
  provinceFa?: string;
  serviceType: ServiceType;
  simcard: HighestBidSingleSimCard | HighestBidSimPackSimCard[];
  startPrice: number;
  type: HighestBidType;
  viewsCount: number;
  vip?: number;
};

export interface GetHighestBidPageResponseProps extends ResponseProps {
  data: HighestBid;
  sameData: any[];
}

export type OfferHighestBidRequestProps = {
  highBidId: string;
  bidPrice: number;
};

export type OfferHighestBidResponseProps = {
  cartId: string;
  data: {
    bidCount: number;
    highBidExpireDate: number;
    serviceType: ServiceType;
    simcards: string[];
    startPrice: number;
    type: string;
  };
  message: string;
  paymentData: {
    alowToContinue: boolean;
    amount: number;
    count: number;
    message: string;
    preferredPayment: string;
    serviceNameFa: string;
    subscriptionResponse: {
      hasSub: boolean;
      message: string;
    };
    walletResponse: {
      availableBalance: number;
      finalBalnceAfter: number;
      hasBlance: boolean;
      message: string;
    };
  };
  reason: number;
  status: string;
};

export type OfferHighestBidFormProps = {
  price: string;
};
