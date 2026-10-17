import { ResponseProps } from "./api";

export interface PreVitrinStoreResponseProps extends ResponseProps {
  cartId: string;
}

export type PreVitrinStoreRequestProps = {
  vitrinType: "store";
  refrenceId: string;
};
