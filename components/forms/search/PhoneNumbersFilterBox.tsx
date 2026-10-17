import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { MenuItem, TextField } from "@mui/material";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { SearchFilterFormProps } from "./FiltersForm";
import { useRef, useState } from "react";
import {
  codeSelectOptions,
  preNumberSelectOptions,
} from "@/lib/constants/filters";

export default function PhoneNumbersFilterBox({
  control,
  setValue,
}: {
  control: Control<SearchFilterFormProps, any>;
 setValue: UseFormSetValue<SearchFilterFormProps>;
}) {
  const [codeOpen, setCodeOpen] = useState<boolean>(false);
  const codeRef = useRef<HTMLInputElement>(null);
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
        ? pastedText.slice(5, 11)
        : pastedText.length === 12 && pastedText.startsWith("98")
          ? pastedText.slice(6, 12)
          : pastedText;

    refinedText.split("").forEach((char, offset) => {
      const index = startIndex + offset;
      if (index < 6) {
        setValue(`digit${index + 1}` as keyof SearchFilterFormProps, char, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    });

    // focus/select the first empty input after the paste
    const nextIndex = Math.min(startIndex + refinedText.length, 5);
    digitRefs.current[nextIndex]?.select();
  };

  return (
    <>
      <div className="flex w-full flex-row-reverse items-center justify-between">
        <Controller
          control={control}
          name="preNumber"
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
              }}
              sx={{ width: "185px" }}
              variant="outlined"
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
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              size="small"
              id="code-select"
              select
              label="کد"
              value={value}
              onChange={(e) => {
                setTimeout(() => selectDigitInput(0), 0);
                onChange(e);
              }}
              inputRef={codeRef}
              SelectProps={{
                open: codeOpen,
                onClose: () => setCodeOpen(false),
                onOpen: () => setCodeOpen(true),
              }}
              sx={{ width: "80px" }}
              variant="outlined"
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
      <div className="flex w-full flex-row-reverse items-center justify-around">
        {Array.from({ length: 6 }, (_, i) => ({
          name: `digit${i + 1}` as keyof SearchFilterFormProps,
          index: i,
        })).map(({ name, index }) => (
          <Controller
            key={name}
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => (
              <TextField
                size="small"
                id={`${name}-input`}
                value={persianNumber(value)}
                onKeyDown={(e) => handleDigitKeyDown(e, index, value, onChange)}
                onChange={handleDigitChange(index, onChange)}
                onPaste={(e) => handlePaste(e, index)}
                inputRef={(el) => (digitRefs.current[index] = el)}
                sx={{ width: "40px" }}
                variant="outlined"
              />
            )}
          />
        ))}
      </div>
    </>
  );
}
