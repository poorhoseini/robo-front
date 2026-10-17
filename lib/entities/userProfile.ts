import { ResponseProps } from "./api";

export type UserProfile = {
  email: string;
  phoneNumber: string;
  personalData: {
    firstName: string;
    lastName: string;
    nationalCode: string;
    birthDate: string;
  };
  socialData: {};
  userId: string;
  _id: string;
};

export interface GetUserProfileResponseProps extends ResponseProps {
  userData: UserProfile;
}

export type PutUserProfileRequestProps = {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  birthDate?: string;
};

export type UserProfileFormProps = {
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  birthDate?: string;
};

export type SendUserEmailOTPRequestProps = {
  email: string;
};

export type SendUserEmailOTPFormProps = {
  email: string;
};

export type VerifyUserEmailRequestProps = {
  email: string;
  otp: string;
};

export type VerifyUserEmailFormProps = {
  otpDigit1: string;
  otpDigit2: string;
  otpDigit3: string;
  otpDigit4: string;
  otpDigit5: string;
};
