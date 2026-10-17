import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface ChangeSimActivationResponseProps extends ResponseProps {
  data: {
    saledSimcardIds: string[];
    updateCount: string[];
  };
}

export type ChangeSimActivationRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
  state: boolean;
  socialReply: boolean;
};
