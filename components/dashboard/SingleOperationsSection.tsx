"use client";

import { singleSimOperationOptions } from "@/lib/constants/simOperations";
import {
  GroupOperationType,
  useGroupOperationActions,
  useOperation,
} from "@/lib/zustand/groupOperation";
import { Button } from "@mui/material";
import Image from "next/image";
import DiscountModal from "./serviceModals/DiscountModal";
import VipModal from "./serviceModals/VipModal";
import ChannelModal from "./serviceModals/ChannelModal";
import SimActivationModal from "./serviceModals/SimActivationModal";
import SimUpdateTimeModal from "./serviceModals/SimUpdateTimeModal";
import UpdateSimPriceModal from "./serviceModals/UpdateSimPriceModal";
import InstallmentModal from "./serviceModals/InstallmentModal";
import { useEffect, useState } from "react";
import { SimKhast } from "@/lib/entities/simKhast";
import { SingleSimCard } from "@/lib/entities/singleSimCard";
import { SimPack } from "@/lib/entities/simPack";
import { ServiceType } from "@/lib/entities/landingPage";

export default function SingleOperationsSection({
  selectedItem,
  serviceType,
}: {
  selectedItem?: SimKhast | SingleSimCard | SimPack;
  serviceType: ServiceType;
}) {
  const operation = useOperation();
  const { selectSingleOperation, addItem, flushItems } =
    useGroupOperationActions();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selectedItem) return;

    addItem(selectedItem, serviceType);

    return () => flushItems();
  }, [selectedItem]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOption = (operation: GroupOperationType) => {
    selectSingleOperation(operation);
    handleOpen();
  };

  return (
    <>
      <div className="flex w-full flex-col items-center gap-2">
        {singleSimOperationOptions
          .filter((option) => option.serviceTypes.includes(serviceType))
          .map((option) => (
            <Button
              key={option.id}
              variant="outlined"
              disabled={!selectedItem}
              onClick={() =>
                handleClickOption(option.operation as GroupOperationType)
              }
              className="!flex !w-full !flex-row !items-start !justify-start !gap-[10px] !rounded-lg !border !border-grey-300 !bg-white !p-4 hover:!bg-grey-100"
            >
              <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-full border border-[#EDDCB4] bg-biege p-2">
                <Image src={option.imageSrc} alt="" width={32} height={32} />
              </div>
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-base font-medium leading-5 text-grey">
                  {option.title}
                </h2>
                <p className="text-start text-sm font-normal leading-5 text-grey">
                  {option.subTitle}
                </p>
              </div>
            </Button>
          ))}
      </div>

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
