import { ResponseProps } from "./api";

export type Installment = {
  maximumMonth: number;
  minimumMonth: number;
  preFound: number;
  profitPercent: number;
};

export type InstallmentPlan = {
  _id: string;
  applyToAll: boolean;
  isDefault: boolean;
  maximumMonth: number;
  minimumMonth: number;
  preFound: number;
  profitPercent: number;
  state: boolean;
  userId: string;
};

export interface GetMyInstallmentPlansResponseProps extends ResponseProps {
  data: InstallmentPlan[];
}

export interface AddInstallmentPlanResponseProps extends ResponseProps {
  // data: any;
}

export type AddInstallmentPlanRequestProps = {
  maximumMonth: number;
  minimumMonth: number;
  preFound: number;
  profitPercent: number;
  isDefault: boolean;
  applyToAll: boolean;
};

export type AddInstallmentPlanFormProps = {
  maximumMonth: string;
  minimumMonth: string;
  preFound: string;
  profitPercent: string;
  isDefault: boolean;
  applyToAll: boolean;
};
