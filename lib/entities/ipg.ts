import { ResponseProps } from "./api";

export type IpgData = {
  Authority: string;
  desc: string;
  paymentUId: string;
};

export interface RequestIpgForWalletResponseProps extends ResponseProps {
  data: IpgData;
  redirect: string;
}

export type PostRequestIpgForWalletRequestProps = {
  count: number;
  cartId?: string;
};

export interface RequestIpgForCartResponseProps extends ResponseProps {
  data: IpgData;
  redirect: string;
}

export type PostRequestIpgForCartRequestProps = {
  cartId: string;
};
