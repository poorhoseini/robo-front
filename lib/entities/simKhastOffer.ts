import { RequestFilter, ResponseProps } from "./api";

export type SimKhastOffer = {
  _id: string;
  createDate: EpochTimeStamp;
  phoneNumber: string;
  price: number;
  rondData: {
    digitRepetition: number;
    rondData: [
      {
        detail: string[];
        rondId: number;
        rondLevel: string;
        rondLevelFa: string;
        score: number;
        spell: string[];
        status: boolean;
      },
    ];
    rondLevels: string[];
    rondLevelsFa: string[];
    spells: string[][];
    totalScore: number;
  };
  state: number;
  type: number;
  userData: {
    phoneNumber: string;
  };
};

export interface GetSimKhastOffersResponseProps extends ResponseProps {
  data: SimKhastOffer[];
}

export type GetSimKhastOffersRequestProps = {
  limit: number;
  filters: RequestFilter[];
  sort: {
    field: string;
    order: number;
  };
  mode: "customer" | "my";
  skip: number;
};
