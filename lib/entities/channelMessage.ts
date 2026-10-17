import { RequestFilter, ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type ChannelMessageState =
  | "در صف انتشار"
  | " با موفقیت ارسال شد "
  | " ارسال ناموفق ";

export type ChannelMessage = {
  _id: string;
  desc: string;
  isSent: boolean;
  message: string;
  refrence: ServiceType;
  refrenceId: string;
  roboChannelId: null;
  sentDate: EpochTimeStamp;
  state: ChannelMessageState;
  url?: string;
  userId: string;
};

export interface GetMyChannelMessagesResponseProps extends ResponseProps {
  data: ChannelMessage[];
}

export type GetMyChannelMessagesRequestProps = {
  filters: RequestFilter[];
};
