"use client";

import React, { TouchEvent, useContext, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import Image from "next/image";
import CartModal from "@/components/cart/CartModal";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";
import {
  PreVitrinStoreRequestProps,
  PreVitrinStoreResponseProps,
} from "@/lib/entities/preVitrinStore";
import preVitrinStore from "@/lib/api/preVitrinStore";

export default function StoreVitrinModal({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { auth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  async function handleSubmit() {
    setLoading(true);

    const payload: PreVitrinStoreRequestProps = {
      vitrinType: "store",
      refrenceId: id,
    };

    try {
      const response: PreVitrinStoreResponseProps = await preVitrinStore(
        auth.token,
        payload,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در ویترین کردن فروشگاه");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-12 flex-row items-center text-nowrap rounded-md bg-grey px-10 py-4 text-base font-medium leading-4 text-white"
      >
        اضافه کردن به فروشگاه‌های برتر
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
            ...(fullScreen && { paddingBottom: "104px" }),
            borderRadius: "24px",
            backgroundColor: "#F8F9FB",
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
              اضافه کردن به فروشگاه‌های برتر
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
            p: fullScreen ? "24px" : "32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:gap-8">
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4 md:min-w-[464px] md:p-6">
              <div className="flex w-[416px] items-center justify-center rounded-t-2xl bg-grey-900 p-4">
                <span className="text-2xl font-semibold leading-7 text-[#F6F6F6]">
                  {`فروشگاه ${name}`}
                </span>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-grey-200 bg-white p-4 md:min-w-[440px] md:p-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    نوع سرویس
                  </p>
                  <p className="text-sm font-medium text-grey md:text-base">
                    فروشگاه های برتر
                  </p>
                </div>
                <HorizontalLine />
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    تعداد سرویس
                  </p>
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    ۱ عدد
                  </p>
                </div>
                <HorizontalLine />
                <div className="hidden w-full md:flex">
                  <button
                    type="button"
                    disabled={loading}
                    className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
                    onClick={handleSubmit}
                  >
                    {loading ? <Spinner /> : "تایید"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
          <button
            type="button"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white"
            onClick={handleSubmit}
          >
            {loading ? <Spinner /> : "تایید"}
          </button>
        </div>
      </Dialog>
      {!!cartId && <CartModal cartId={cartId} />}
    </>
  );
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}
