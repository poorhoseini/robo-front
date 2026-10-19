"use client";

import {
  Dialog,
  InputAdornment,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export type SingleSelectOption = {
  id: number | string;
  label: string;
  value: string;
};

type Props = {
  label: string;
  dialogTitle: string;
  dialogSubtitle?: string;
  listTitle?: string;
  options: SingleSelectOption[];
  value: string;
  onChange: (option: SingleSelectOption | null) => void;
  error?: boolean;
  disabled?: boolean;
  searchId?: string;
};

export default function SingleSelectFilterModal({
  label,
  dialogTitle,
  dialogSubtitle,
  listTitle,
  options,
  value,
  onChange,
  error = false,
  disabled = false,
  searchId = "single-select-search",
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((o) => o.value === value) || null;

  useEffect(() => {
    if (open) setSearch("");
  }, [open]);

  const handleSelect = (option: SingleSelectOption) => {
    if (option.value === value) {
      onChange(null);
    } else {
      onChange(option);
    }
    setOpen(false);
  };

  return (
    <>
      <TextField
        label={label}
        value={selectedOption ? selectedOption.label : ""}
        disabled={disabled}
        error={error}
        onClick={() => !disabled && setOpen(true)}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end" sx={{ pointerEvents: "none" }}>
              <svg
                className="h-6 w-6 shrink-0 fill-grey-700"
                focusable="false"
                aria-hidden="true"
                viewBox="0 0 24 24"
              >
                <path d="M7 10l5 5 5-5z" />
              </svg>
            </InputAdornment>
          ),
        }}
        sx={{
          width: "100%",
          cursor: disabled ? "not-allowed" : "pointer",
          "& .MuiInputBase-root": {
            cursor: disabled ? "not-allowed" : "pointer",
            height: "56px",
            backgroundColor: "white !important",
          },
          "& .MuiInputBase-input": {
            cursor: disabled ? "not-allowed" : "pointer",
          },
          "& .MuiInputAdornment-root": {
            cursor: disabled ? "not-allowed" : "pointer",
          },
        }}
      />

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{ sx: { width: "480px", overflow: "hidden" } }}
      >
        <div className="flex w-full flex-col items-center gap-4 overflow-hidden px-6">
          <div className="flex w-full flex-row items-center justify-between py-4">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-base font-medium text-grey">{dialogTitle}</h2>
              {dialogSubtitle && (
                <p className="text-sm font-normal text-grey-800">
                  {dialogSubtitle}
                </p>
              )}
            </div>
            <button type="button" onClick={() => setOpen(false)}>
              <Image
                src="/icons/icon-close.svg"
                alt="close modal"
                width={24}
                height={24}
              />
            </button>
          </div>

          <TextField
            size="small"
            id={searchId}
            placeholder="جستجو"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              width: "100%",
              backgroundColor: "#f8f9fb",
              borderRadius: "8px",
              fieldset: { border: "none" },
              height: "48px",
              "& .MuiInputBase-root": {
                height: "48px",
                pl: 0,
                pr: "10px",
              },
            }}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image
                    src="/icons/icon-magnifying-glass.svg"
                    alt="search"
                    width={16}
                    height={16}
                  />
                </InputAdornment>
              ),
            }}
          />

          {listTitle && (
            <h3 className="mt-2 w-full text-start text-base font-medium text-grey">
              {listTitle}
            </h3>
          )}

          <div className="w-full overflow-y-auto pb-4" style={{ maxHeight: "55vh" }}>
            {options
              .filter((option) => option.label.includes(search))
              .map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.id}
                    className="flex w-full flex-col items-center border-b border-grey-200 py-3"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelect(option)}
                      className="flex w-full flex-row items-center justify-between"
                    >
                      <p className={isSelected ? "font-medium text-grey" : "text-grey"}>
                        {option.label}
                      </p>
                      <div
                        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors ${
                          isSelected
                            ? "border-grey bg-grey"
                            : "border-grey-400 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            {options.filter((o) => o.label.includes(search)).length === 0 && (
              <p className="py-6 text-center text-sm text-grey-500">
                موردی یافت نشد
              </p>
            )}
          </div>
        </div>
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
