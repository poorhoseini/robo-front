import { ResponseProps } from "./api";

export interface PrePredictSimResponseProps extends ResponseProps {
  cartId: string;
}

export type PrePredictSimRequestProps = {
  simcards: Array<{
    phoneNumber: string;
    state: number;
    type: number;
  }>;
};

export type PrePredictByExpertSimRequestProps = {
  phoneNumber: string;
  state: number;
  type: number;
};
