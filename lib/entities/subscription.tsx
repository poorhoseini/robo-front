import { ResponseProps } from "./api";
import { Service, SubService } from "./cart";

export type PlanSubscriptionDetail = {
  count: number;
  counter: number;
  endDate: EpochTimeStamp;
  id: number;
  period: number;
  planId: number;
  service: Service;
  serviceNameFa: string;
  startDate: EpochTimeStamp;
  subService: SubService;
  walletId: number;
};

export interface GetPlanSubscriptionsResponseProps extends ResponseProps {
  data: { subscriptions: PlanSubscriptionDetail[] };
}
