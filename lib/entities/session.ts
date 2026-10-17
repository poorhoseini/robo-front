import { ResponseProps } from "./api";

export type UserSessionDevice = "desktop" | "mobile" | "bot";
export type UserSessionBrowser =
  | "Chrome"
  | "Safari"
  | "Firefox"
  | "PostmanRuntime"
  | "Telegram";

export type UserSession = {
  browser: UserSessionBrowser;
  isActive: boolean;
  isCurrent: boolean;
  loginTime: EpochTimeStamp;
  sessionId: string;
  timeStampExp: EpochTimeStamp;
  _id: string;
};

export interface GetUserSessionsResponseProps extends ResponseProps {
  data: UserSession[];
}
