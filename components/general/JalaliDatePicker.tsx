"use client";

import {
  DatePicker,
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";
import { Moment } from "moment";

export default function JalaliDatePicker({
  size = "medium",
  label,
  value,
  onChange,
  errorMessage,
}: {
  size?: "large" | "medium" | "small";
  label: string;
  value: Moment | null | undefined;
  onChange:
    | ((
        value: Moment | null,
        context: PickerChangeHandlerContext<DateValidationError>,
      ) => void)
    | undefined;
  errorMessage?: string;
}) {
  return (
    <div className="flex w-full flex-col items-start">
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        sx={{
          "& input": { height: "20%" },
          "&.MuiFormControl-root": { width: "100%" },
          ...(size === "large" && {
            "& .MuiInputBase-root": { height: "56px" },
          }),
          ...(size === "medium" && {
            "& .MuiInputBase-root": { height: "48px" },
          }),
          ...(size === "small" && {
            "& .MuiInputBase-root": { height: "40px" },
            "& .MuiFormLabel-root": { top: "-5px" },
          }),
          ...(errorMessage && {
            "& .MuiInputBase-root": {
              "&:hover": {
                "& fieldset": {
                  borderColor: "#F24E49",
                },
              },
              "& fieldset": {
                borderColor: "#F24E49",
              },
            },
          }),
          ...(errorMessage && { "& label": { color: "#F24E49" } }),
          ...(errorMessage && { "& svg": { color: "#F24E49" } }),
        }}
      />
      {!!errorMessage && (
        <span className="mx-[14px] mb-[17px] w-full text-start text-[10px] font-normal leading-[13px] text-error">
          {errorMessage || "\xa0"}
        </span>
      )}
    </div>
  );
}
