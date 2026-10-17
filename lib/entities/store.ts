import { ResponseProps } from "./api";

export type UserProfileStore = {
  _id: string;
  addresses: string[];
  highBidCount: number;
  isActive: boolean;
  numbers: string[];
  services: string[];
  simPackCount: number;
  simcardCount: number;
  specialSimCount: number;
  storeName: string;
  storeType: "store";
  viewsCount: number;
};

export interface SearchStoresResponseProps extends ResponseProps {
  data: UserProfileStore[];
}

export type DeactiveUserProfileStoreRequestProps = {
  storeId: string;
};

export type PostUserProfileStoreRequestProps = {
  // "storeName":"سیم رند",
  //   "numbers": ["09120339284"],
  //   "addresses": ["test"],
  //   "storeType": "store",
  //   "services":["خرید سیمکارت","فروش سیمکارت"]
  storeName: string;
  numbers: string[];
  addresses: string[];
  storeType: string;
  services: string[];
};

export type UserProfileStoreFormProps = {
  // "storeName":"سیم رند",
  //   "numbers": ["09120339284"],
  //   "addresses": ["test"],
  //   "storeType": "store",
  //   "services":["خرید سیمکارت","فروش سیمکارت"]
  storeName: string;
  numbers: string[];
  addresses: string;
  storeType: string;
  services: string[];
};
