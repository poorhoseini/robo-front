import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface ChangeSimPriceResponseProps extends ResponseProps {
  data: {
    newPrice: number;
  };
}

export type ChangeSimPriceRequestProps = {
  refrenceId: string;
  refrence: ServiceType;
  newPrice: number;
  newPriceType: number;
  socialReply: boolean;
};
