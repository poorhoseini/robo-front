"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
} from "@mui/material";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { SearchFilterFormProps } from "./FiltersForm";
import { simCardTypeFilterOptions } from "@/lib/constants/filters";
import FilterBadge from "./FilterBadge";

export default function SimCardTypeFilterAccordion({
  defaultValue,
  control,
  setValue,
  accordionExpanded,
  setAccordionExpanded,
}: {
  defaultValue: string;
  control: Control<SearchFilterFormProps, any>;
  setValue: UseFormSetValue<SearchFilterFormProps>;
  accordionExpanded: string | false;
  setAccordionExpanded: Dispatch<SetStateAction<string | false>>;
}) {
  const [selectedValue, setSelectedValue] = useState<string>("");

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  const handleChangeSimCardType = (simCardType: string) => {
    if (selectedValue === simCardType) {
      setValue("simCardType", "");
      setSelectedValue("");
    } else {
      setValue("simCardType", simCardType);
      setSelectedValue(simCardType);
    }
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
          name="simCardType"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <Accordion
        disableGutters
        expanded={accordionExpanded === "simCardType"}
        onChange={handleAccordionChange("simCardType")}
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
              alt="open operators"
              width={16}
              height={17}
            />
          }
          sx={{ p: 0 }}
        >
          <div className="flex flex-row items-center justify-start gap-2">
            <h3 className="text-sm font-normal text-grey">نوع</h3>
            <FilterBadge
              count={selectedValue === "0" || selectedValue === "1" ? 1 : 0}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <div className="flex w-full flex-row items-center justify-around gap-4 text-sm font-normal text-grey">
            {simCardTypeFilterOptions.map((item, index) => (
              <button
                type="button"
                key={index}
                className={`flex w-1/3 items-center justify-center rounded-md border border-grey-200 py-[6px] ${selectedValue === item.value ? "bg-grey-100 text-black" : ""}`}
                onClick={() => handleChangeSimCardType(item.value)}
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
