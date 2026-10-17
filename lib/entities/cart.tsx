import { ResponseProps } from "./api";
import { ChannelPlatform } from "./channel";

export type Service =
  | "simcard"
  | "simPack"
  | "highBid-simcard"
  | "highBid-simPack"
  | "specialPlan"
  | "offPrice"
  | "vipSim"
  | "telegram"
  | "update";
export type SubService = "offer" | "create";
export type CartType = "service" | "plan";
export type TransactionSource = "pay" | "wallet" | "subscription" | "trial";
export type TransactionType = "debit" | "credit";

export type Cart = {
  amount: number;
  cartId: string;
  count: number;
  paymentData: {
    allowPayments: TransactionSource[];
    alowToContinue: boolean;
    amount: number;
    count: number;
    message: string;
    preferredPayment: "wallet" | "subscription";
    subscriptionResponse: {
      counter?: number;
      expireDate?: number;
      finalRemain?: number;
      hasSub: boolean;
      message: string;
      period?: number;
      service?: Service;
      serviceNameFa?: string;
      subService?: SubService;
    };
    walletResponse: {
      amount: number;
      availableBalance: number;
      needBalance?: number;
      finalBalnceAfter: number;
      hasBlance: boolean;
      message: string;
    };
    trialResponse?: {
      count?: number;
      counter?: number;
      finalRemain?: number;
      hasBalance?: boolean;
      hasTrial: boolean;
      message: string;
      period?: number;
      service?: Service;
      subService?: SubService;
    };
  };
  payload: {
    simcards?: Array<{
      cityFa: string;
      cityId: number;
      installmentPlanId: string;
      isInstallment: false;
      phoneNumber: string;
      price: number;
      priceType: number;
      provinceFa: string;
      provinceId: number;
      state: number;
      type: number;
    }>;
    bidPrice?: number;
    highBidId?: string;
    cityId?: number;
    phoneNumber?: string;
    price?: number;
    provinceId?: number;
    specialSimId?: string;
    state?: number;
    type?: number;
  };
  preview: {
    offPercent?: number;
    vipType?: number;
    channels?: Array<{ channelId: string; channelPlatform: ChannelPlatform }>;
    simcards?: Array<{
      isInstallment?: boolean;
      price?: number;
      priceType?: number;
      sellerSpel?: string;
      state?: number;
      type?: number;
      phoneNumber?: string;
    }>;
    bid?: {
      bidPrice: number;
      date: number;
    };
    condition?: {
      _id: string;
      cartId: null;
      city: string;
      cityFa: string;
      cityId: number;
      code: number;
      digit10: string;
      digit2: string;
      digit3: string;
      digit4: string;
      digit5: string;
      digit6: string;
      digit7: string;
      digit8: string;
      digit9: string;
      isActive: true;
      isInstallment: string;
      limit: number;
      maxPrice: number;
      minPrice: number;
      mode: string;
      operator: string;
      province: string;
      provinceFa: string;
      provinceId: number;
      rondData: [];
      rondIds: [];
      rondLevels: [];
      rondLevelsFa: string[];
      sellerSpel: string;
      state: number;
      transactionId: null;
      type: number;
    };
    offer?: {
      phoneNumber: string;
      price: number;
      state: number;
      type: number;
    };
    period?: number;
    plan: string;
    serviceNameFa: string;
    status: string;
    subPlan: string;
    subList: Array<{
      counter: number;
      service: Service;
      serviceNameFa: string;
      subService: SubService;
    }>;
  };
  service: Service;
  serviceName: string;
  serviceNameFa: string;
  subService: SubService;
  transactionType: TransactionType;
  type: CartType;
};

export interface GetCartPageResponseProps extends ResponseProps {
  data: Cart;
}

// export type OfferHighestBidRequestProps = {
//   highBidId: string;
//   bidPrice: number;
// };

// export type OfferHighestBidResponseProps = any;

// export type OfferHighestBidFormProps = {
//   price: string;
// };
