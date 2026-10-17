"use client";

import { ResponseError } from "@/lib/api/error";
import getPredictByExperts from "@/lib/api/getPredictByExperts";
import {
  GetPredictByExpertsResponseProps,
  PredictByExpert,
} from "@/lib/entities/predict";
import {
  getSimCardStateLabel,
  getSimCardTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Slide,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import {
  TouchEvent,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "react-toastify";
import Space from "../general/Space";
import PriceGraph from "../analysisDetail/PriceGraph";
import CustomButton from "../general/CustomButton";
import { useRouter } from "next/navigation";

export default function PredictByExpertDetailsDialog({
  selectedPredictByExpertId,
  handleClose,
}: {
  selectedPredictByExpertId?: string;
  handleClose: () => void;
}) {
  const router = useRouter();
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [loading, setLoading] = useState(true);
  const [predictDetail, setPredictByExpertDetail] = useState<PredictByExpert>();
  const [draggable, setDraggable] = useState(false);

  const open = useMemo(() => {
    return !!selectedPredictByExpertId;
  }, [selectedPredictByExpertId]);

  useEffect(() => {
    if (!auth.token || !open) return;

    handleFetchPredictByExpertDetail();
  }, [auth.token, open]);

  const handleFetchPredictByExpertDetail = async () => {
    if (!selectedPredictByExpertId) return;

    setLoading(true);

    try {
      const predictByExpertsResponse: GetPredictByExpertsResponseProps =
        await getPredictByExperts(
          auth.token,
          1,
          [{ field: "_id", oprand: "=", value: selectedPredictByExpertId }],
          { field: "_id", order: -1 },
          0,
        );
      predictByExpertsResponse.data &&
        predictByExpertsResponse.data.length &&
        setPredictByExpertDetail(predictByExpertsResponse.data[0]);
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
        toast.error("خطا در دریافت جزئیات کارشناسی قیمت");
      }
    } finally {
      setLoading(false);
    }
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  if (!selectedPredictByExpertId) return;

  return (
    <Dialog
      open={open}
      draggable={draggable}
      onTouchMove={handleTouchMove}
      onClose={handleClose}
      fullScreen={true}
      TransitionComponent={Transition}
      PaperProps={{ sx: { backgroundColor: "#F8F9FB", borderRadius: "12px" } }}
    >
      <div
        onTouchStart={() => setDraggable(true)}
        onTouchEnd={() => setDraggable(false)}
        className="flex flex-row items-center justify-between p-8 pb-0"
      >
        <DialogTitle sx={{ p: 0 }} component="h1">
          <span className="text-base font-medium text-grey">
            تخمین قیمت کارشناس
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
        {loading ? (
          <PredictDetailSkeleton />
        ) : predictDetail ? (
          <div className="flex w-full flex-col items-start rounded-xl border border-grey-200 bg-white p-6">
            <div className="flex w-full flex-row items-center justify-between gap-2 rounded-xl bg-grey p-6">
              <div className="flex flex-row items-center gap-4">
                <div className="flex w-20 items-center justify-center rounded-lg bg-grey-200 p-[6px] text-sm font-medium leading-5 text-grey-900">
                  {getSimCardTypeLabel(predictDetail.type)}
                </div>
                <div className="flex w-20 items-center justify-center rounded-lg bg-grey-200 p-[6px] text-sm font-medium leading-5 text-grey-900">
                  {getSimCardStateLabel(predictDetail.state)}
                </div>
              </div>
              <p className="text-3xl font-medium leading-8 text-white">
                {persianNumber(predictDetail.phoneNumber)}
              </p>
            </div>
            <Space value={24} />
            <div className="w-full rounded-md bg-grey-200 p-6">
              <p className="text-lg font-medium leading-7 text-grey">
                روبووند مایل است این سیم کارت را با قیمت کارشناسی شده از شما
                خریداری کند. کارشناس روبوروند برای توضیحت بیشتر باشما تماس
                میگیرد.
              </p>
            </div>
            <Space value={24} />
            <h2 className="text-base font-medium leading-6 text-grey">
              تخمین قیمت
            </h2>
            <Space value={16} />
            {!predictDetail.lowPrice || !predictDetail.highPrice ? (
              <div className="flex w-full items-center justify-center p-4">
                مشکل در دریافت مقادیر کارشناسی! لطفا با پشتیبانی تماس بگیرید
              </div>
            ) : (
              <PriceGraph
                data={[
                  {
                    value: predictDetail.lowPrice,
                    label: "حداقل",
                    color: "#D9D9D9",
                  },
                  {
                    value: Math.floor(
                      (predictDetail.lowPrice + predictDetail.highPrice) / 2,
                    ),

                    label: "منصفانه",
                    color: "#00B200",
                  },
                  {
                    value: predictDetail.highPrice,
                    label: "حداکثر",
                    color: "#EC443F",
                  },
                ]}
              />
            )}
            <Space value={24} />
            <div className="flex w-full flex-col items-center rounded-xl bg-biege-300 p-6">
              <div className="flex w-full flex-row items-center justify-between gap-8">
                <p className="text-lg font-medium leading-6 text-grey">
                  تخمین قیمت با هوش مصنوعی به صورت رایگان برای شما انجام شده
                  برای مشاهده کلیک کنید.
                </p>
                <div className="w-full max-w-[250px]">
                  <CustomButton
                    label="مشاهده تخمین هوش مصنوعی"
                    loading={false}
                    disabled={false}
                    handleSubmit={() => {
                      router.push(`ai?id=${predictDetail.perdictId}`);
                    }}
                  />
                </div>
              </div>
              <Space value={32} />
              <div className="flex w-full flex-row items-center justify-between gap-8">
                <p className="text-lg font-medium leading-6 text-grey">
                  در صورتی که قیمت مدنظر شما در بازه قیمت کارشناسی شده باشد این
                  سیم کارت با نشان کارشناسی شده در لیست سیم کارت‌ها به مدت یک
                  ماه نمایش داده می شود.
                </p>
                <div className="w-full max-w-[250px]">
                  <CustomButton
                    label="آگهی کردن"
                    loading={false}
                    disabled={false}
                    handleSubmit={() => {
                      router.push(
                        `/dashboard/add/simcard?digit1=${predictDetail.phoneNumber.slice(2, 3)}&digit2=${predictDetail.phoneNumber.slice(3, 4)}&digit3=${predictDetail.phoneNumber.slice(4, 5)}&digit4=${predictDetail.phoneNumber.slice(5, 6)}&digit5=${predictDetail.phoneNumber.slice(6, 7)}&digit6=${predictDetail.phoneNumber.slice(7, 8)}&digit7=${predictDetail.phoneNumber.slice(8, 9)}&digit8=${predictDetail.phoneNumber.slice(9, 10)}&digit9=${predictDetail.phoneNumber.slice(10, 11)}&type=${predictDetail.type}&status=${predictDetail.state}`,
                      );
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <p>خطا در دریافت جزئیات تخمین قیمت</p>
            <button onClick={() => handleFetchPredictByExpertDetail()}>
              تلاش مجدد
            </button>
          </div>
        )}
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

function PredictDetailSkeleton() {
  return <Skeleton variant="rounded" width="100%" height={296} />;
}
