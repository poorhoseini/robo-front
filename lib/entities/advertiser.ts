import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type UserAdvertiser = {
  phoneNumber: string[];
};

export type StoreAdvertiser = {
  addresses: string[];
  numbers: string[];
  services: string[];
  _id: string;
  serviceType?: ServiceType;
  storeName: string;
  storeType: string;
  telegram: string;
  viewsCount: number;
};

export interface GetAdvertiserPageResponseProps extends ResponseProps {
  data: StoreAdvertiser;
}
