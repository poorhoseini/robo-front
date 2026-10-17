"use client";

import { SearchType, SortType } from "@/lib/entities/api";
import { Province } from "@/lib/entities/province";
import { RoundType } from "@/lib/entities/roundType";
import FiltersFormDialog from "../forms/search/FiltersFormDialog";
import { MenuItem, TextField } from "@mui/material";
import { sortOptions } from "@/lib/constants/sort";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect } from "react";
import GroupOperationsDialogButton from "./GroupOperationsDialogButton";
import GroupOperationsExecuteButton from "./GroupOperationsExecuteButton";
import { useGroupOperationActions } from "@/lib/zustand/groupOperation";
import { ServiceType } from "@/lib/entities/landingPage";

export default function DashboardSearchActionBar({
  serviceType,
  filtersCount,
  sortBy,
  searchType,
  preNumber = "",
  code = "",
  digit1 = "",
  digit2 = "",
  digit3 = "",
  digit4 = "",
  digit5 = "",
  digit6 = "",
  minPrice = "",
  maxPrice = "",
  roundTypesList = [],
  roundTypes = "",
  provincesList = [],
  provinces = "",
  operator = "",
  simCardType = "",
  simCardState = "",
  hasDiscount = "",
  isHighestBid = "",
  hasPrice = "",
  advertiserType = "",
  simPackCounts = "",
  simPackType = "",
}: {
  serviceType: ServiceType;
  filtersCount: number;
  sortBy: SortType;
  searchType: SearchType;
  preNumber?: string;
  code?: string;
  digit1?: string;
  digit2?: string;
  digit3?: string;
  digit4?: string;
  digit5?: string;
  digit6?: string;
  minPrice?: string;
  maxPrice?: string;
  roundTypesList?: RoundType[];
  roundTypes?: string;
  provincesList?: Province[];
  provinces?: string;
  operator?: string;
  simCardType?: string;
  simCardState?: string;
  hasDiscount?: string;
  isHighestBid?: string;
  hasPrice?: string;
  advertiserType?: string;
  simPackCounts?: string;
  simPackType?: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const { setServiceType } = useGroupOperationActions();

  useEffect(() => {
    setServiceType(serviceType);
  }, [serviceType]);

  const handleSortChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", e.target.value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-0 z-10 flex w-full flex-row items-center justify-between gap-4 bg-neutral py-4">
      <div className="flex flex-row items-center justify-start gap-4">
        <GroupOperationsDialogButton />
        <GroupOperationsExecuteButton />
      </div>
      <div className="flex flex-row items-center justify-end gap-4">
        <FiltersFormDialog
          screen="large"
          filtersCount={filtersCount}
          searchType={searchType}
          preNumber={preNumber}
          code={code}
          digit1={digit1}
          digit2={digit2}
          digit3={digit3}
          digit4={digit4}
          digit5={digit5}
          digit6={digit6}
          minPrice={minPrice}
          maxPrice={maxPrice}
          roundTypesList={roundTypesList}
          roundTypes={roundTypes}
          provincesList={provincesList}
          provinces={provinces}
          operator={operator}
          simCardType={simCardType}
          simCardState={simCardState}
          hasDiscount={hasDiscount}
          isHighestBid={isHighestBid}
          hasPrice={hasPrice}
          advertiserType={advertiserType}
          simPackCounts={simPackCounts}
          simPackType={simPackType}
        />
        <TextField
          id="sort-by-select"
          select
          label="مرتب سازی"
          defaultValue="newest"
          value={sortBy}
          onChange={handleSortChange}
          sx={{
            width: "165px",
            height: "48px",
            "& .MuiInputBase-root": {
              height: "48px",
              backgroundColor: "white",
            },
            "& fieldset": {
              borderColor: "#ECECEC",
            },
          }}
          variant="outlined"
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.id} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </div>
  );
}
