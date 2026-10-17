"use client";

import {
  Checkbox,
  Dialog,
  InputAdornment,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import FilterBadge from "./FilterBadge";
import { SelectOption } from "@/lib/entities/form";
import { useAddSimKhastActions } from "@/lib/zustand/addSimKhast";

type AddSimKhastNumberFormProps = {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  digit7: string;
  digit8: string;
  digit9: string;
  roundTypes: string;
  type: string;
  status: string;
};

export default function RoundTypesMultipleSelectModal({
  options,
  defaultValues,
  control,
  setValue,
  setAccordionExpanded,
}: {
  options: SelectOption[];
  defaultValues: string;
  control: Control<AddSimKhastNumberFormProps, any>;
  setValue: UseFormSetValue<AddSimKhastNumberFormProps>;
  setAccordionExpanded?: Dispatch<SetStateAction<string | false>>;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { setRoundTypeIds } = useAddSimKhastActions();
  const [search, setSearch] = useState("");
  const [selectedValues, setSelectedValues] = useState<SelectOption[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedValues(
      options.filter(
        (option) => defaultValues.split(",").indexOf(option.id.toString()) > -1,
      ),
    );
  }, [defaultValues, options]);

  const handleOpen = () => {
    setAccordionExpanded && setAccordionExpanded(false);
    setOpen(true);
  };

  const handleAddItem = (item: SelectOption) => {
    setSelectedValues((prev) => [...prev, item]);
  };

  const handleRemoveItem = (item: SelectOption) => {
    setSelectedValues((prev) =>
      prev.filter((previousItem) => previousItem.id !== item.id),
    );
  };

  const handleToggleCheckBox = (item: SelectOption) => {
    selectedValues.map((selectedValue) => selectedValue.id).indexOf(item.id) >
    -1
      ? handleRemoveItem(item)
      : handleAddItem(item);
  };

  const handleSubmit = () => {
    setRoundTypeIds(selectedValues.map((option) => option.id.toString()));
    setValue("roundTypes", selectedValues.map((item) => item.id).toString());
    setOpen(false);
  };

  return (
    <>
      <Controller
        control={control}
        name="roundTypes"
        render={({ field: { onChange, onBlur, value, ref } }) => (
          <div className="flex flex-row items-center gap-2">
            <TextField
              label="نوع رندی"
              onClick={handleOpen}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end" sx={{ pl: "8px" }}>
                    <Image
                      src="/icons/icon-chevron-down.svg"
                      alt="open round types"
                      width={16}
                      height={17}
                    />
                  </InputAdornment>
                ),
              }}
            />
            <FilterBadge count={selectedValues.length} />
          </div>
        )}
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
              <h2 className="text-base font-medium text-grey">
                انتخاب نوع رند
              </h2>
              <p className="text-sm font-normal text-grey-800">
                نوع رندی مورد نظر خود را انتخاب کنید
              </p>
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
            id="roundSearch"
            placeholder="جستجو"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
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
                    alt="search round types"
                    width={16}
                    height={16}
                  />
                </InputAdornment>
              ),
            }}
          />
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-4">
            {selectedValues.map((item, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-between gap-2 rounded-lg border border-grey-400 p-2 text-sm font-normal text-grey-800"
              >
                <p>{item.label}</p>
                <button onClick={() => handleRemoveItem(item)}>
                  <Image
                    src="/icons/icon-close-sm.svg"
                    alt="remove round type"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            ))}
          </div>
          <h3 className="mt-2 w-full text-start text-base font-medium text-grey">
            انواع رندها
          </h3>
          <div className="w-full overflow-y-auto">
            {options
              .filter((option) => option.label.includes(search))
              .map((option) => (
                <div
                  key={option.id}
                  className="flex w-full flex-col items-center border-b border-grey-200 py-3"
                >
                  <button
                    onClick={() => handleToggleCheckBox(option)}
                    className="flex w-full flex-row items-center justify-between"
                  >
                    <p>{option.label}</p>
                    <Checkbox
                      checked={
                        selectedValues
                          .map((item) => item.id)
                          .indexOf(option.id) > -1
                      }
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
                </div>
              ))}
          </div>
          <div className="w-full py-3">
            <button
              className="sticky bottom-0 flex w-full items-center justify-center rounded-lg bg-grey py-4 text-sm font-medium text-white"
              onClick={handleSubmit}
            >
              تایید
            </button>
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
