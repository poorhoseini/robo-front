"use client";

import {
  AddInstallmentPlanFormProps,
  AddInstallmentPlanRequestProps,
  AddInstallmentPlanResponseProps,
} from "@/lib/entities/installment";
import { englishNumber } from "@/lib/helpers/persianNumber.helper";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  Slide,
  Switch,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { TouchEvent, useContext, useState } from "react";
import {
  Control,
  Controller,
  UseFormSetValue,
  UseFormTrigger,
  useForm,
} from "react-hook-form";
import { installmentPlanMonthOptions } from "@/lib/constants/other";
import { numberInputRegex } from "@/lib/helpers/regex";
import addInstallmentPlans from "@/lib/api/addInstallmentPlan";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";

export default function AddInstallmentPlanModal({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const { resetAuth, auth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<AddInstallmentPlanFormProps>({
    defaultValues: {
      maximumMonth: "",
      minimumMonth: "",
      preFound: "",
      profitPercent: "",
      isDefault: false,
      applyToAll: false,
    },
  });

  const handleAddInstallemntPlan = async (val: AddInstallmentPlanFormProps) => {
    setLoading(true);
    const payload: AddInstallmentPlanRequestProps = {
      applyToAll: val.applyToAll,
      isDefault: val.isDefault,
      minimumMonth: Number(val.minimumMonth),
      maximumMonth: Number(val.maximumMonth),
      preFound: Number(englishNumber(val.preFound)),
      profitPercent: Number(englishNumber(val.profitPercent)),
    };

    try {
      const response: AddInstallmentPlanResponseProps =
        await addInstallmentPlans(auth.token, payload);
      onSuccess();
      handleClose();
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
        toast.error("در ثبت پلن اقساطی خطایی رخ داده است");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <button
        type="button"
        className="flex flex-row items-center gap-2"
        onClick={handleOpen}
      >
        <Image
          src="/icons/icon-plus-blue.svg"
          alt="Add New Installment Plan"
          width={24}
          height={24}
        />
        <p className="text-sm font-medium leading-normal text-blue">قسط جدید</p>
      </button>
      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "484px",
            maxWidth: "484px",
            ...(!fullScreen && { height: "680px" }),
            ...(fullScreen && { paddingBottom: "104px" }),
            borderRadius: "16px",
          },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-8 pt-6"
        >
          <h1 className="text-base font-medium leading-6 text-grey">
            شرایط قسط جدید
          </h1>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent sx={{ p: fullScreen ? "24px" : "32px", pt: "52px" }}>
          <form
            className="flex w-full flex-col items-center gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(handleAddInstallemntPlan)();
            }}
          >
            <h2 className="w-full text-start text-sm font-normal leading-5 text-grey md:text-base md:font-medium">
              شرایط اقساط خود را مشخص کنید
            </h2>
            <Controller
              control={control}
              name="applyToAll"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <div className="flex h-14 w-full flex-row items-center justify-between rounded-lg border border-grey-200 p-3 text-sm font-normal text-grey">
                  <div className="hidden">
                    <TextField />
                  </div>
                  <h3>اعمال روی تمامی سیم کارت ها</h3>
                  <Switch checked={value} onChange={onChange} />
                </div>
              )}
            />
            <Controller
              control={control}
              name="isDefault"
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <div className="flex h-14 w-full flex-row items-center justify-between rounded-lg border border-grey-200 p-3 text-sm font-normal text-grey">
                  <div className="hidden">
                    <TextField />
                  </div>
                  <h3>انتخاب به عنوان پیش فرض</h3>
                  <Switch checked={value} onChange={onChange} />
                </div>
              )}
            />
            <MinimumMonthAccordionInput
              control={control}
              setValue={setValue}
              trigger={trigger}
              error={!!errors.minimumMonth}
            />
            <MaximumMonthAccordionInput
              control={control}
              setValue={setValue}
              trigger={trigger}
              error={!!errors.maximumMonth}
            />
            <div className="flex w-full flex-col items-start gap-1">
              <div className="h-[56px] w-full">
                <Controller
                  control={control}
                  name="preFound"
                  rules={{
                    validate: {
                      required: (value) => {
                        if (!value) return "پیش پرداخت اجباری می باشد";
                      },
                      range: (value) => {
                        if (
                          Number(englishNumber(value.replaceAll("٬", ""))) < 10
                        )
                          return `حداقل ۱۰ درصد`;
                        if (
                          Number(englishNumber(value.replaceAll("٬", ""))) > 90
                        )
                          return `حداکثر ۹۰ درصد`;
                      },
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="preFound"
                      label="پیش پرداخت"
                      value={value}
                      onChange={(e) => {
                        const lastCharacter = e.target.value.slice(-1);
                        if (!numberInputRegex.test(lastCharacter)) return;

                        const result = Number(
                          englishNumber(e.target.value.replaceAll("٬", "")),
                        ).toLocaleString("fa-ir");

                        onChange(result === "۰" ? "" : result);
                      }}
                      error={!!errors.preFound}
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                      variant="outlined"
                      inputProps={{ inputMode: "numeric" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{ "& p": { fontSize: 12, fontWeight: 500 } }}
                          >
                            درصد
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
              <span className="text-[10px] font-light leading-3 text-error">
                {errors.preFound?.message}
              </span>
            </div>
            <div className="flex w-full flex-col items-start gap-1">
              <div className="h-[56px] w-full">
                <Controller
                  control={control}
                  name="profitPercent"
                  rules={{
                    validate: {
                      required: (value) => {
                        if (!value) return "سود اجباری می باشد";
                      },
                      range: (value) => {
                        if (
                          Number(englishNumber(value.replaceAll("٬", ""))) < 0
                        )
                          return `حداقل ۰ درصد`;
                        if (
                          Number(englishNumber(value.replaceAll("٬", ""))) > 10
                        )
                          return `حداکثر ۱۰ درصد`;
                      },
                    },
                  }}
                  render={({ field: { onChange, onBlur, value, ref } }) => (
                    <TextField
                      id="profitPercent"
                      label="سود"
                      value={value}
                      onChange={(e) => {
                        const lastCharacter = e.target.value.slice(-1);
                        if (!numberInputRegex.test(lastCharacter)) return;

                        const result = Number(
                          englishNumber(e.target.value.replaceAll("٬", "")),
                        ).toLocaleString("fa-ir");

                        onChange(result === "۰" ? "" : result);
                      }}
                      error={!!errors.profitPercent}
                      sx={{
                        width: "100%",
                        height: "100%",
                      }}
                      variant="outlined"
                      inputProps={{ inputMode: "numeric" }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment
                            position="end"
                            sx={{ "& p": { fontSize: 12, fontWeight: 500 } }}
                          >
                            درصد
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              </div>
              <span className="text-[10px] font-light leading-3 text-error">
                {errors.profitPercent?.message}
              </span>
            </div>
            <div className="hidden w-full md:flex">
              <button
                className="flex h-12 w-full items-center justify-center rounded-lg bg-grey p-4"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <p className="text-sm font-medium leading-5 text-white">
                    تایید
                  </p>
                )}
              </button>
            </div>
            <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
              <button
                className="flex h-12 w-full items-center justify-center rounded-lg bg-grey p-3"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <p className="text-sm font-medium leading-5 text-white">
                    ایجاد پلن اقساطی جدید
                  </p>
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function MinimumMonthAccordionInput({
  error,
  control,
  setValue,
  trigger,
}: {
  error: boolean;
  control: Control<AddInstallmentPlanFormProps, any>;
  setValue: UseFormSetValue<AddInstallmentPlanFormProps>;
  trigger: UseFormTrigger<AddInstallmentPlanFormProps>;
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (newVal: string) => {
    setValue("minimumMonth", newVal);
    setSelectedValue(newVal);
    trigger("minimumMonth");
  };

  return (
    <>
      <div className="hidden">
        <Controller
          control={control}
          name="minimumMonth"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <Accordion
        disableGutters
        expanded={open}
        onChange={() => setOpen((prev) => !prev)}
        sx={{
          width: "100%",
          minHeight: 56,
          boxShadow: "none",
          color: "#404040",
          fontSize: 14,
          fontWeight: 400,
          border: "1px solid #D9D9D9",
          borderColor: error ? "#F44336" : "D9D9D9",
          borderRadius: "8px",
          px: "16px",
          "&:before": { opacity: "0 !important" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <Image
              src="/icons/icon-chevron-down.svg"
              alt=""
              width={16}
              height={17}
            />
          }
          sx={{ p: 0 }}
        >
          <div className="flex flex-row items-center justify-start gap-2">
            <h3
              className={`text-sm font-normal ${error ? "text-error" : "text-grey"}`}
            >
              حداقل دوره بازپرداخت
            </h3>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-4 gap-y-[10px] text-sm font-medium leading-5 text-grey">
            {installmentPlanMonthOptions.map((item, index) => (
              <button
                type="button"
                key={index}
                className={`flex h-10 w-[117px] items-center justify-center rounded-md border border-grey-200 py-[6px] text-grey ${selectedValue === item.value ? "bg-biege-100" : ""}`}
                onClick={() => handleChange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function MaximumMonthAccordionInput({
  control,
  setValue,
  error,
  trigger,
}: {
  control: Control<AddInstallmentPlanFormProps, any>;
  setValue: UseFormSetValue<AddInstallmentPlanFormProps>;
  error: boolean;
  trigger: UseFormTrigger<AddInstallmentPlanFormProps>;
}) {
  const [selectedValue, setSelectedValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleChange = (newVal: string) => {
    setValue("maximumMonth", newVal);
    setSelectedValue(newVal);
    trigger("maximumMonth");
  };

  return (
    <>
      <div className="hidden">
        <Controller
          control={control}
          name="maximumMonth"
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <Accordion
        disableGutters
        expanded={open}
        onChange={() => setOpen((prev) => !prev)}
        sx={{
          width: "100%",
          minHeight: 56,
          boxShadow: "none",
          color: "#404040",
          fontSize: 14,
          fontWeight: 400,
          border: "1px solid #D9D9D9",
          borderColor: error ? "#F44336" : "D9D9D9",
          borderRadius: "8px",
          px: "16px",
          "&:before": { opacity: "0 !important" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <Image
              src="/icons/icon-chevron-down.svg"
              alt=""
              width={16}
              height={17}
            />
          }
          sx={{ p: 0 }}
        >
          <div className="flex flex-row items-center justify-start gap-2">
            <h3
              className={`text-sm font-normal ${error ? "text-error" : "text-grey"}`}
            >
              حداکثر دوره بازه پرداخت
            </h3>
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <div className="flex w-full flex-row flex-wrap items-center justify-center gap-x-4 gap-y-[10px] text-sm font-medium leading-5 text-grey">
            {installmentPlanMonthOptions.map((item, index) => (
              <button
                type="button"
                key={index}
                className={`flex h-10 w-[117px] items-center justify-center rounded-md border border-grey-200 py-[6px] text-grey ${selectedValue === item.value ? "bg-biege-100" : ""}`}
                onClick={() => handleChange(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}
