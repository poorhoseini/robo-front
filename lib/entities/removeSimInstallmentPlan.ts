import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface RemoveSimInstallmentPlanResponseProps extends ResponseProps {
  data: {};
}

export type RemoveSimInstallmentPlanRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
};
