import { ResponseProps } from "./api";

export type WalletBalance = {
  availableBalance: number;
};

export interface GetMyWalletBalanceResponseProps extends ResponseProps {
  data: WalletBalance;
}
