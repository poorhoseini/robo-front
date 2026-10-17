import { ResponseProps } from "./api";

export type RoundType = {
  id: number;
  desc: string;
  rondLevel: string;
  rondLevelFa: string;
  structure: string;
};

export type RoundTypeObject = {
  [key: string]: RoundType;
};

export interface GetRoundTypesResponseProps extends ResponseProps {
  data: RoundTypeObject;
}
