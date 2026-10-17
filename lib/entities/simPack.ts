import { StoreAdvertiser, UserAdvertiser } from "./advertiser";
import { Installment } from "./installment";
import { ServiceType } from "./landingPage";
import { Operator } from "./operator";
import { ResponseProps } from "./api";

export type SimPackType = "sabad" | "hamzad" | "serial";

export type SimPack = {
  _id: string;
  addvertiseTime: EpochTimeStamp;
  city: string;
  cityFa: string;
  highBidData?: Array<{
    expireDate: EpochTimeStamp;
    _id: string;
  }>;
  installmentPlan: Installment[];
  isActive: boolean;
  isHighBid?: boolean;
  isInstallment: boolean;
  isReserveable: "reservable" | "notReservable";
  isSeries: boolean;
  isStore: boolean;
  offPercent: number;
  offPrice: number;
  price: number;
  priceType: number;
  province: string;
  provinceFa: string;
  serviceType: ServiceType;
  simPackType: SimPackType;
  simcards: Array<{
    sellerSpel: string;
    simcardId: string;
    operator: Operator;
  }>;
  store: StoreAdvertiser;
  user: UserAdvertiser[];
  viewsCount: number;
};

export interface GetSimPackPageResponseProps extends ResponseProps {
  data: SimPack;
  sameData: any;
}

export interface SearchSimPackResponseProps extends ResponseProps {
  data: SimPack[];
}
