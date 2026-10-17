import { ResponseProps } from "./api";

export type Auth = {
  _id: string;
  detail: {};
  name: string;
  phoneNumber: string;
  token: string;
  userId: string;
};

export type Otp = {
  code: number;
  waiting: number;
};

export interface CheckOtpResponseProps extends ResponseProps {
  data: Auth;
}

export type CheckOtpRequestProps = {
  phoneNumber?: string;
  email?: string;
  code: number;
};

export type CheckOtpFormProps = {
  otpDigit1: string;
  otpDigit2: string;
  otpDigit3: string;
  otpDigit4: string;
  otpDigit5: string;
};

export interface SendOtpResponseProps extends ResponseProps {
  data: Otp;
}

export type SendOtpRequestProps = {
  phoneNumber?: string;
  email?: string;
  interface: "web" | "other";
};

export type SendOtpFormProps = {
  phoneNumber?: string;
  email?: string;
};
