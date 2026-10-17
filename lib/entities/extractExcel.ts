import { ResponseProps } from "./api";

export type ExtractedSimCard = {
  phoneNumber: string;
  price: number;
  priceType: number;
  state: number;
  type: number;
};

export interface ExtractExcelResponseProps extends ResponseProps {
  data: { simcards: ExtractedSimCard[] };
}

export type ExtractExcelRequestProps = FormData;

export type ExtractExcelFormProps = { file: File };
