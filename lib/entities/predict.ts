import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";
import { RoundLevel, RoundLevelFa } from "./round";

export type PredictAccuracy = "زیاد" | "متوسط" | "کم";
export type ExpertMode = "normal";
export type PredictSampleSimcard = {
  _id: number;
  code: number;
  digitRepetition: number;
  phoneNumber: string;
  price: number;
  rondLevels: RoundLevel[];
  sellerSpel: string;
  state: number;
  totalScore: number;
  type: number;
};

export type Predict = {
  _id: string;
  accuracy: PredictAccuracy;
  createDate: number;
  expireDate: number;
  prices: { finalPrice: number };
  simcard: {
    phoneNumber: string;
    state: number;
    type: number;
  };
};

export type PredictByExpert = {
  _id: string;
  createDate: number;
  expertMode: ExpertMode;
  isDone: boolean;
  perdictId: string;
  phoneNumber: string;
  lowPrice?: number;
  highPrice?: number;
  refrence: ServiceType;
  refrenceId: string;
  state: number;
  type: number;
};

export type PredictDetail = {
  _id: string;
  accuracy: PredictAccuracy;
  createDate: EpochTimeStamp;
  expireDate: EpochTimeStamp;
  prices: {
    finalPrice: number;
    highFinal: number;
    lowFinal: number;
    maxPrice: number;
    minPrice: number;
  };
  rondData: {
    digitRepetition: number;
    rondData: [];
    rondLevels: RoundLevel[];
    rondLevelsFa: RoundLevelFa[];
    spells: string[];
    totalScore: number;
  };
  simcard: {
    phoneNumber: string;
    state: number;
    type: number;
  };
  simcards: {
    bestMatch: PredictSampleSimcard[];
    highSimcards: PredictSampleSimcard[];
    midSimcards: PredictSampleSimcard[];
    minSimcards: PredictSampleSimcard[];
  };
};

export interface GetPredictsResponseProps extends ResponseProps {
  data?: Predict[];
}

export interface GetPredictByExpertsResponseProps extends ResponseProps {
  data?: PredictByExpert[];
}

export interface GetPredictDetailResponseProps extends ResponseProps {
  data?: PredictDetail;
}

export type GetPredictDetailRequestProps = {
  perdictId: string;
};
