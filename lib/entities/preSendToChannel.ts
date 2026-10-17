import { ResponseProps } from "./api";
import { ServiceType } from "./landingPage";

export type ChannelType = "roborond" | "personal";

export interface PreSendToChannelResponseProps extends ResponseProps {
  cartId: string;
}

export type PreSendToChannelRequestProps = {
  refrenceIds: string[];
  refrence: ServiceType;
  channelType: ChannelType;
  channelIds?: string[];
};
