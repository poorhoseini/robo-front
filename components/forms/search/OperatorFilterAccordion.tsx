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
import { Operator } from "@/lib/entities/operator";
import { SearchFilterFormProps } from "./FiltersForm";
import FilterBadge from "./FilterBadge";

export default function OperatorFilterAccordion({
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
  const [selectedValues, setSelectedValues] = useState<Operator[]>([]);

  useEffect(() => {
    setSelectedValues(
      defaultValues ? (defaultValues.split(",") as Operator[]) : [],
    );
  }, [defaultValues]);

  const handleAddOperator = (operator: Operator) => {
    if (operator === "all") {
      setValue("operator", operator);
      setSelectedValues([operator]);
    } else {
      setValue(
        "operator",
        [
          ...selectedValues.filter((item) => item !== "all"),
          operator,
        ].toString(),
      );
      setSelectedValues((prev) => [
        ...prev.filter((item) => item !== "all"),
        operator,
      ]);
    }
  };

  const handleRemoveOperator = (operator: Operator) => {
    setValue(
      "operator",
      selectedValues.filter((item) => item !== operator).toString(),
    );
    setSelectedValues((prev) =>
      prev.filter((previousItem) => previousItem !== operator),
    );
  };

  const handleToggleCheckBox = (operator: Operator) => {
    selectedValues.includes(operator)
      ? handleRemoveOperator(operator)
      : handleAddOperator(operator);
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
          name="operator"
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField />
          )}
        />
      </div>
      <Accordion
        disableGutters
        expanded={accordionExpanded === "operator"}
        onChange={handleAccordionChange("operator")}
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
            <h3 className="text-sm font-normal text-grey">اپراتور</h3>
            <FilterBadge count={selectedValues.length} />
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ px: 0 }}>
          <div className="flex flex-col items-center text-sm font-normal text-grey">
            <HorizontalLine />
            {operatorFilterOptions.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleToggleCheckBox(option.value as Operator)}
                className="flex w-full flex-row items-center justify-between py-1"
              >
                <p>{option.label}</p>
                <Checkbox
                  checked={selectedValues.includes(option.value as Operator)}
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

const operatorFilterOptions = [
  {
    id: 0,
    label: "همه",
    value: "all",
  },
  {
    id: 1,
    label: "همراه اول",
    value: "mci",
  },
  {
    id: 2,
    label: "ایرانسل",
    value: "mtn",
  },
  {
    id: 3,
    label: "رایتل",
    value: "rightel",
  },
];
