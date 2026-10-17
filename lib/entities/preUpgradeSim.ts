import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface PreUpgradeSimResponseProps extends ResponseProps {
  cartId: string;
}

export type PreUpgradeSimRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
  vipType: number;
};
