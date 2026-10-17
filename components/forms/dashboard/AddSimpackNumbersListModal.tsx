import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forwardRef, TouchEvent, useState } from "react";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import ApproveSimPackItemsButton from "./ApproveSimPackItemsButton";
import { useAddSimPackActions, useSavedItems } from "@/lib/zustand/addSimPack";
import SavedSimPackItemCardClient from "./SavedSimPackItemCardClient";

export default function AddSimpackNumbersListModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const savedItems = useSavedItems();
  const { removeSavedItem } = useAddSimPackActions();

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
        PaperProps={{
          sx: {
            width: "804px",
            maxWidth: "804px",
            ...(!fullScreen && { height: "824px" }),
            ...(fullScreen && { paddingBottom: "104px" }),
            borderRadius: "24px",
            // backgroundColor: "#F8F9FB",
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
              لیست سیم کارت‌ها
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
            p: fullScreen ? "16px" : "52px 32px 32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex w-full flex-col items-center gap-4">
            {savedItems.map((savedItem, index) => (
              <SavedSimPackItemCardClient
                key={index}
                phoneNumber={savedItem.phoneNumber}
                simCardState={Number(savedItem.status)}
                simCardType={Number(savedItem.type)}
                onDelete={() => removeSavedItem(index)}
              />
            ))}
          </div>
          {savedItems.length < 2 && (
            <>
              <div className="flex-1" />
              <div className="flex w-full flex-row items-start gap-1 rounded-lg bg-biege-200 p-2">
                <Image
                  src="/icons/warning-black.svg"
                  alt=""
                  width={18}
                  height={18}
                  className="mt-1"
                />
                <p className="text-lg font-normal leading-7 text-grey">
                  جهت ثبت آگهی سیم پک حداقل به اضافه کردن دو سیم کارت نیاز است.
                </p>
              </div>
            </>
          )}
        </DialogContent>
        <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-between gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
          <button
            type="button"
            onClick={handleClose}
            className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border-[1.4px] border-grey bg-white text-[17px] font-bold`}
          >
            سیم کارت بعدی
          </button>
          <ApproveSimPackItemsButton count={savedItems.length} />
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
