"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { SearchFilterFormProps } from "./FiltersForm";
import FilterBadge from "./FilterBadge";
import { advertiserTypeFilterOptions } from "@/lib/constants/filters";

export default function AdvertiserTypeFilterAccordion({
  defaultValues,
  control,
  setValue,
  accordionExpanded,
  setAccordionExpanded,
}: {
  defaultValues: string;
  control: Control<SearchFilterFormProps, any>;
  setValue: UseFormSetValue<SearchFilterFormProps>;
  accordionExpanded: string | false;
  setAccordionExpanded: Dispatch<SetStateAction<string | false>>;
}) {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    setSelectedValues(defaultValues ? defaultValues.split(",") : []);
  }, [defaultValues]);

  const handleAddAddvertiserType = (advertiserType: string) => {
    if (advertiserType === "all") {
      setValue("advertiserType", advertiserType);
      setSelectedValues([advertiserType]);
    } else {
      setValue(
        "advertiserType",
        [
          ...selectedValues.filter((item) => item !== "all"),
          advertiserType,
        ].toString(),
      );
      setSelectedValues((prev) => [
        ...prev.filter((item) => item !== "all"),
        advertiserType,
      ]);
    }
  };

  const handleRemoveAdvertiserType = (advertiserType: string) => {
    setValue(
      "advertiserType",
      selectedValues.filter((item) => item !== advertiserType).toString(),
    );
    setSelectedValues((prev) =>
      prev.filter((previousItem) => previousItem !== advertiserType),
    );
  };

  const handleToggleCheckBox = (advertiserType: string) => {
    selectedValues.includes(advertiserType)
      ? handleRemoveAdvertiserType(advertiserType)
      : handleAddAddvertiserType(advertiserType);
  };

  const handleAccordionChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setAccordionExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <div className="hidden">
        <Controller
          control={control}
          name="advertiserType"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <Accordion
        disableGutters
        expanded={accordionExpanded === "advertiserType"}
        onChange={handleAccordionChange("advertiserType")}
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
              alt="open advertiser type"
              width={16}
              height={17}
            />
          }
          sx={{ p: 0 }}
        >
          <div className="flex flex-row items-center justify-start gap-2">
            <h3 className="text-sm font-normal text-grey">نوع فروشنده</h3>
            <FilterBadge count={selectedValues.length} />
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <div className="flex flex-col items-center text-sm font-normal text-grey">
            <HorizontalLine />
            {advertiserTypeFilterOptions.map((option, index) => (
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
