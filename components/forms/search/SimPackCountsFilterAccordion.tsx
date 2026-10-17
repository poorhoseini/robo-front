"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { SearchFilterFormProps } from "./FiltersForm";
import FilterBadge from "./FilterBadge";

export default function SimPackCountsFilterAccordion({
  defaultValues,
  control,
  setValue,
}: {
  defaultValues: string;
  control: Control<SearchFilterFormProps, any>;
  setValue: UseFormSetValue<SearchFilterFormProps>;
}) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectedValues(defaultValues ? defaultValues.split(",") : []);
  }, [defaultValues]);

  const handleAddItem = (item: string) => {
    if (item === "all") {
      setValue("simPackCounts", item);
      setSelectedValues([item]);
    } else {
      setValue(
        "simPackCounts",
        [...selectedValues.filter((item) => item !== "all"), item].toString(),
      );
      setSelectedValues((prev) => [
        ...prev.filter((item) => item !== "all"),
        item,
      ]);
    }
  };

  const handleRemoveItem = (item: string) => {
    setValue(
      "simPackCounts",
      selectedValues.filter((item) => item !== item).toString(),
    );
    setSelectedValues((prev) =>
      prev.filter((previousItem) => previousItem !== item),
    );
  };

  const handleToggleCheckBox = (item: string) => {
    selectedValues.includes(item)
      ? handleRemoveItem(item)
      : handleAddItem(item);
  };

  return (
    <>
      <div className="hidden">
        <Controller
          control={control}
          name="simPackCounts"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <Accordion
        disableGutters
        sx={{
          width: "100%",
          minHeight: 56,
          boxShadow: "none",
          color: "#404040",
          fontSize: 14,
          fontWeight: 400,
          border: "none",
          "&:before": { opacity: "unset !important" },
        }}
      >
        <AccordionSummary
          expandIcon={
            <Image
              src="/icons/icon-chevron-down.svg"
              alt="open sim pack counts"
              width={16}
              height={17}
            />
          }
          sx={{ p: 0 }}
        >
          <div className="flex flex-row items-center justify-start gap-2">
            <h3 className="text-sm font-normal text-grey">تعداد سیم کارت</h3>
            <FilterBadge count={selectedValues.length} />
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <div className="flex flex-col items-center text-sm font-normal text-grey">
            <HorizontalLine />
            {simPackCountsFilterOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToggleCheckBox(option.value)}
                className="flex w-full flex-row items-center justify-between py-1"
              >
                <p>{option.label}</p>
                <Checkbox
                  checked={selectedValues.includes(option.value)}
                  icon={
                    <Image
                      src="/form/checkbox.svg"
                      alt="checkbox"
                      width={20}
                      height={20}
                    />
                  }
                  checkedIcon={
                    <Image
                      src="/form/checkbox-checked.svg"
                      alt="checked checkbox"
                      width={20}
                      height={20}
                    />
                  }
                />
              </button>
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}

const simPackCountsFilterOptions = [
  {
    id: 0,
    label: "همه",
    value: "all",
  },
  {
    id: 1,
    label: "یک عدد",
    value: "1",
  },
  {
    id: 2,
    label: "دو عدد",
    value: "2",
  },
  {
    id: 3,
    label: "سه عدد",
    value: "3",
  },
  {
    id: 4,
    label: "چهار عدد",
    value: "4",
  },
  {
    id: 5,
    label: "پنج عدد",
    value: "5",
  },
];
