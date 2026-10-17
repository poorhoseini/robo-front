import { ResponseProps } from "./api";
import { TransactionSource } from "./cart";

export type AppliedCart = {
  count: number;
  data: {
    count?: number;
    simcardIds: string[];
    highBidIds: string[];
  };
  preview: {
    plan?: string;
    simcards?: [
      {
        isInstallment?: boolean;
        price: number;
        priceType: number;
        sellerSpel: string;
        state: number;
        type: number;
      },
    ];
  };
  // serviceData: {
  //   count: number;
  //   simcardIds: string[];
  // };
  serviceName: string;
  serviceNameFa: string;
  transactionData: [
    {
      amount?: number;
      balance?: number;
      message?: string;
      newBalance?: number;
      reason?: number;
      source?: TransactionSource;
      status: string;
      transactionId: string | null;
      type?: "debit";
    },
  ];
  transactionState: string;
  redirect: string;
};

export type ApplyCartResponseProps = AppliedCart & ResponseProps;

export type ApplyCartRequestProps = {
  cartId: string;
  debitSource: TransactionSource | "auto";
};
// export type OfferHighestBidRequestProps = {
//   highBidId: string;
//   bidPrice: number;
// };

// export type OfferHighestBidResponseProps = any;

// export type OfferHighestBidFormProps = {
//   price: string;
// };
