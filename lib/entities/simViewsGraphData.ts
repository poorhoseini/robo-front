import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type IntervalData = {
  _id: {
    range: number;
  };
  count: number;
  endOfRange: Date;
  endOfRangeTimestamp: EpochTimeStamp;
  startOfRange: Date;
  startOfRangeTimestamp: EpochTimeStamp;
};

export type GraphData = {
  graphDatas: IntervalData[];
  hasViewCount: number;
  interval: EpochTimeStamp;
  intervalCount: number;
  rangeStart: EpochTimeStamp;
  sumCount: number;
};

export interface SimViewsGraphDataResponseProps extends ResponseProps {
  data: GraphData;
}

export type SimViewsGraphDataRequestProps = {
  refrenceId: string;
  refrence: ServiceType;
};
