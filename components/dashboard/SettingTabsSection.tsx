"use client";

import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function SettingTabsSection({
  selectedTab,
}: {
  selectedTab: string;
}) {
  const router = useRouter();

  const handleTabChange = (tab: string) => {
    router.push(`/dashboard/settings/${tab}`);
  };

  return (
    <div className="flex w-full flex-row items-center justify-between gap-6">
      {settingTabs.map((tab) => (
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

const settingTabs = [
  { id: 1, value: "my-account", label: "مشخصات کاربر" },
  { id: 2, value: "my-store", label: "فروشگاه" },
  { id: 3, value: "my-sessions", label: "نشست های فعال" },
];
