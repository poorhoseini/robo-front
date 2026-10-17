"use client";

import { Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { SearchFilterFormProps } from "./FiltersForm";

export default function HasDiscountFilterSwitch({
  defaultValue,
  control,
  setValue,
}: {
  defaultValue: string;
  control: Control<SearchFilterFormProps, any>;
  setValue: UseFormSetValue<SearchFilterFormProps>;
}) {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setValue("hasDiscount", event.target.checked.toString());
      setSelectedValue(event.target.checked.toString());
    } else {
      setValue("hasDiscount", "");
      setSelectedValue("");
    }
  };

  return (
    <>
      <div className="hidden">
        <Controller
          control={control}
          name="hasDiscount"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <div className="flex h-14 w-full flex-row items-center justify-between border-t border-grey-200 text-sm font-normal text-grey">
        <h3>فقط تخفیف دارها</h3>
        <Switch checked={selectedValue === "true"} onChange={handleChange} />
      </div>
    </>
  );
}
