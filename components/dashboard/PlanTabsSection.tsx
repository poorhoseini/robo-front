"use client";

import { Button } from "@mui/material";

export default function PlanTabsSection({
  tabs,
  selectedTab,
  onTabChange,
}: {
  tabs: Array<{ id: string; label: string; value: string }>;
  selectedTab?: { id: string; label: string; value: string };
  onTabChange: (tab: { id: string; label: string; value: string }) => void;
}) {
  if (!tabs.length)
    return <p className="w-full">بسته ای برای نمایش وجود ندارد</p>;

  return (
    <div className="flex w-full flex-row items-center justify-start gap-6">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          size="large"
          variant="outlined"
          sx={{
            width: "100%",
            maxWidth: "160px",
            height: "48px",
            fontWeight: "400",
            fontSize: "16px",
            borderColor:
              selectedTab?.value === tab.value ? "#404040" : "#d9d9d9",
            backgroundColor: "white",
          }}
          onClick={() => onTabChange(tab)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
