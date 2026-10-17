import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface PreUpdateTimeResponseProps extends ResponseProps {
  cartId: string;
}

export type PreUpdateTimeRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
};
