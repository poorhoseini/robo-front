import { ResponseProps } from "./api";

export type RoundLevel = "doRagham" | "tartibiAkhar" | "other***";
export type RoundLevelFa = "ترتیبی از آخر" | "دو رقم یکی" | "other***";

export type RoundData = {
  rondData: Array<{
    rondId: number;
    detail: string | string[];
    rondLevel: RoundLevel;
    rondLevelFa: RoundLevelFa;
    score: number;
    spell: string[];
    status: boolean;
  }>;
  rondLevelsFa: RoundLevelFa[];
  spells: string[][];
};

export interface GetSimCardRoundTypesResponseProps extends ResponseProps {
  data: RoundData;
}

export type GetSimCardRoundTypesRequestProps = {
  phoneNumber: string;
};
