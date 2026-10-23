"use client";

import { Controller, useForm } from "react-hook-form";
import Space from "../general/Space";
import {
  GetUserProfileResponseProps,
  PutUserProfileRequestProps,
  UserProfile,
  UserProfileFormProps,
} from "@/lib/entities/userProfile";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseProps } from "@/lib/entities/api";
import editUserProfile from "@/lib/api/editUserProfile";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { Skeleton, TextField } from "@mui/material";
import CustomButton from "../general/CustomButton";
import getUserData from "@/lib/api/getUserData";
import JalaliDatePicker from "../general/JalaliDatePicker";
import moment from "moment-jalaali";
import UserProfileEmailSection from "./UserProfileEmailSection";
import { formatPhoneNumber } from "@/lib/helpers/persianNumber.helper";

export default function UserProfileFormSection() {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingUserEdit, setLoadingUserEdit] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<UserProfileFormProps>({
    defaultValues: {
      firstName: "",
      lastName: "",
      nationalCode: "",
      birthDate: "",
    },
  });

  useEffect(() => {
    if (!auth.token) return;

    handleFetchUserData();
  }, [auth.token]);

  async function handleFetchUserData() {
    setLoading(true);

    try {
      const userProfileResponse: GetUserProfileResponseProps =
        await getUserData(auth.token);
      setUserProfile(userProfileResponse.userData);
      userProfileResponse.userData?.personalData.firstName &&
        setValue(
          "firstName",
          userProfileResponse.userData.personalData.firstName,
        );
      userProfileResponse.userData?.personalData.lastName &&
        setValue(
          "lastName",
          userProfileResponse.userData.personalData.lastName,
        );
      userProfileResponse.userData?.personalData.nationalCode &&
        setValue(
          "nationalCode",
          userProfileResponse.userData.personalData.nationalCode,
        );
      userProfileResponse.userData?.personalData.birthDate &&
        setValue(
          "birthDate",
          userProfileResponse.userData.personalData.birthDate,
        );
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در دریافت اطلاعات کاربر");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleEditUserInfo(formData: UserProfileFormProps) {
    setLoadingUserEdit(true);

    const payload: PutUserProfileRequestProps = {
      ...(!!formData.firstName && { firstName: formData.firstName }),
      ...(!!formData.lastName && { lastName: formData.lastName }),
      ...(!!formData.nationalCode && { nationalCode: formData.nationalCode }),
      ...(!!formData.birthDate && { birthDate: formData.birthDate }),
    };

    try {
      const response: ResponseProps = await editUserProfile(
        payload,
        auth.token,
      );
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در به روز رسانی اطلاعات کاربر");
      }
    } finally {
      setLoadingUserEdit(false);
    }
  }

  if (loading)
    return (
      <div className="flex w-full flex-col items-center">
        <Skeleton variant="rounded" width="100%" height={142} />
        <Space value={24} />
        <Skeleton variant="rounded" width="100%" height={390} />
      </div>
    );

  return (
    <div className="flex w-full flex-col items-center">
      <UserProfileEmailSection currentUserEmail={userProfile?.email || ""} />
      <Space value={24} />
      <form
        onSubmit={handleSubmit(handleEditUserInfo)}
        className="flex w-full flex-col rounded-xl border border-grey-300 bg-white p-6"
      >
        <div className="flex w-full flex-row flex-nowrap gap-8">
          <div className="flex w-1/2 flex-col items-start">
            <h3 className="text-base font-medium leading-5 text-grey">نام</h3>
            <Space value={24} />
            <div className="w-full">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    size="medium"
                    value={value}
                    onChange={onChange}
                    sx={{ width: "100%" }}
                    variant="outlined"
                    error={!!errors?.firstName}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex w-1/2 flex-col items-start">
            <h3 className="text-base font-medium leading-5 text-grey">
              نام خانوادگی
            </h3>
            <Space value={24} />
            <div className="w-full">
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    size="medium"
                    value={value}
                    onChange={onChange}
                    sx={{ width: "100%" }}
                    variant="outlined"
                    error={!!errors?.lastName}
                  />
                )}
              />
            </div>
          </div>
        </div>
        <Space value={16} />
        <div className="flex w-full flex-row flex-nowrap gap-8">
          <div className="flex w-1/2 flex-col items-start">
            <h3 className="text-base font-medium leading-5 text-grey">کدملی</h3>
            <Space value={24} />
            <div className="w-full">
              <Controller
                name="nationalCode"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <TextField
                    size="medium"
                    value={value}
                    onChange={onChange}
                    sx={{ width: "100%" }}
                    variant="outlined"
                    error={!!errors?.nationalCode}
                  />
                )}
              />
            </div>
          </div>
          <div className="flex w-1/2 flex-col items-start">
            <h3 className="text-base font-medium leading-5 text-grey">
              شماره تماس
            </h3>
            <Space value={24} />
            <div className="w-full">
              <TextField
                disabled
                size="medium"
                value={formatPhoneNumber(userProfile?.phoneNumber || "")}
                sx={{ width: "100%" }}
                inputProps={{ className: "ltr text-start" }}
                variant="outlined"
              />
            </div>
          </div>
        </div>
        <Space value={24} />
        <div className="flex w-full flex-row flex-nowrap items-end gap-8">
          <div className="flex w-1/2 flex-col items-start">
            <h3 className="text-base font-medium leading-5 text-grey">
              تاریخ تولد
            </h3>
            <Space value={24} />
            <div className="w-full">
              <Controller
                name="birthDate"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <JalaliDatePicker
                    size="large"
                    label=""
                    value={
                      getValues("birthDate")
                        ? moment(getValues("birthDate"), "jYYYY-jM-jD")
                        : null
                    }
                    onChange={(value, context) => {
                      if (value && !context.validationError) {
                        onChange(value.format("jYYYY-jM-jD"));
                      } else {
                        onChange("");
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
          <div className="w-full max-w-[428px]">
            <CustomButton
              type="submit"
              label="تایید"
              loading={loadingUserEdit}
            />
          </div>
        </div>
      </form>
    </div>
  );
}
