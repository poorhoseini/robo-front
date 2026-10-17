"use client";

import { ResponseError } from "@/lib/api/error";
import {
  Channel,
  ChangeChannelActivationRequestProps,
} from "@/lib/entities/channel";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import { forwardRef, TouchEvent, useContext, useState } from "react";
import { toast } from "react-toastify";
import Space from "../general/Space";
import Spinner from "../general/Spinner";
import { TransitionProps } from "@mui/material/transitions";
import changeChannelActivation from "@/lib/api/changeChannelActivation";

export default function ToggleChannelActivationDialog({
  selectedChannel,
  onSuccess,
  open,
  handleClose,
}: {
  selectedChannel?: Channel;
  onSuccess: () => void;
  open: boolean;
  handleClose: () => void;
}) {
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { auth } = useContext(AuthContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangeChannelState = async () => {
    if (!auth.token || !selectedChannel) return;

    setLoading(true);

    const payload: ChangeChannelActivationRequestProps = {
      telegramChannelIds: [selectedChannel.id],
    };

    try {
      const response = await changeChannelActivation(auth.token, payload);
      handleClose();
      onSuccess();
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
        toast.error("خطا در تغییر وضعیت کانال");
      }
    } finally {
      setLoading(false);
    }
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <Dialog
      open={open}
      draggable={draggable}
      onTouchMove={handleTouchMove}
      onClose={handleClose}
      fullScreen={fullScreen}
      TransitionComponent={Transition}
      PaperProps={{
        sx: {
          borderRadius: "24px",
          backgroundColor: "white",
          border: "1px solid #D9D9D9",
        },
      }}
    >
      <div
        onTouchStart={() => setDraggable(true)}
        onTouchEnd={() => setDraggable(false)}
        className="flex flex-row items-center justify-between px-6 pb-0 pt-[26px]"
      >
        <DialogTitle sx={{ p: 0 }} component="h1">
          <span className="text-xl font-medium leading-6 text-grey">
            تغییر وضعیت کانال
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
      <DialogContent
        sx={{
          p: "32px",
          overflowY: "visible",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <div className="flex w-full flex-col items-start">
          <p className="text-base font-normal leading-7 text-grey">{`آیا از ${selectedChannel?.isActive ? "غیرفعال سازی" : "فعال سازی"} کانال ${selectedChannel?.channelPlatform === "bale" ? "بله" : "تلگرامی"} ${selectedChannel?.channelId} اطمینان دارید؟`}</p>
          <Space value={16} />
          <button
            type="button"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
            onClick={handleChangeChannelState}
          >
            {loading ? (
              <Spinner />
            ) : selectedChannel?.isActive ? (
              "بله، غیرفعال شود"
            ) : (
              "بله، فعال شود"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
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
