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
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import {
  GetPlanSubscriptionsResponseProps,
  PlanSubscriptionDetail,
} from "@/lib/entities/subscription";
import getMyPlanSubscriptions from "@/lib/api/getMyPlanSubscriptions";
import { MyPlan } from "@/lib/entities/plan";
import { getRemainingTimeDHM } from "@/lib/helpers/timeDifference";
import MyPlanSubscriptionCard from "../cards/MyPlanSubscriptionCard";

export default function MyPlanDetailsDialog({
  selectedPlan,
  handleClose,
}: {
  selectedPlan?: MyPlan;
  handleClose: () => void;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [loading, setLoading] = useState(true);
  const [subscriptionDetails, setSubscriptionDetails] = useState<
    PlanSubscriptionDetail[]
  >([]);
  const [draggable, setDraggable] = useState(false);

  const open = useMemo(() => {
    return !!selectedPlan;
  }, [selectedPlan]);

  useEffect(() => {
    if (!auth.token || !open) return;

    handleFetchPlanSubscriptions();
  }, [auth.token, open]);

  const handleFetchPlanSubscriptions = async () => {
    if (!selectedPlan) return;

    setLoading(true);

    try {
      const predictDetailResponse: GetPlanSubscriptionsResponseProps =
        await getMyPlanSubscriptions(auth.token, selectedPlan.id);
      setSubscriptionDetails(predictDetailResponse.data.subscriptions);
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
        toast.error("خطا در دریافت جزئیات بسته");
      }
    } finally {
      setLoading(false);
    }
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  if (!selectedPlan) return;

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
            {selectedPlan.serviceNameFa}
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
      <DialogContent sx={{ p: "48px" }}>
        <div className="flex w-full flex-row items-center justify-between">
          <div className="flex flex-row items-center justify-start gap-4">
            <div className="flex items-center justify-center rounded-lg bg-biege px-4 py-[10px]">
              <span>{`${persianNumber(getRemainingTimeDHM(selectedPlan.endDate).days)} روز باقی مانده`}</span>
            </div>
            <div className="flex items-center justify-center rounded-lg bg-biege px-4 py-[10px]">
              <span>{`${persianNumber(selectedPlan.period)} روزه`}</span>
            </div>
          </div>
          <div className="rounded-lg bg-[#22A958] px-3 py-1">
            <span className="text-sm font-medium leading-5 text-white">
              فعال
            </span>
          </div>
        </div>
        <Space value={24} />
        {loading ? (
          <SubscriptionSkeleton />
        ) : subscriptionDetails ? (
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-6">
            {subscriptionDetails.map((subscriptionDetails, index) => (
              <MyPlanSubscriptionCard
                key={subscriptionDetails.id}
                title={subscriptionDetails.serviceNameFa}
                totalCount={subscriptionDetails.count}
                remainingCount={subscriptionDetails.counter}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>خطا در دریافت جزئیات بسته</p>
            <button onClick={() => handleFetchPlanSubscriptions()}>
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

function SubscriptionSkeleton() {
  return <Skeleton variant="rounded" width="100%" height={296} />;
}
