"use client";

import theme from "@/app/theme";
import { groupOperationOptions } from "@/lib/constants/simOperations";
import {
  GroupOperationType,
  useGroupOperationActions,
  useServiceType,
} from "@/lib/zustand/groupOperation";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import { TouchEvent, forwardRef, useState } from "react";

export default function GroupOperationsDialogButton() {
  const serviceType = useServiceType();
  const { selectGroupOperation } = useGroupOperationActions();
  const fullScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [open, setOpen] = useState(false);
  const [draggable, setDraggable] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  const handleClickOption = (operation: GroupOperationType) => {
    selectGroupOperation(operation);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        size="large"
        color="primary"
        onClick={handleOpen}
        endIcon={
          <Image
            src="/icons/icon-chevron-down.svg"
            alt=""
            width={16}
            height={18}
          />
        }
        sx={{ height: "48px", padding: "14px 16px", backgroundColor: "white" }}
      >
        عملیات گروهی
      </Button>

      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{ sx: { width: "100%", borderRadius: "12px" } }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-6 pb-0 pt-[26px]"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-xl font-medium leading-6 text-grey">
              سرویس‌ها
            </span>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent
          sx={{
            p: "32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex w-full flex-col items-center gap-4">
            {groupOperationOptions
              .filter((option) => option.serviceTypes.includes(serviceType))
              .map((option) => (
                <Button
                  key={option.id}
                  variant="outlined"
                  onClick={() =>
                    handleClickOption(option.operation as GroupOperationType)
                  }
                  className="!flex !w-full !flex-row !items-start !justify-start !gap-[10px] !rounded-lg !border !border-grey-300 !p-4"
                >
                  <div className="flex h-14 w-14 min-w-14 items-center justify-center rounded-full border border-[#EDDCB4] bg-biege p-2">
                    <Image
                      src={option.imageSrc}
                      alt=""
                      width={32}
                      height={32}
                    />
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
        </DialogContent>
      </Dialog>
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
