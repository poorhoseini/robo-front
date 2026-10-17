"use client";

import {
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
import Space from "../general/Space";
import theme from "@/app/theme";

export default function EndUserSessionDialog({
  endOthers = false,
  open,
  loading,
  handleClose,
  onFinish,
}: {
  endOthers?: boolean;
  open: boolean;
  handleClose: () => void;
  loading: boolean;
  onFinish: () => void;
}) {
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{ sx: { width: "545px", borderRadius: "12px" } }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between p-8 pb-0"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-base font-medium text-grey">
              {endOthers ? "حذف سایر نشست ها" : "حذف نشست"}
            </span>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close-circle.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent sx={{ p: "32px" }}>
          <p>
            {endOthers
              ? "آیا از خروج از سایر دستگاه ها اطمینان دارید؟"
              : "آیا از خروج از این دستگاه اطمینان دارید؟"}
          </p>
          <Space value={16} />
        </DialogContent>
        <div className="flex w-full flex-row items-center justify-center gap-4 p-2">
          <button
            onClick={handleClose}
            className="h-9 w-full text-nowrap rounded-md bg-grey px-2 py-[10px] text-sm font-medium leading-4 text-white"
            disabled={loading}
          >
            منصرف شدم
          </button>
          <button
            onClick={onFinish}
            className="h-9 w-full text-nowrap rounded-md bg-[#f9eaea] px-2 py-[10px] text-sm font-medium leading-4 text-[#bd272d]"
            disabled={loading}
          >
            بله، حذف کن
          </button>
        </div>
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
