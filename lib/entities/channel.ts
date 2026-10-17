import { ResponseProps } from "./api";

export type ChannelPlatform = "telegram" | "bale";

export type Channel = {
  channelId: string;
  channelPlatform: ChannelPlatform;
  id: string;
  isActive: boolean;
  roboChannelId: string;
};

export interface GetMyChannelsResponseProps extends ResponseProps {
  data: {
    channelDatas: Channel[];
    channelIds: string[];
  };
}

export type GetMyChannelsRequestProps = {
  filters: string[];
};

export type PostChannelRequestProps = {
  channelId: string;
  channelPlatform: ChannelPlatform;
};

export type ChangeChannelActivationRequestProps = {
  telegramChannelIds: string[];
};

export interface GetMyAuthStringResponseProps extends ResponseProps {
  data: {
    string: string;
  };
}
