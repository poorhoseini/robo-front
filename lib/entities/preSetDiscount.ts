import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type PreSetDiscount = {
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

export interface PreSetDiscountResponseProps extends ResponseProps {
  cartId: string;
}

export type PreSetDiscountRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
  offPercent: number;
  socialReply: boolean;
};

export type PreSetDiscountFormProps = {
  offPercent: string;
};
