"use client";

import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  Button,
  MenuItem,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useType,
  useStatus,
  useAddSimPackActions,
  useSavedItems,
  useDigits,
} from "@/lib/zustand/addSimPack";
import ApproveSimPackItemsButton from "./ApproveSimPackItemsButton";
import CustomNumberTextField from "@/components/general/CustomNumberTextField";
import {
  simcardStateSelectOptions,
  simcardTypeSelectOptions,
} from "@/lib/constants/selectOptions/simcard";
import CustomSelector from "@/components/general/CustomSelector";
import AddSimpackNumbersListModal from "./AddSimpackNumbersListModal";

type AddSimCardNumberFormProps = {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  type: string;
  status: string;
};

export default function AddSimPackNumberStep() {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const digits = useDigits();
  const digitsArray = Array.from({ length: 9 }, (_, i) => digits?.[i] ?? "");
  const type = useType();
  const status = useStatus();
  const savedItems = useSavedItems();
  const { setDigits, setType, setStatus, saveCurrentItem, flush } =
    useAddSimPackActions();
  const [openSimcardList, setOpenSimcardList] = useState(false);
  const handleOpenSimcardList = () => {
    setOpenSimcardList(true);
  };
  const handleCloseSimcardList = () => {
    setOpenSimcardList(false);
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AddSimCardNumberFormProps>({
    defaultValues: {
      digit1: digitsArray[0],
      digit2: digitsArray[1],
      digit3: digitsArray[2],
      digit4: digitsArray[3],
      digit5: digitsArray[4],
      digit6: digitsArray[5],
      digit7: digitsArray[6],
      digit8: digitsArray[7],
      digit9: digitsArray[8],
      type: type,
      status: status,
    },
  });

  const digitRefs = useRef<Array<HTMLInputElement | null>>([]);

  const selectDigitInput = (index: number) => {
    digitRefs.current[index]?.select();
  };

  const handleDigitKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    index: number,
    value: string | undefined,
    onChange: (...event: any[]) => void,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      // 1️⃣ Clear current cell
      if (value) {
        onChange({ target: { value: "" } });
      }

      // 2️⃣ Move to previous cell (if exists)
      if (index > 0) {
        selectDigitInput(index - 1);
      } else {
        selectDigitInput(index);
      }
    }
  };

  const handleDigitChange =
    (index: number, onChange: (...event: any[]) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (Number.isNaN(Number(value))) return;

      const char = value.slice(-1); // 🔒 enforce 1 char

      onChange({ target: { value: char } });

      if (char && index < digitRefs.current.length - 1) {
        selectDigitInput(index + 1);
      }
    };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLDivElement>,
    startIndex: number,
  ) => {
    e.preventDefault();

    const pastedText = e.clipboardData.getData("text").replace(/\D/g, ""); // digits only

    if (!pastedText) return;
    const refinedText =
      pastedText.length === 11 && pastedText.startsWith("09")
        ? pastedText.slice(2, 11)
        : pastedText.length === 12 && pastedText.startsWith("98")
          ? pastedText.slice(3, 12)
          : pastedText;

    refinedText.split("").forEach((char, offset) => {
      const index = startIndex + offset;
      if (index < 9) {
        setValue(`digit${index + 1}` as keyof AddSimCardNumberFormProps, char, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    // focus/select the first empty input after the paste
    const nextIndex = Math.min(startIndex + refinedText.length, 8);
    digitRefs.current[nextIndex]?.select();
  };

  const handleSubmitSimCardNumber = (values: AddSimCardNumberFormProps) => {
    const formDigits = [
      values.digit1,
      values.digit2,
      values.digit3,
      values.digit4,
      values.digit5,
      values.digit6,
      values.digit7,
      values.digit8,
      values.digit9,
    ].join("");

    if (formDigits.length !== 9) {
      return; // validation guard
    }

    setDigits(formDigits);
    setType(values.type);
    setStatus(values.status);

    saveCurrentItem();
    flush();
    reset();

    if (fullScreen) {
      handleOpenSimcardList();
      return;
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleSubmitSimCardNumber)}
      className="flex h-full w-full flex-col items-center justify-between"
    >
      <div className="flex w-full flex-col items-start gap-8">
        <p className="text-base font-medium text-grey">
          شماره مورد نظر خود را وارد کنید
        </p>
        <div className="flex w-full flex-col items-start gap-6 pb-[104px] md:pb-0">
          <div className="flex w-full flex-row-reverse items-center justify-between">
            <div className="h-[30px] w-[30px] md:h-12 md:w-12">
              <CustomNumberTextField disabled value={persianNumber("09")} />
            </div>
            {Array.from({ length: 9 }, (_, i) => ({
              name: `digit${i + 1}` as keyof AddSimCardNumberFormProps,
              index: i,
            })).map(({ name, index }) => (
              <Controller
                key={name}
                control={control}
                name={name}
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <div className="h-[30px] w-[30px] md:h-12 md:w-12">
                    <CustomNumberTextField
                      id={`${name}-input`}
                      value={persianNumber(value)}
                      error={!!errors[name]}
                      inputRef={(el) => (digitRefs.current[index] = el)}
                      onKeyDown={(e) =>
                        handleDigitKeyDown(e, index, value, onChange)
                      }
                      onChange={handleDigitChange(index, onChange)}
                      onPaste={(e) => handlePaste(e, index)}
                    />
                  </div>
                )}
              />
            ))}
          </div>
          <div className="flex w-full flex-col items-start gap-4">
            <p className="text-base font-medium text-grey">شرایط سیم کارت:</p>
            <Controller
              control={control}
              name="type"
              rules={{ required: true }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <CustomSelector
                  options={simcardTypeSelectOptions}
                  value={value}
                  error={!!error}
                  onChange={onChange}
                />
              )}
            />
            <div className="h-[56px] w-full md:w-[375px]">
              <Controller
                control={control}
                name="status"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextField
                    id="pre-number-select"
                    select
                    label="وضعیت سیم کارت"
                    defaultValue=""
                    value={value}
                    onChange={(e) => {
                      onChange(e);
                      setStatus(e.target.value);
                    }}
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      "& .MuiInputBase-root": {
                        height: "100%",
                      },
                    }}
                    variant="outlined"
                    error={!!errors.status}
                  >
                    {simcardStateSelectOptions.map((option) => (
                      <MenuItem key={option.id} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </div>
          </div>
          <div className="hidden w-full md:flex">
            <Button
              type="submit"
              variant="outlined"
              size="large"
              startIcon={
                <Image
                  src="/icons/icon-plus-black.svg"
                  alt=""
                  width={24}
                  height={24}
                />
              }
              sx={{ height: "48px", backgroundColor: "white" }}
            >
              <p className="text-[17px] font-bold leading-6 text-grey">
                اضافه کردن
              </p>
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 flex h-20 w-full flex-row items-center justify-center gap-4 border-t border-grey-100 bg-white p-4 md:hidden">
            <button
              type="submit"
              className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border-[1.4px] border-grey bg-white text-[17px] font-bold`}
            >
              اضافه کردن
            </button>
            <ApproveSimPackItemsButton count={savedItems.length} />
          </div>
        </div>
      </div>
      <AddSimpackNumbersListModal
        open={openSimcardList}
        handleClose={handleCloseSimcardList}
      />
    </form>
  );
}
