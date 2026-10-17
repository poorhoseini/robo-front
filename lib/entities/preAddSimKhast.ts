import { ResponseProps } from "./api";
import { Operator } from "./operator";

export interface PreAddSimKhastResponseProps extends ResponseProps {
  cartId: string;
}

export type PreAddSimKhastRequestProps = {
  minPrice: number;
  maxPrice: number;
  rondIds?: number[];
  type?: number;
  state?: number;
  operator?: Operator;
  digit0?: string;
  digit1?: string;
  digit2?: string;
  digit3?: string;
  digit4?: string;
  digit5?: string;
  digit6?: string;
  digit7?: string;
  digit8?: string;
  digit9?: string;
  digit10?: string;
  provinceId?: number;
  cityId?: number;
};
