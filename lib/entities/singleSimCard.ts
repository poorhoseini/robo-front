import { StoreAdvertiser, UserAdvertiser } from "./advertiser";
import { Installment } from "./installment";
import { ServiceType } from "./landingPage";
import { Operator } from "./operator";
import { ResponseProps } from "./api";
import { RoundLevel, RoundData } from "./round";

export type SingleSimCard = {
  _id: string;
  addvertiseTime: EpochTimeStamp;
  city: string;
  cityFa: string;
  code: number;
  highBidData?: Array<{
    expireDate: EpochTimeStamp;
    _id: string;
  }>;
  installmentPlan: Installment[];
  isActive: boolean;
  isExpert: boolean;
  isHighBid?: boolean;
  isInstallment: boolean;
  isReserveable: "reservable" | "notReservable";
  isStore: boolean;
  offPercent?: number;
  offPrice?: number;
  operator: Operator;
  phoneNumber: string;
  preNumber: string;
  price: number;
  priceType: number;
  province: string;
  provinceFa: string;
  rondData: RoundData;
  rondLevels: RoundLevel[];
  sellerSpel: string;
  serviceType: ServiceType;
  state: number;
  store: StoreAdvertiser;
  totalScore: number;
  type: number;
  user: UserAdvertiser[];
  viewsCount: number;
  vip: number;
};

export interface GetSingleSimCardPageResponseProps extends ResponseProps {
  data: SingleSimCard;
  sameData: any[];
}

export interface SearchSingleSimCardResponseProps extends ResponseProps {
  data: SingleSimCard[];
}
