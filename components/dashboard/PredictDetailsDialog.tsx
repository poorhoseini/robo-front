"use client";

import { persianNumber } from "@/lib/helpers/persianNumber.helper";
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
  Fragment,
  TouchEvent,
  forwardRef,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import Space from "../general/Space";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import {
  GetPredictDetailResponseProps,
  PredictDetail,
} from "@/lib/entities/predict";
import getPredictDetail from "@/lib/api/getPredictDetail";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import {
  getSimCardStateLabel,
  getSimCardTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import PriceGraph from "../analysisDetail/PriceGraph";

export default function PredictDetailsDialog({
  selectedPredictId,
  handleClose,
}: {
  selectedPredictId?: string;
  handleClose: () => void;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [loading, setLoading] = useState(true);
  const [predictDetail, setPredictDetail] = useState<PredictDetail>();
  const [draggable, setDraggable] = useState(false);

  const open = useMemo(() => {
    return !!selectedPredictId;
  }, [selectedPredictId]);

  useEffect(() => {
    if (!auth.token || !open) return;

    handleFetchPredictDetail();
  }, [auth.token, open]);

  const handleFetchPredictDetail = async () => {
    if (!selectedPredictId) return;

    setLoading(true);

    try {
      const predictDetailResponse: GetPredictDetailResponseProps =
        await getPredictDetail(auth.token, { perdictId: selectedPredictId });
      setPredictDetail(predictDetailResponse.data);
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
        toast.error("خطا در دریافت جزئیات تخمین قیمت");
      }
    } finally {
      setLoading(false);
    }
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  if (!selectedPredictId) return;

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
            تخمین قیمت هوش مصنوعی روبورند
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
          <div className="flex w-full flex-col items-center">
            <div className="flex w-full flex-col items-start rounded-xl border border-grey-200 bg-white px-8 py-6">
              <h2 className="text-base font-medium leading-6 text-grey">
                مشخصات سیم کارت انتخابی
              </h2>
              <Space value={16} />
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <p className="text-base font-medium leading-6 text-grey">
                  پیش شماره
                </p>
                <BlueBox
                  size="medium"
                  label={persianNumber(
                    predictDetail.simcard.phoneNumber.slice(0, 3),
                  )}
                />
              </div>
              <Space value={12} />
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <p className="text-base font-medium leading-6 text-grey">کد</p>
                <BlueBox
                  size="medium"
                  label={persianNumber(
                    predictDetail.simcard.phoneNumber.slice(3, 4),
                  )}
                />
              </div>
              <Space value={12} />
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <p className="text-base font-medium leading-6 text-grey">
                  شماره
                </p>
                <div className="flex flex-row-reverse items-center justify-start gap-3">
                  {predictDetail.simcard.phoneNumber
                    .slice(4, 11)
                    .split("")
                    .map((item, index) => (
                      <BlueBox
                        key={index}
                        size="small"
                        label={persianNumber(item)}
                      />
                    ))}
                </div>
              </div>
              <Space value={12} />
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <p className="text-base font-medium leading-6 text-grey">
                  نوع رندی
                </p>
                <div className="flex flex-row-reverse items-center justify-start gap-3">
                  {predictDetail.rondData.rondLevelsFa.length ? (
                    predictDetail.rondData.rondLevelsFa.map((item, index) => (
                      <BlueBox key={index} size="large" label={item} />
                    ))
                  ) : (
                    <BlueBox size="small" label={"-"} />
                  )}
                </div>
              </div>
              <Space value={12} />
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <p className="text-base font-medium leading-6 text-grey">
                  وضعیت سیم کات
                </p>
                <div className="flex flex-row-reverse items-center justify-start gap-3">
                  <BlueBox
                    size="medium"
                    label={getSimCardStateLabel(predictDetail.simcard.state)}
                  />
                  <BlueBox
                    size="medium"
                    label={getSimCardTypeLabel(predictDetail.simcard.type)}
                  />
                </div>
              </div>
            </div>
            <Space value={24} />
            <div className="flex w-full flex-col items-start rounded-xl border border-grey-200 bg-white px-8 py-6">
              <h2 className="text-base font-medium leading-6 text-grey">
                تخمین قیمت
              </h2>
              <Space value={16} />
              <PriceGraph
                data={[
                  {
                    value: predictDetail.prices.minPrice,
                    label: "پایین ترین",
                    color: "#D9D9D9",
                  },
                  {
                    value: predictDetail.prices.lowFinal,
                    label: "پایین",
                    color: "#FFD800",
                  },
                  {
                    value: predictDetail.prices.finalPrice,
                    label: "منصفانه",
                    color: "#00B200",
                  },
                  {
                    value: predictDetail.prices.highFinal,
                    label: "بالا",
                    color: "#E18000",
                  },
                  {
                    value: predictDetail.prices.maxPrice,
                    label: "بالاترین",
                    color: "#EC443F",
                  },
                ]}
              />
            </div>
            <Space value={24} />
            <h2 className="w-full text-base font-semibold leading-8 text-grey">
              مشابه‌ترین سیم‌کارت‌ها:
            </h2>
            <Space value={8} />
            <div className="flex w-full flex-row items-center justify-between rounded-xl  bg-white px-6 py-3">
              {predictDetail.simcards.bestMatch.map((item, index) => (
                <Fragment key={index}>
                  <div className="flex w-1/3 flex-col items-center gap-3">
                    <p className="text-base font-normal leading-5 text-grey">
                      {persianNumber(item.phoneNumber)}
                    </p>
                    <p>
                      <span className="text-base font-bold leading-5 text-grey">
                        {persianNumber(item.price) + " "}
                      </span>
                      <span className="text-[10px] font-light leading-5 text-grey">
                        تومان
                      </span>
                    </p>
                  </div>
                  {index + 1 < predictDetail.simcards.bestMatch.length && (
                    <VerticalLine />
                  )}
                </Fragment>
              ))}
            </div>
            <Space value={24} />
            <h2 className="w-full text-base font-semibold leading-8 text-grey">
              سیم‌کارت‌های ارزان مشابه:
            </h2>
            <Space value={8} />
            <div className="flex w-full flex-row items-center justify-between rounded-xl  bg-white px-6 py-3">
              {predictDetail.simcards.minSimcards.map((item, index) => (
                <Fragment key={index}>
                  <div className="flex w-1/3 flex-col items-center gap-3">
                    <p className="text-base font-normal leading-5 text-grey">
                      {persianNumber(item.phoneNumber)}
                    </p>
                    <p>
                      <span className="text-base font-bold leading-5 text-grey">
                        {persianNumber(item.price) + " "}
                      </span>
                      <span className="text-[10px] font-light leading-5 text-grey">
                        تومان
                      </span>
                    </p>
                  </div>
                  {index + 1 < predictDetail.simcards.bestMatch.length && (
                    <VerticalLine />
                  )}
                </Fragment>
              ))}
            </div>
            <Space value={24} />
            <h2 className="w-full text-base font-semibold leading-8 text-grey">
              سیم‌کارت‌های منصفانه مشابه:
            </h2>
            <Space value={8} />
            <div className="flex w-full flex-row items-center justify-between rounded-xl  bg-white px-6 py-3">
              {predictDetail.simcards.midSimcards.map((item, index) => (
                <Fragment key={index}>
                  <div className="flex w-1/3 flex-col items-center gap-3">
                    <p className="text-base font-normal leading-5 text-grey">
                      {persianNumber(item.phoneNumber)}
                    </p>
                    <p>
                      <span className="text-base font-bold leading-5 text-grey">
                        {persianNumber(item.price) + " "}
                      </span>
                      <span className="text-[10px] font-light leading-5 text-grey">
                        تومان
                      </span>
                    </p>
                  </div>
                  {index + 1 < predictDetail.simcards.bestMatch.length && (
                    <VerticalLine />
                  )}
                </Fragment>
              ))}
            </div>
            <Space value={24} />
            <h2 className="w-full text-base font-semibold leading-8 text-grey">
              سیم‌کارت‌های گران مشابه:
            </h2>
            <Space value={8} />
            <div className="flex w-full flex-row items-center justify-between rounded-xl  bg-white px-6 py-3">
              {predictDetail.simcards.highSimcards.map((item, index) => (
                <Fragment key={index}>
                  <div className="flex w-1/3 flex-col items-center gap-3">
                    <p className="text-base font-normal leading-5 text-grey">
                      {persianNumber(item.phoneNumber)}
                    </p>
                    <p>
                      <span className="text-base font-bold leading-5 text-grey">
                        {persianNumber(item.price) + " "}
                      </span>
                      <span className="text-[10px] font-light leading-5 text-grey">
                        تومان
                      </span>
                    </p>
                  </div>
                  {index + 1 < predictDetail.simcards.bestMatch.length && (
                    <VerticalLine />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <p>خطا در دریافت جزئیات تخمین قیمت</p>
            <button onClick={() => handleFetchPredictDetail()}>
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

function VerticalLine() {
  return <div className="h-12 w-[1px] bg-grey-300" />;
}

function PredictDetailSkeleton() {
  return <Skeleton variant="rounded" width="100%" height={296} />;
}

function BlueBox({
  size,
  label,
}: {
  size: "small" | "medium" | "large";
  label: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-blue-900 p-1 ${size === "large" ? "w-[120px]" : size === "medium" ? "w-20" : "w-8"}`}
    >
      <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}
