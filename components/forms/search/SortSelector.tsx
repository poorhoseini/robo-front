"use client";

import { viewTypeOptions } from "@/lib/constants/other";
import { sortOptions } from "@/lib/constants/sort";
import { SortType, ViewType } from "@/lib/entities/api";
import { MenuItem, TextField } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent } from "react";

export default function SortSelector({
  sortBy,
  viewType,
}: {
  sortBy: SortType;
  viewType: ViewType;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSortChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", e.target.value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleViewTypeChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("viewType", e.target.value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="sticky top-0 z-10 flex w-full flex-row items-center justify-end gap-4 bg-neutral py-4">
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
      <TextField
        id="view-type-select"
        select
        label="نوع نمایش"
        defaultValue="card"
        value={viewType}
        onChange={handleViewTypeChange}
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
        {viewTypeOptions.map((option) => (
          <MenuItem key={option.id} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}
