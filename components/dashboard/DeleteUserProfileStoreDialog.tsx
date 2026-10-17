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
import { TouchEvent, forwardRef, useContext, useState } from "react";
import Space from "../general/Space";
import theme from "@/app/theme";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import deleteUserProfileStore from "@/lib/api/deleteUserProfileStore";
import { DeactiveUserProfileStoreRequestProps } from "@/lib/entities/store";

export default function DeleteUserProfileStoreDialog({
  storeId,
  onFinish,
}: {
  storeId: string;
  onFinish: () => void;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  async function handleDeleteStore() {
    setLoading(true);

    const payload: DeactiveUserProfileStoreRequestProps = {
      storeId: storeId,
    };

    try {
      const res = await deleteUserProfileStore(payload, auth.token);
      onFinish();
      handleClose();
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
        const errorReason = error.getErrorReason();
        if (errorReason === 163 || errorReason === 164) {
          resetAuth();
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطا در حذف فروشگاه");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-12 flex-row items-center gap-1 text-nowrap rounded-md bg-[#f9eaea] px-6 py-[10px] text-sm font-medium leading-4 text-[#bd272d]"
      >
        <Image
          src="/icons/icon-garbage-red.svg"
          alt=""
          width={24}
          height={24}
        />
        <span>حذف فروشگاه</span>
      </button>
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
            <span className="text-base font-medium text-grey">حذف فروشگاه</span>
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
          <p>آیا از حذف فروشگاه اطمینان دارید؟</p>
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
            onClick={handleDeleteStore}
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
