import { ResponseProps } from "./api";

export type ChannelType = "roborond" | "personal";

export interface PreResendToChannelResponseProps extends ResponseProps {
  cartId: string;
}

export type PreResendToChannelRequestProps = {
  messageIds: string[];
};
