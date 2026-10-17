import { ServiceType } from "./landingPage";
import { Operator } from "./operator";
import { ResponseProps } from "./api";
import { RoundLevelFa } from "./round";

export type SimKhast = {
  _id: string;
  condition: {
    city: string;
    cityFa: string;
    code: number;
    isInstallment: boolean | "X";
    maxPrice: number;
    minPrice: number;
    mode: "specialSim" | "other***";
    operator: Operator;
    preNumber: string;
    province: string;
    provinceFa: string;
    rondLevelsFa: RoundLevelFa[];
    sellerSpel: string;
    state: number;
    type: number;
  };
  isActive: boolean;
  createDate: EpochTimeStamp;
  offerCount: number;
  offerLimit: number;
  serviceType: ServiceType;
  viewsCount: number;
};

export interface GetSimKhastPageResponseProps extends ResponseProps {
  data: SimKhast;
  sameData: any[];
}

export type OfferSimKhastRequestProps = {
  specialSimId: string;
  phoneNumber: string;
  price: number;
  state: number;
  type: number;
  // province: string;
  // city: string;
  provinceId: number;
  cityId: number;
};

export type OfferSimKhastResponseProps = any;

export type OfferSimKhastFormProps = {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  price: string;
  type: string;
  status: string;
};

export interface SearchSimKhastResponseProps extends ResponseProps {
  data: SimKhast[];
}
