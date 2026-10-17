"use client";

import React, { TouchEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  Skeleton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import {
  useGroupOperationActions,
  useSelectedItems,
  useServiceType,
} from "@/lib/zustand/groupOperation";
import { SingleSimCard } from "@/lib/entities/singleSimCard";
import SavedItemCardClient from "@/components/forms/dashboard/SavedItemCardClient";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";
import { useRouter } from "next/navigation";
import { SimKhast } from "@/lib/entities/simKhast";
import { SimPack } from "@/lib/entities/simPack";
import {
  ChangeSimInstallmentPlanRequestProps,
  ChangeSimInstallmentPlanResponseProps,
} from "@/lib/entities/changeSimInstallmentPlan";
import changeSimInstallmentPlan from "@/lib/api/changeSimInstallmentPlan";
import {
  GetMyInstallmentPlansResponseProps,
  InstallmentPlan,
} from "@/lib/entities/installment";
import getMyInstallmentPlans from "@/lib/api/getMyInstallmentPlans";
import AddInstallmentPlanModal from "@/components/forms/dashboard/AddInstallmentPlanModal";
import Space from "@/components/general/Space";

export default function InstallmentModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const router = useRouter();
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const selectedItems = useSelectedItems();
  const serviceType = useServiceType();
  const { removeItem, flushItems } = useGroupOperationActions();
  const { auth } = useContext(AuthContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanId, setLoanId] = useState("");

  async function handleSubmitInstallment() {
    if (!loanId) return;

    setLoading(true);

    const payload: ChangeSimInstallmentPlanRequestProps = {
      refrence: serviceType,
      refrenceIds: selectedItems.map((item) => item._id),
      installmentPlanId: loanId,
    };

    try {
      const response: ChangeSimInstallmentPlanResponseProps =
        await changeSimInstallmentPlan(auth.token, payload);
      flushItems();
      handleClose();
      router.refresh();
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
        toast.error("خطا در تغییر طرح اقساطی سیم کارت");
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
            سیم کارت‌های انتخابی
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
            {serviceType === "simcard" || serviceType === "simcardHighBid" ? (
              (selectedItems as SingleSimCard[]).map((item) => (
                <SavedItemCardClient
                  key={item._id}
                  serviceType={serviceType}
                  phoneNumber={[item.sellerSpel]}
                  cityName={item.cityFa}
                  provinceName={item.provinceFa}
                  simCardState={item.state}
                  priceType={item.priceType}
                  price={item.price}
                  roundLevelsFa={item.rondData.rondLevelsFa}
                  hasInstallmentPlan={item.isInstallment}
                  onDelete={() => removeItem(item)}
                />
              ))
            ) : serviceType === "simPack" ||
              serviceType === "simPackHighBid" ? (
              (selectedItems as SimPack[]).map((item) => (
                <SavedItemCardClient
                  key={item._id}
                  serviceType={serviceType}
                  phoneNumber={item.simcards.map(
                    (simcard) => simcard.sellerSpel,
                  )}
                  cityName={item.cityFa}
                  provinceName={item.provinceFa}
                  simPackType={item.simPackType}
                  priceType={item.priceType}
                  price={item.price}
                  hasInstallmentPlan={item.isInstallment}
                  onDelete={() => removeItem(item)}
                />
              ))
            ) : serviceType === "specialSim" ? (
              (selectedItems as SimKhast[]).map((item) => (
                <SavedItemCardClient
                  key={item._id}
                  serviceType={serviceType}
                  phoneNumber={[item.condition.sellerSpel]}
                  operator={item.condition.operator}
                  maxPrice={item.condition.maxPrice}
                  minPrice={item.condition.minPrice}
                  cityName={item.condition.cityFa}
                  provinceName={item.condition.provinceFa}
                  simCardState={item.condition.state}
                  roundLevelsFa={item.condition.rondLevelsFa}
                  onDelete={() => removeItem(item)}
                />
              ))
            ) : (
              <></>
            )}
          </div>
          <div className="flex w-full flex-col items-start gap-4 md:min-w-[440px]">
            <div className="w-full rounded-2xl border border-grey-200 bg-white p-4 md:p-6">
              <div className="flex w-full flex-col gap-4">
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    نوع سرویس
                  </p>
                  <p className="text-sm font-medium text-grey md:text-base">
                    تغییر شرایط اقساط
                  </p>
                </div>
                <HorizontalLine />
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    تعداد سرویس
                  </p>
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">{`${persianNumber(selectedItems.length)} عدد`}</p>
                </div>
              </div>
            </div>
            <div className="w-full rounded-2xl border border-grey-200 bg-white p-4 md:p-6">
              <InstallmentPlanSelectorSection
                value={loanId}
                onChange={(value) => setLoanId(value)}
              />
              <Space value={16} />
              <div className="hidden w-full md:flex">
                <button
                  type="button"
                  disabled={loading || !loanId}
                  className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
                  onClick={handleSubmitInstallment}
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
          disabled={loading || !loanId}
          className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white"
          onClick={handleSubmitInstallment}
        >
          {loading ? <Spinner /> : "تایید"}
        </button>
      </div>
    </Dialog>
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

function InstallmentPlanSelectorSection({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [myInstallmentPlans, setMyInstallmentPlans] = useState<
    InstallmentPlan[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      setMyInstallmentPlans([]);
      return;
    }
    handleGetMyInstallmentPlans();
  }, [auth.token]);

  async function handleGetMyInstallmentPlans() {
    setLoading(true);
    setError(false);
    try {
      const res: GetMyInstallmentPlansResponseProps =
        await getMyInstallmentPlans(auth.token);
      setMyInstallmentPlans(res.data);
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
        toast.error("خطا در دریافت اطلاعات شرایط اقساطی");
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {error && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p>دریافت لیست شرایط اقساطی شما با مشکل مواجه شد!</p>
          <button
            type="button"
            className="rounded-lg border border-blue p-3 text-blue"
            onClick={handleGetMyInstallmentPlans}
          >
            تلاش مجدد
          </button>
        </div>
      )}
      {loading && <InstallmentPlanSkeleton />}
      {!error && !loading && (
        <>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="text-base font-medium text-grey">لیست اقساط</p>
            <AddInstallmentPlanModal
              onSuccess={() => handleGetMyInstallmentPlans()}
            />
          </div>
          <Space value={16} />
          <RadioGroup
            name="loanId"
            value={value}
            onChange={(event, value) => onChange(value)}
            sx={{
              width: "100%",
              gap: "16px",
            }}
          >
            {myInstallmentPlans.map((item, index) => (
              <button
                key={index}
                type="button"
                onClick={() => onChange(item._id)}
                className="flex w-full flex-col items-center gap-3 rounded-lg bg-neutral px-3 py-4"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row items-center justify-start gap-1">
                    <Radio
                      checked={value === item._id}
                      value={item._id}
                      sx={{ mr: "-9px" }}
                    />
                    <h3 className="text-sm font-medium leading-normal text-grey">
                      {"شرایط قسط " + (index + 1)}
                    </h3>
                  </div>
                  <div className="flex h-6 w-[68px] items-center justify-center rounded-xl bg-biege px-3 py-[2px]">
                    <p className="text-[10px] font-medium leading-normal text-brown">
                      {persianNumber(item.profitPercent) + "٪ سود"}
                    </p>
                  </div>
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <h3 className="text-xs font-normal text-grey">
                    حداقل/حداکثر دوره بازپرداخت
                  </h3>
                  <p className="text-sm font-medium text-grey">
                    {persianNumber(item.minimumMonth) +
                      " ماهه/ " +
                      persianNumber(item.maximumMonth) +
                      " ماهه"}
                  </p>
                </div>
                <HorizontalLine />
                <div className="flex w-full flex-row items-center justify-between">
                  <h3 className="text-sm font-normal text-grey">پیش پرداخت</h3>
                  <p className="text-sm font-medium text-grey">
                    {"حداقل " + persianNumber(item.preFound) + " درصد"}
                  </p>
                </div>
              </button>
            ))}
          </RadioGroup>
        </>
      )}
    </>
  );
}
function InstallmentPlanSkeleton() {
  return (
    <>
      <Skeleton variant="rounded" height={24} className="w-full" />
      <div className="flex w-full flex-col gap-5 rounded-2xl border border-grey-200 bg-white p-6">
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={1} />
        <Skeleton variant="rounded" height={24} />
      </div>
    </>
  );
}
