import { ResponseProps } from "./api";

export type PreAddSimCard = {
  cityId: number;
  phoneNumber: string;
  price?: number;
  priceType: number;
  provinceId: number;
  state: number;
  type: number;
  isInstallment: boolean;
  installmentPlanId?: string;
};

export interface PreAddSimCardResponseProps extends ResponseProps {
  cartId: string;
}

export type PreAddSimCardRequestProps = {
  simcards: PreAddSimCard[];
};
