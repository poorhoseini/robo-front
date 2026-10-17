import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export interface ChangeSimInstallmentPlanResponseProps extends ResponseProps {
  data: {};
}

export type ChangeSimInstallmentPlanRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
  installmentPlanId: string;
};
