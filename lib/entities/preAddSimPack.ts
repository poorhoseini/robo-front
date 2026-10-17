import { ResponseProps } from "./api";
import { SimPackType } from "./simPack";

export interface PreAddSimPackResponseProps extends ResponseProps {
  cartId: string;
}

export type PreAddSimPackRequestProps = {
  simcards: Array<{ phoneNumber: string; state: number; type: number }>;
  simPackType: SimPackType;
  price: number;
  priceType: number;
  provinceId: number;
  cityId: number;
  isInstallment: boolean;
  installmentPlanId?: string;
};
