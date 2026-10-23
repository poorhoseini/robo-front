"use client";

import { singleSimOperationOptions } from "@/lib/constants/simOperations";
import {
  GroupOperationType,
  useGroupOperationActions,
  useOperation,
} from "@/lib/zustand/groupOperation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import DiscountModal from "./serviceModals/DiscountModal";
import VipModal from "./serviceModals/VipModal";
import ChannelModal from "./serviceModals/ChannelModal";
import SimActivationModal from "./serviceModals/SimActivationModal";
import SimUpdateTimeModal from "./serviceModals/SimUpdateTimeModal";
import UpdateSimPriceModal from "./serviceModals/UpdateSimPriceModal";
import InstallmentModal from "./serviceModals/InstallmentModal";
import { forwardRef, TouchEvent, useEffect, useState } from "react";
import { SimKhast } from "@/lib/entities/simKhast";
import { SingleSimCard } from "@/lib/entities/singleSimCard";
import { SimPack } from "@/lib/entities/simPack";
import { ServiceType } from "@/lib/entities/landingPage";
import { TransitionProps } from "@mui/material/transitions";
import Space from "../general/Space";

export default function SingleOperationsDialog({
  selectedItem,
  serviceType,
}: {
  selectedItem?: SimKhast | SingleSimCard | SimPack;
  serviceType: ServiceType;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const operation = useOperation();
  const { selectSingleOperation, addItem, flushItems } =
    useGroupOperationActions();
  const [open, setOpen] = useState(false);
  const [operationDialogOpen, setOperationDialogOpen] = useState(false);

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
  const handleOpenOperationDialog = () => {
    setOperationDialogOpen(true);
  };
  const handleCloseOperationDialog = () => {
    setOperationDialogOpen(false);
    handleClose();
  };

  const handleClickOption = (operation: GroupOperationType) => {
    selectSingleOperation(operation, selectedItem, serviceType);
    handleOpenOperationDialog();
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-full w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
      >
        سرویس ها
      </button>

      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "1032px",
            maxWidth: "1032px",
            ...(!fullScreen && { height: "774px" }),
            borderRadius: "24px",
            backgroundColor: "#F8F9FB",
            border: "1px solid #D9D9D9",
          },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-6 pb-0 pt-[18px] md:pt-[26px]"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-base font-medium leading-5 text-grey md:text-xl md:leading-6">
              سرویس ها
            </span>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
              className="h-[18px] w-[18px] md:h-6 md:w-6"
            />
          </IconButton>
        </div>
        <DialogContent
          sx={{
            p: fullScreen ? "16px" : "24px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex w-full flex-col items-center gap-3">
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
                  className="!flex !w-full !flex-col !items-start !justify-start !gap-0 !rounded-lg !border !border-grey-300 !bg-white !p-3 hover:!bg-grey-100"
                >
                  <div className="flex flex-row items-center justify-start gap-[10px]">
                    <div className="flex h-6 w-6 min-w-6 items-center justify-center rounded-full border border-[#EDDCB4] bg-biege">
                      <Image
                        src={option.imageSrc}
                        alt=""
                        width={12}
                        height={12}
                      />
                    </div>
                    <h2 className="text-sm font-medium leading-5 text-grey">
                      {option.title}
                    </h2>
                  </div>
                  <Space value={4} />
                  <p className="text-start text-sm font-normal leading-5 text-grey">
                    {option.subTitle}
                  </p>
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {operation === "discount" ? (
        <DiscountModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : operation === "vip" ? (
        <VipModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : operation === "channel" ? (
        <ChannelModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : operation === "activation" ? (
        <SimActivationModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : operation === "updateTime" ? (
        <SimUpdateTimeModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : operation === "updatePrice" ? (
        <UpdateSimPriceModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : operation === "installment" ? (
        <InstallmentModal
          open={operationDialogOpen}
          handleClose={handleCloseOperationDialog}
        />
      ) : (
        <></>
      )}
    </>
  );
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
