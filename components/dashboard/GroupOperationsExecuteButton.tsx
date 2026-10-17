"use client";

import {
  useGroupOperationActions,
  useOperation,
  useSelectedItems,
} from "@/lib/zustand/groupOperation";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import DiscountModal from "./serviceModals/DiscountModal";
import VipModal from "./serviceModals/VipModal";
import ChannelModal from "./serviceModals/ChannelModal";
import SimActivationModal from "./serviceModals/SimActivationModal";
import SimUpdateTimeModal from "./serviceModals/SimUpdateTimeModal";
import UpdateSimPriceModal from "./serviceModals/UpdateSimPriceModal";
import InstallmentModal from "./serviceModals/InstallmentModal";

export default function GroupOperationsExecuteButton() {
  const operation = useOperation();
  const selectedItems = useSelectedItems();
  const { flushItems } = useGroupOperationActions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    return () => flushItems();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleExecute = () => {
    handleOpen();
  };

  return (
    <>
      <Button
        disabled={!selectedItems.length}
        variant="outlined"
        size="large"
        color="primary"
        onClick={handleExecute}
        sx={{
          height: "48px",
          width: "100px",
          padding: "14px 16px",
          backgroundColor: "white",
        }}
      >
        اجرا
      </Button>

      {operation === "discount" ? (
        <DiscountModal open={open} handleClose={handleClose} />
      ) : operation === "vip" ? (
        <VipModal open={open} handleClose={handleClose} />
      ) : operation === "channel" ? (
        <ChannelModal open={open} handleClose={handleClose} />
      ) : operation === "activation" ? (
        <SimActivationModal open={open} handleClose={handleClose} />
      ) : operation === "updateTime" ? (
        <SimUpdateTimeModal open={open} handleClose={handleClose} />
      ) : operation === "updatePrice" ? (
        <UpdateSimPriceModal open={open} handleClose={handleClose} />
      ) : operation === "installment" ? (
        <InstallmentModal open={open} handleClose={handleClose} />
      ) : (
        <></>
      )}
    </>
  );
}
