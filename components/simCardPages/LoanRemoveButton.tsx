"use client";

import { useState } from "react";
import InstallmentRemoveModal from "../dashboard/serviceModals/InstallmentRemoveModal";
import { Button } from "@mui/material";
import Image from "next/image";

export default function LoanRemoveButton() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={handleOpen}
        className="!flex flex-row items-center justify-center !bg-white !shadow-none hover:!bg-grey-100"
      >
        <Image src="/icons/garbage-red.svg" alt="" width={25} height={24} />
        <span className="text-xs font-medium leading-4 text-grey">
          حذف شرایط اقساطی
        </span>
      </Button>
      <InstallmentRemoveModal open={open} handleClose={handleClose} />
    </>
  );
}
