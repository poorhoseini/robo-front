"use client";

import { Button } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import JalaliDatePicker from "../general/JalaliDatePicker";
import moment, { Moment } from "moment-jalaali";
import {
  DateValidationError,
  PickerChangeHandlerContext,
} from "@mui/x-date-pickers";

export default function PredictTabsSection({
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
    router.push(`/dashboard/my-predicts/${tab}`);
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
    <>
      <div className="flex w-full flex-col items-center gap-4 md:hidden">
        <div className="flex w-full flex-row items-center justify-between overflow-hidden border-grey-200 bg-neutral text-sm font-medium text-grey-500">
          <button
            type="button"
            className={`flex w-full items-center justify-center py-4 ${selectedTab === "ai" ? "border-b-2 border-grey text-grey md:border-0 md:bg-grey-100" : ""}`}
            onClick={() => handleTabChange("ai")}
            disabled={selectedTab === "ai"}
          >
            هوش مصنوعی
          </button>
          <VerticalLine />
          <button
            type="button"
            className={`flex w-full items-center justify-center py-4 ${selectedTab === "expert" ? "border-b-2 border-grey text-grey md:border-0 md:bg-grey-100" : ""}`}
            onClick={() => handleTabChange("expert")}
            disabled={selectedTab === "expert"}
          >
            دقیق توسط کارشناس
          </button>
        </div>
        <div className="w-full px-6">
          <JalaliDatePicker
            size="small"
            label="تا تاریخ"
            value={createDate ? moment(Number(createDate)) : null}
            onChange={handleDateChange}
          />
        </div>
      </div>
      <div className="hidden w-full flex-row items-center justify-between gap-6 md:flex">
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
    </>
  );
}

function VerticalLine() {
  return <div className="hidden h-8 w-[1px] bg-grey-100 md:block" />;
}

const predictTabs = [
  { id: 1, value: "ai", label: "هوش مصنوعی" },
  { id: 2, value: "expert", label: "دقیق توسط کارشناس" },
];
