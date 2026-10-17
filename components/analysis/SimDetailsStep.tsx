import {
  codeSelectOptions,
  preNumberSelectOptions,
} from "@/lib/constants/filters";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  useAnalysisActions,
  useAnalysisType,
  useCode,
  useDigit10,
  useDigit11,
  useDigit6,
  useDigit7,
  useDigit8,
  useDigit9,
  usePreNumber,
  useSimcardState,
  useSimcardType,
} from "@/lib/zustand/analysis";
import { MenuItem, TextField } from "@mui/material";
import { useContext, useRef, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import Space from "../general/Space";
import CustomButton from "../general/CustomButton";
import { toast } from "react-toastify";
import { ResponseError } from "@/lib/api/error";
import Image from "next/image";
import {
  PrePredictByExpertSimRequestProps,
  PrePredictSimRequestProps,
  PrePredictSimResponseProps,
} from "@/lib/entities/prePredictSim";
import prePredictSim from "@/lib/api/prePredictSim";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import CartModal from "../cart/CartModal";
import prePredictByExpertSim from "@/lib/api/prePredictByExpertSim";

type AnalysisFormProps = {
  step: number;
  preNumber: string;
  code: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  digit10: string;
  digit11: string;
  simcardState: string;
  simcardType: string;
};

export default function SimDetailsStep() {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const analysisType = useAnalysisType();
  const preNumber = usePreNumber();
  const code = useCode();
  const digit6 = useDigit6();
  const digit7 = useDigit7();
  const digit8 = useDigit8();
  const digit9 = useDigit9();
  const digit10 = useDigit10();
  const digit11 = useDigit11();
  const simcardState = useSimcardState();
  const simcardType = useSimcardType();
  const {
    setPreNumber,
    setCode,
    setDigit6,
    setDigit7,
    setDigit8,
    setDigit9,
    setDigit10,
    setDigit11,
  } = useAnalysisActions();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AnalysisFormProps>({
    defaultValues: {
      preNumber: preNumber,
      code: code,
      digit6: digit6,
      digit7: digit7,
      digit8: digit8,
      digit9: digit9,
      digit10: digit10,
      digit11: digit11,
      simcardState: simcardState,
      simcardType: simcardType,
    },
  });

  const phoneNumber =
    "09" +
    preNumber +
    code +
    digit6 +
    digit7 +
    digit8 +
    digit9 +
    digit10 +
    digit11;

  const [codeOpen, setCodeOpen] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  const digit6Ref = useRef<HTMLInputElement>(null);
  const digit7Ref = useRef<HTMLInputElement>(null);
  const digit8Ref = useRef<HTMLInputElement>(null);
  const digit9Ref = useRef<HTMLInputElement>(null);
  const digit10Ref = useRef<HTMLInputElement>(null);
  const digit11Ref = useRef<HTMLInputElement>(null);

  const handleSubmitPredict = async (values: AnalysisFormProps) => {
    setLoading(true);

    const payload: PrePredictSimRequestProps = {
      simcards: [
        {
          phoneNumber: phoneNumber,
          state: Number(simcardState),
          type: Number(simcardType),
        },
      ],
    };

    try {
      const response: PrePredictSimResponseProps = await prePredictSim(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در تحمین قیمت سیم کارت");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPredictByExpert = async (values: AnalysisFormProps) => {
    setLoading(true);

    const payload: PrePredictByExpertSimRequestProps = {
      phoneNumber: phoneNumber,
      state: Number(simcardState),
      type: Number(simcardType),
    };

    try {
      const response: PrePredictSimResponseProps = await prePredictByExpertSim(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در تحمین قیمت سیم کارت توسط کارشناس");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-start justify-center">
      <div className="flex w-full flex-row items-center justify-start gap-8 rounded-2xl border border-grey-200 bg-white px-6 py-4">
        <Image src="/icons/robot.png" alt="" width={92} height={160} />
        <div className="flex w-full items-center justify-center rounded-lg bg-biege-200 p-4 text-base font-medium leading-7 text-grey">
          {analysisType === "ai"
            ? "هوش مصنوعی روبوروند می‌تواند تخمین قیمت حدودی سیم کارت شما را بالاترین دقت ممکن انجام دهد و سیم کارت‌های مشابه در رنج قیمتی سیم کارت شما را به شما نمایش دهد."
            : analysisType === "expert"
              ? "کارشناسان روبوروند می‌توانند تخمین قیمت دقیق سیم کارت شما را بالاترین دقت ممکن انجام دهد و سیم کارت‌های مشابه در رنج قیمتی سیم کارت شما را به شما نمایش دهد."
              : "نامشخص"}
        </div>
      </div>
      <Space value={16} />
      <form
        onSubmit={handleSubmit(
          analysisType === "ai"
            ? handleSubmitPredict
            : handleSubmitPredictByExpert,
        )}
        className="flex w-full flex-col items-start justify-center rounded-2xl border border-grey-200 bg-white px-6 py-4"
      >
        <p className="text-base font-medium text-grey">مشخصات شماره:</p>
        <Space value={16} />
        <div className="ltr flex w-full flex-row items-center justify-between gap-6">
          <div className="flex flex-row items-center justify-start gap-4">
            <Controller
              name="preNumber"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="pre-number-select"
                  select
                  label="پیش شماره"
                  value={value}
                  onChange={(e) => {
                    setCodeOpen(true);
                    onChange(e);
                    setPreNumber(e.target.value);
                  }}
                  sx={{ width: "185px" }}
                  variant="outlined"
                  error={!!errors?.preNumber}
                >
                  {preNumberSelectOptions.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {persianNumber(option.label)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              name="code"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="code-select"
                  select
                  label="کد"
                  value={value}
                  onChange={(e) => {
                    setTimeout(() => digit6Ref.current?.focus(), 0);
                    onChange(e);
                    setCode(e.target.value);
                  }}
                  inputRef={codeRef}
                  SelectProps={{
                    open: codeOpen,
                    onClose: () => setCodeOpen(false),
                    onOpen: () => setCodeOpen(true),
                  }}
                  sx={{ width: "80px" }}
                  variant="outlined"
                  error={!!errors?.code}
                >
                  {codeSelectOptions.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {persianNumber(option.label)}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </div>
          <div className="flex flex-row items-center justify-end gap-3">
            <Controller
              name="digit6"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="digit6-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit6Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit6Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit6Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit6Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit7Ref.current?.select(), 0);
                      onChange(e);
                      setDigit6(e.target.value);
                    }
                  }}
                  inputRef={digit6Ref}
                  sx={{ width: "40px" }}
                  variant="outlined"
                  error={!!errors?.digit6}
                />
              )}
            />
            <Controller
              name="digit7"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="digit7-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit7Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit7Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit6Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit7Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit8Ref.current?.select(), 0);
                      onChange(e);
                      setDigit7(e.target.value);
                    }
                  }}
                  inputRef={digit7Ref}
                  sx={{ width: "40px" }}
                  variant="outlined"
                  error={!!errors?.digit7}
                />
              )}
            />
            <Controller
              name="digit8"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="digit8-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit8Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit8Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit7Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit8Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value && setTimeout(() => digit9Ref.current?.select(), 0);
                      onChange(e);
                      setDigit8(e.target.value);
                    }
                  }}
                  inputRef={digit8Ref}
                  sx={{ width: "40px" }}
                  variant="outlined"
                  error={!!errors?.digit8}
                />
              )}
            />
            <Controller
              name="digit9"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="digit9-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit9Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit9Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit8Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit9Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value &&
                        setTimeout(() => digit10Ref.current?.select(), 0);
                      onChange(e);
                      setDigit9(e.target.value);
                    }
                  }}
                  inputRef={digit9Ref}
                  sx={{ width: "40px" }}
                  variant="outlined"
                  error={!!errors?.digit9}
                />
              )}
            />
            <Controller
              name="digit10"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="digit10-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit10Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit10Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit9Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit10Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      value &&
                        setTimeout(() => digit11Ref.current?.select(), 0);
                      onChange(e);
                      setDigit10(e.target.value);
                    }
                  }}
                  inputRef={digit10Ref}
                  sx={{ width: "40px" }}
                  variant="outlined"
                  error={!!errors?.digit10}
                />
              )}
            />
            <Controller
              name="digit11"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  size="small"
                  id="digit11-input"
                  value={persianNumber(value)}
                  onFocus={(e) => {
                    setTimeout(() => digit11Ref.current?.select(), 0);
                  }}
                  onClick={(e) => {
                    setTimeout(() => digit11Ref.current?.select(), 0);
                  }}
                  onKeyDown={(e) => {
                    const keyCode = e.key;
                    if (keyCode === "Backspace") {
                      setTimeout(() => digit10Ref.current?.select(), 0);
                    } else {
                      setTimeout(() => digit11Ref.current?.select(), 0);
                    }
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (!Number.isNaN(Number(value))) {
                      // value && setTimeout(() => digit7Ref.current?.select(), 0);
                      onChange(e);
                      setDigit11(e.target.value);
                    }
                  }}
                  inputRef={digit11Ref}
                  sx={{ width: "40px" }}
                  variant="outlined"
                  error={!!errors?.digit11}
                />
              )}
            />
          </div>
        </div>
        <Space value={24} />
        <p className="text-base font-medium text-grey">وضعیت سیم کارت:</p>
        <Space value={16} />
        <SimCardStateSelector
          control={control}
          error={!!errors?.simcardState}
        />
        <Space value={24} />
        <p className="text-base font-medium text-grey">نوع سیم کارت:</p>
        <Space value={16} />
        <SimCardTypeSelector control={control} error={!!errors?.simcardType} />
        <Space value={24} />
        <div className="w-full max-w-[375px]">
          <CustomButton
            type="submit"
            loading={loading}
            label="تایید"
            disabled={loading}
          />
        </div>
      </form>
      {!!cartId && <CartModal cartId={cartId} />}
    </div>
  );
}

