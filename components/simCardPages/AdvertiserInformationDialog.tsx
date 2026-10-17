"use client";

import theme from "@/app/theme";
import { StoreAdvertiser, UserAdvertiser } from "@/lib/entities/advertiser";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
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
import { Fragment, TouchEvent, forwardRef, useState } from "react";

export default function AdvertiserInformationDialog({
  isStore,
  user,
  store,
  searchPage,
}: {
  isStore: boolean;
  user: UserAdvertiser[];
  store: StoreAdvertiser;
  searchPage?: boolean;
}) {
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);
  const [draggable, setDraggable] = useState(false);

  let phoneNumbers: string[];
  if (isStore) {
    phoneNumbers = store.numbers;
  } else {
    phoneNumbers = user[0].phoneNumber;
  }

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

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex h-full w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
      >
        اطلاعات فروشگاه
      </button>

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
            <span className="text-base font-medium text-grey">
              اطلاعات فروشگاه
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
        <DialogContent sx={{ pb: "32px", pt: "44px", px: "24px" }}>
          <div className="flex w-full flex-col items-center gap-4 text-grey">
            <div className="flex w-full flex-col items-start gap-3">
              <div className="flex flex-row items-center gap-3">
                <Image
                  src="/icons/icon-call-blue.svg"
                  alt="Call Advertiser"
                  width={19}
                  height={19}
                />
                <p className="text-sm font-normal">تماس تلفنی با</p>
              </div>
              <div className="flex flex-row items-center justify-start gap-2 text-sm font-medium">
                {phoneNumbers.map((phone, index) => (
                  <Fragment key={index}>
                    {(index && <VerticalLineSmall />) || ""}
                    <p>{persianNumber(phone)}</p>
                  </Fragment>
                ))}
              </div>
              <HorizontalLine />
            </div>
            {isStore && (
              <>
                <div className="flex w-full flex-col items-start gap-3">
                  <div className="flex w-full flex-row items-center justify-between">
                    <p className="text-sm font-medium">آدرس</p>
                    <button className="h-6 w-20 rounded-xl bg-blue-900 text-[10px] font-medium text-blue">
                      مشاهده در نقشه
                    </button>
                  </div>
                  <div className="mt-1 flex flex-row items-center gap-2">
                    <Image
                      src="/icons/icon-location-blue.svg"
                      alt="Call Advertiser"
                      width={19}
                      height={19}
                    />
                    {store.addresses.map((address, index) => (
                      <div
                        key={index}
                        className="flex flex-row items-center justify-start gap-2 text-base font-medium"
                      >
                        <p className="text-base font-normal">{address}</p>
                      </div>
                    ))}
                  </div>
                  <HorizontalLine />
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row items-center gap-3">
                    <Image
                      src="/icons/icon-bale.svg"
                      alt="Bale/Telegram Addresse"
                      width={14}
                      height={20}
                    />
                    <p className="text-sm font-normal">
                      لینک کانال تلگرام/ بله
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    {store.telegram || "نامشخص"}
                  </p>
                </div>
              </>
            )}
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

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}

function VerticalLineSmall() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}
