"use client";

import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import JalaliDatePicker from "../general/JalaliDatePicker";
import moment, { Moment } from "moment-jalaali";
import {
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";

export default function OfferTabsSection({
  selectedTab,
  createDate,
}: {
  selectedTab: string;
  createDate: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard/my-offers/${tab}`);
  };

  const handleDateChange = (
    value: Moment | null,
    context: PickerChangeHandlerContext<DateValidationError>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && !context.validationError) {
      params.set("createDate", value.valueOf().toString());
    } else {
      params.delete("createDate");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex w-full flex-row items-center justify-between gap-6">
      <JalaliDatePicker
        label="تا تاریخ"
        value={createDate ? moment(Number(createDate)) : null}
        onChange={handleDateChange}
      />
      {predictTabs.map((tab) => (
        <Button
          key={tab.id}
          size="large"
          variant="outlined"
          sx={{
            width: "100%",
            height: "48px",
            fontWeight: "400",
            fontSize: "16px",
            borderColor: selectedTab === tab.value ? "#404040" : "#d9d9d9",
            backgroundColor: "white",
          }}
          onClick={() => handleTabChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

const predictTabs = [
  { id: 1, value: "simcard", label: "سیم کارت" },
  { id: 2, value: "simpack", label: "سیم پک" },
];