function SimCardStateSelector({
  control,
  error,
}: {
  control: Control<AnalysisFormProps, any>;
  error: boolean;
}) {
  const { setSimcardState } = useAnalysisActions();

  return (
    <Controller
      control={control}
      name="simcardState"
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex h-14 w-full flex-row items-center justify-start gap-4">
          <button
            type="button"
            onClick={() => {
              setSimcardState("0");
              onChange("0");
            }}
            className={`flex h-full w-full max-w-[180px] items-center justify-center rounded-md border text-base font-normal ${error ? "border-error text-error" : value === "0" ? "bg-grey text-white" : "border-grey-200 text-grey"}`}
          >
            نو
          </button>
          <button
            type="button"
            onClick={() => {
              setSimcardState("1");
              onChange("1");
            }}
            className={`flex h-full w-full max-w-[180px] items-center justify-center rounded-md border text-base font-normal ${error ? "border-error text-error" : value === "1" ? "bg-grey text-white" : "border-grey-200 text-grey"}`}
          >
            کارکرده
          </button>
        </div>
      )}
    />
  );
}

function SimCardTypeSelector({
  control,
  error,
}: {
  control: Control<AnalysisFormProps, any>;
  error: boolean;
}) {
  const { setSimcardType } = useAnalysisActions();

  return (
    <Controller
      control={control}
      name="simcardType"
      rules={{ required: true }}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <div className="flex h-14 w-full flex-row items-center justify-start gap-4">
          <button
            type="button"
            onClick={() => {
              setSimcardType("0");
              onChange("0");
            }}
            className={`flex h-full w-full max-w-[180px] items-center justify-center rounded-md border text-base font-normal ${error ? "border-error text-error" : value === "0" ? "bg-grey text-white" : "border-grey-200 text-grey"}`}
          >
            دائمی
          </button>
          <button
            type="button"
            onClick={() => {
              setSimcardType("1");
              onChange("1");
            }}
            className={`flex h-full w-full max-w-[180px] items-center justify-center rounded-md border text-base font-normal ${error ? "border-error text-error" : value === "1" ? "bg-grey text-white" : "border-grey-200 text-grey"}`}
          >
            اعتباری
          </button>
        </div>
      )}
    />
  );
}
