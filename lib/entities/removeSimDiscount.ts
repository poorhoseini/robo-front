import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface RemoveSimDiscountResponseProps extends ResponseProps {
  data: {};
}

export type RemoveSimDiscountRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
};
