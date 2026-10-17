import { ResponseProps } from "./api";
import { Service, SubService } from "./cart";

export type PlanSubscription = {
  counter: number;
  service: Service;
  serviceNameFa: string;
  subService: SubService;
};

export type Plan = {
  _id: string;
  expireDate: string;
  period: number;
  plan: string;
  price: number;
  serviceNameFa: string;
  subList: PlanSubscription[];
  subPlan: string;
};

export type MyPlan = {
  id: string;
  startDate: EpochTimeStamp;
  endDate: EpochTimeStamp;
  period: number;
  plan: string;
  serviceNameFa: string;
  subPlan: string;
};

export interface GetAvailablePlansResponseProps extends ResponseProps {
  plans: Plan[];
}

export interface GetMyPlansResponseProps extends ResponseProps {
  data: {
    plans: MyPlan[];
  };
}

export interface PreAddPlanResponseProps extends ResponseProps {
  cartId: string;
}

export type preAddPlanRequestProps = {
  planId: string;
  // subPlan: string;
};

// export type OfferHighestBidRequestProps = {
//   highBidId: string;
//   bidPrice: number;
// };

// export type OfferHighestBidResponseProps = any;

// export type OfferHighestBidFormProps = {
//   price: string;
// };
