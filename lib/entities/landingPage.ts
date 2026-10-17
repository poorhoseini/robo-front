import { StoreAdvertiser } from "./advertiser";
import { ResponseProps } from "./api";
import { SimKhast } from "./simKhast";
import { SimPack } from "./simPack";
import { SingleSimCard } from "./singleSimCard";

export type LandingPageCardType =
  | "singleSim"
  | "search"
  | "store"
  | "highBidSimcard"
  | "highBidSimPack"
  | "simKhast"
  | "singleSim"
  | "singleSim-table"
  | "offPrice"
  | "videoCard"
  | "simPack"
  | "button"
  | "group"
  | "rowButton";

export type ServiceType =
  | "simcard"
  | "simPack"
  | "simcardHighBid"
  | "simPackHighBid"
  | "specialSim";

export type LandingPageCard = {
  cardType: LandingPageCardType;
  data?: Array<
    SingleSimCard | SimKhast | SimPack | StoreAdvertiser | LandingPageCard
  >;
  title: string;
  path?: string;
  bgColor?: string;
};

export interface GetLandingPageResponseProps extends ResponseProps {
  data: {
    cardDatas: { [key: string]: LandingPageCard };
    pwaList: string[];
    webList: string[];
  };
}
