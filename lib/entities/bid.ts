import { RequestFilter, ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type Bid = {
  _id: string;
  bidPrice: number;
  createDate: EpochTimeStamp;
  highBidData: {
    expireDate: EpochTimeStamp;
    serviceType: ServiceType;
    simcardId: string;
  };
  userData: {
    phoneNumber: string | null;
  };
  visibleAt: EpochTimeStamp;
};

export interface GetSimBidsResponseProps extends ResponseProps {
  data: Bid[];
}

export type GetSimBidsRequestProps = {
  limit: number;
  filters: RequestFilter[];
  sort: {
    field: string;
    order: number;
  };
  mode: "customer" | "my";
  skip: number;
};
