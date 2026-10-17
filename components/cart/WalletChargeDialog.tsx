import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Slide,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import React, { TouchEvent, useContext, useState } from "react";
import CustomButton from "../general/CustomButton";
import { chargeWalletSelectOptions } from "@/lib/constants/charge";
import requestIpgForWallet from "@/lib/api/requestIpgForWallet";
import {
  PostRequestIpgForWalletRequestProps,
  RequestIpgForWalletResponseProps,
} from "@/lib/entities/ipg";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";

export default function WalletChargeDialog({
  isProfile = false,
}: {
  isProfile?: boolean;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const router = useRouter();
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chargeAmount, setChargeAmount] = useState<string>("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function handleSubmitRequestWalletChargeIpg() {
    setLoading(true);

    const payload: PostRequestIpgForWalletRequestProps = {
      count: Number(chargeAmount),
    };

    try {
      const response: RequestIpgForWalletResponseProps =
        await requestIpgForWallet(auth.token, payload);
      router.push(response.redirect);
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
        toast.error("خطا در انتقال به درگاه بانکی");
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
      {isProfile ? (
        <div
          className="flex h-5 w-full flex-row items-center justify-end gap-2 text-sm font-normal leading-5"
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          افزایش اعتبار
          <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-blue-900">
            <Image
              src="/icons/icon-arrow-left.svg"
              alt="Enter"
              width={16}
              height={16}
            />
          </div>
        </div>
      ) : (
        <div
          onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}
          className="flex flex-row items-center gap-2 self-end rounded-lg p-1 hover:bg-grey-100"
        >
          <Image
            src="/icons/icon-plus-blue.svg"
            alt=""
            width={24}
            height={24}
          />
          <p className="text-base font-medium leading-5 text-blue">
            افزایش موجودی
          </p>
        </div>
      )}

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
            // height: "574px",
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
              شارژ کیف پول
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
          <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-grey-200 bg-white p-6">
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <p className="w-full">میزان شارژ مورد نظر را انتخاب کنید</p>
              <div className="w-full">
                <TextField
                  select
                  label="مبلغ شارژ"
                  value={chargeAmount}
                  onChange={(e) => setChargeAmount(e.target.value)}
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    "& .MuiInputBase-root": {
                      height: "100%",
                    },
                  }}
                  variant="outlined"
                >
                  {chargeWalletSelectOptions.map((option) => (
                    <MenuItem key={option.id} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>

            <CustomButton
              label="پرداخت"
              loading={loading}
              disabled={loading || !chargeAmount}
              handleSubmit={handleSubmitRequestWalletChargeIpg}
            />
          </div>
        </DialogContent>
      </Dialog>
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
