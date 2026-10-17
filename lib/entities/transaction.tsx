import { ResponseProps } from "./api";
import {
  Service,
  SubService,
  TransactionSource,
  TransactionType,
} from "./cart";

export type CartTransaction = {
  _id: string;
  cartData: {
    cartId: string;
  };
  serviceData: {
    count: number;
    service: Service;
    serviceName: string;
    serviceNameFa: string;
    subService: SubService;
  };
  transactionData: {
    amount: number;
    count: number;
    createDate: EpochTimeStamp;
    desc: string;
    message: string;
    source: TransactionSource;
    status: string;
    transactionId: number;
    type: TransactionType;
  };
  transactionFinalState: "success";
};

export type WalletTransaction = {
  amount: number;
  cartId: string;
  count: number;
  createDate: EpochTimeStamp;
  desc: string;
  finalBalance: number;
  id: number;
  source: TransactionSource;
  status: string;
  transactionDate: string;
  transactionType: TransactionType;
  walletId: number;
};

export interface GetCartTransactionsResponseProps extends ResponseProps {
  data: CartTransaction[];
}

export interface GetWalletTransactionsResponseProps extends ResponseProps {
  data: {
    transactions: WalletTransaction[];
  };
}
