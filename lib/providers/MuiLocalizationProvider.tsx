"use client";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMomentJalaali } from "@mui/x-date-pickers/AdapterMomentJalaali";
import moment from "moment";
import { ReactNode } from "react";

export default function MuiLocalizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  moment.updateLocale("fa", {
    week: {
      // Sunday = 0, Monday = 1.
      dow: 6,
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterMomentJalaali} adapterLocale="fa">
      {children}
    </LocalizationProvider>
  );
}
