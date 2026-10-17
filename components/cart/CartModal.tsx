"use client";

import {
  Cart,
  GetCartPageResponseProps,
  TransactionSource,
} from "@/lib/entities/cart";
import getCart from "@/lib/api/getCart";
import React, { TouchEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
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
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import Image from "next/image";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  getSimCardLevelLabel,
  getSimCardStateLabel,
  getSimCardTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { AppliedCart, ApplyCartResponseProps } from "@/lib/entities/applyCart";
import ApplyCartModal from "./ApplyCartModal";
import applyCart from "@/lib/api/applyCart";
import Spinner from "../general/Spinner";
import { useRouter } from "next/navigation";
import CustomButton from "../general/CustomButton";
import { getRemainingTime } from "@/lib/helpers/timeDifference";
import { Plan } from "@/lib/entities/plan";
import getOfferedPlans from "@/lib/api/getPlans";
import preAddPlan from "@/lib/api/preAddPlan";
import { useGroupOperationActions } from "@/lib/zustand/groupOperation";
import cancelCart from "@/lib/api/cancelCart";
import AvailablePlanRadioCard from "./ActivePlanRadioCard";
import OfferedPlanAccordion from "./OfferedPlanAccordion";
import { RequestIpgForCartResponseProps } from "@/lib/entities/ipg";
import requestIpgForCart from "@/lib/api/requestIpgForCart";
import WalletChargeDialog from "./WalletChargeDialog";
import Space from "../general/Space";

export default function CartModal({
  cartId,
  isSubscripitonCart = false,
  onCloseSubscriptionCart,
}: {
  cartId?: string;
  isSubscripitonCart?: boolean;
  onCloseSubscriptionCart?: () => void;
}) {
  const router = useRouter();
  const { auth } = useContext(AuthContext);
  const {
    cartDialogOpen,
    setCartDialogOpen,
    subscriptionCartDialogOpen,
    setSubscriptionCartDialogOpen,
  } = useContext(CartDialogContext);
  const { flushItems } = useGroupOperationActions();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [draggable, setDraggable] = useState(false);
  const [applyCartOpen, setApplyCartOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [innerStep, setInnerStep] = useState(1);
  const [cart, setCart] = useState<Cart>();
  const [cartLoading, setCartLoading] = useState(false);
  const [appliedCart, setAppliedCart] = useState<AppliedCart>();
  const [applyCartLoading, setApplyCartLoading] = useState(false);

  useEffect(() => {
    if (!auth.token || !cartId) return;
    getCartData();
  }, [auth, cartId]);

  async function getCartData() {
    if (!cartId) return;

    setCartLoading(true);
    try {
      const cartResponse: GetCartPageResponseProps = await getCart(
        cartId,
        auth.token,
      );
      setCart(cartResponse.data);
      if (cartResponse.data.amount) setStep(2);
    } catch (error) {
      if (error instanceof ResponseError) {
        toast.error(error.printError());

        const errorReason = error.getErrorReason();
        if (errorReason === 163) {
          //   setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطایی رخ داده است");
        console.log(error);
      }
    } finally {
      setCartLoading(false);
    }
  }

  const handleApplyCart = async (paymentMethod: TransactionSource | "auto") => {
    if (!cartId) return;

    if (step === 1 && cart?.amount) {
      setStep(2);
      return;
    }

    setApplyCartLoading(true);

    try {
      if (paymentMethod === "pay") {
        const requestIpgForCartResponse: RequestIpgForCartResponseProps =
          await requestIpgForCart(auth.token, { cartId: cartId });
        router.push(requestIpgForCartResponse.redirect);
      } else {
        const appliedCartResponse: ApplyCartResponseProps = await applyCart(
          { cartId: cartId, debitSource: paymentMethod },
          auth.token,
        );
        setAppliedCart(appliedCartResponse);
        handleApplyCartOpen();
      }
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());

        const errorReason = error.getErrorReason();
        if (errorReason === 163) {
          //   setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطایی رخ داده است");
      }
    } finally {
      setApplyCartLoading(false);
    }
  };

  const handleCancelCart = async () => {
    if (!cartId) return;

    try {
      await cancelCart({ cartId: cartId }, auth.token);
    } catch (error) {
      console.log(error);
      if (error instanceof ResponseError) {
        toast.error(error.printError());
      } else {
        toast.error("خطایی رخ داده است");
      }
    } finally {
    }
  };

  const handleApplyCartOpen = () => {
    setApplyCartOpen(true);
  };

  const handleApplyCartClose = () => {
    if (!appliedCart) return;

    setApplyCartOpen(false);
    handleCartClose(true);

    if (isSubscripitonCart) {
      return;
    } else {
      flushItems();
      router.push(appliedCart.redirect);
      router.refresh();
    }
  };

  const handleCartClose = (isSuccessful: boolean = false) => {
    if (isSubscripitonCart) {
      setSubscriptionCartDialogOpen(false);
      onCloseSubscriptionCart && onCloseSubscriptionCart();
    } else {
      if (
        !isSuccessful &&
        (cart?.serviceName === "highBid-offer-simcard" ||
          cart?.serviceName === "highBid-offer-simPack")
      ) {
        handleCancelCart();
      }
      setCartDialogOpen(false);
    }
  };

  const handleSubscriptionCartClose = () => {
    getCartData();
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleCartClose();
  }

  if (!cart) return <></>;

  return (
    <>
      <Dialog
        disablePortal
        open={isSubscripitonCart ? subscriptionCartDialogOpen : cartDialogOpen}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={() => handleCartClose()}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "1032px",
            maxWidth: "1032px",
            height: fullScreen ? "100%" : "774px",
            borderRadius: fullScreen ? "16px" : "24px",
            backgroundColor: "#F8F9FB",
            border: "1px solid #D9D9D9",
          },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-8 pt-6"
        >
          {step === 2 && innerStep === 2 && (
            <IconButton onClick={() => setInnerStep(1)}>
              <Image
                src="/icons/icon-chevron-right-black.svg"
                alt="Close"
                width={7}
                height={12}
                className="h-3 w-3 md:h-6 md:w-6"
              />
            </IconButton>
          )}
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-sm font-medium leading-5 text-grey md:text-2xl">
              {step === 1
                ? "ثبت نهایی"
                : step === 2
                  ? "روش‌های پرداخت"
                  : `step ${step}`}
            </span>
          </DialogTitle>
          <IconButton onClick={() => handleCartClose()}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
              className="h-3 w-3 md:h-6 md:w-6"
            />
          </IconButton>
        </div>
        <DialogContent
          sx={{
            p: fullScreen ? "0" : "48px",
            pt: "24px",
            pb: "32px",
            overflowY: "visible",
          }}
        >
          {cartLoading ? (
            <SkeletonComponent />
          ) : step === 1 ? (
            <CartPreview
              serviceNameFa={cart.serviceNameFa}
              count={cart.count}
              sellerSpells={
                cart.payload.simcards?.map((item) => item.phoneNumber) || []
              }
              handleSubmit={() => handleApplyCart("auto")}
              submitLoading={applyCartLoading}
            />
          ) : step === 2 ? (
            <CartPaymentMethods
              cart={cart}
              handleSubmit={handleApplyCart}
              handleSubscriptionCartClose={handleSubscriptionCartClose}
              submitLoading={applyCartLoading}
              step={innerStep}
              handleChangeStep={(step) => setInnerStep(step)}
            />
          ) : (
            <div className="flex w-full flex-row items-start gap-8">
              <div className="flex w-full flex-col items-start gap-4">
                {/*offer simkhast****************/}
                {cart?.serviceName === "specialSim-offer" &&
                  !!cart?.preview?.condition && (
                    <div className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-6">
                      <div className="mb-4 flex w-full items-center justify-center rounded-t-2xl bg-primary p-4 text-2xl font-semibold text-white">
                        <p className="ltr">
                          {persianNumber(cart.preview.condition.sellerSpel)}
                        </p>
                      </div>
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-base font-normal text-grey">
                          وضعیت سیم کارت
                        </p>
                        <p className="text-base font-normal text-grey">
                          {getSimCardStateLabel(cart.preview.condition.state)}
                        </p>
                      </div>
                      <HorizontalLine />
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-base font-normal text-grey">
                          نوع سیم کارت
                        </p>
                        <p className="text-base font-normal text-grey">
                          {getSimCardTypeLabel(cart.preview.condition.type)}
                        </p>
                      </div>
                      <HorizontalLine />
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-base font-normal text-grey">
                          نوع رندی
                        </p>
                        <p className="text-base font-normal text-grey">
                          {cart.preview.condition.rondLevelsFa.toString()}
                        </p>
                      </div>
                    </div>
                  )}
                {/*offer simkhast****************/}
                {cart?.preview?.simcards?.map((item, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-6"
                  >
                    <div className="mb-4 flex w-full items-center justify-center rounded-t-2xl bg-primary p-4 text-2xl font-semibold text-white">
                      <p className="ltr">
                        {persianNumber(item?.sellerSpel || "")}
                      </p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between">
                      <p className="text-base font-normal text-grey">
                        وضعیت سیم کارت
                      </p>
                      <p className="text-base font-normal text-grey">
                        {getSimCardStateLabel(item?.state || 10)}
                      </p>
                    </div>
                    <HorizontalLine />
                    <div className="flex w-full flex-row items-center justify-between">
                      <p className="text-base font-normal text-grey">
                        نوع سیم کارت
                      </p>
                      <p className="text-base font-normal text-grey">
                        {getSimCardTypeLabel(item?.type || 10)}
                      </p>
                    </div>
                    <HorizontalLine />
                    <div className="flex w-full flex-row items-center justify-between">
                      <p className="text-base font-normal text-grey">قیمت</p>
                      <div className="flex flex-row items-center gap-[2px]">
                        <p className="text-xl font-medium text-blue">
                          {persianNumber(item?.price || "")}
                        </p>
                        <p className="text-sm font-light text-grey">تومان</p>
                      </div>
                    </div>
                  </div>
                ))}
                {(cart?.serviceName === "highBid-offer-simcard" ||
                  cart?.serviceName === "highBid-offer-simPack") && (
                  <div className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-6">
                    <div className="mb-4 flex w-full items-center justify-center rounded-t-2xl bg-primary p-4 text-2xl font-semibold text-white">
                      <p>پیشنهاد شما (بالاترین پیشنهاد)</p>
                    </div>
                    <div className="flex w-full flex-row items-center justify-between">
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-base font-normal text-grey">
                          پیشنهاد
                        </p>
                        <div className="flex flex-row items-center gap-[2px]">
                          <p className="text-xl font-medium text-blue">
                            {persianNumber(cart?.payload.bidPrice || 0)}
                          </p>
                          <p className="text-sm font-light text-grey">تومان</p>
                        </div>
                      </div>
                    </div>
                    <HorizontalLine />
                    <div className="flex w-full flex-row items-center justify-between">
                      <p className="text-base font-normal text-grey">تاریخ</p>
                      <p className="text-base font-normal text-grey">
                        {new Date().toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                  </div>
                )}
                {cart?.serviceName === "specialSim-offer" &&
                  !!cart?.preview?.offer && (
                    <div className="flex w-full flex-col gap-3 rounded-2xl border border-grey-200 bg-white p-6">
                      <div className="mb-4 flex w-full items-center justify-center rounded-t-2xl bg-primary p-4 text-2xl font-semibold text-white">
                        <p>پیشنهاد شما (سیم خواست)</p>
                      </div>
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-base font-normal text-grey">
                          شماره پیشنهادی
                        </p>
                        <p className="text-base font-normal text-grey">
                          {persianNumber(cart.preview.offer.phoneNumber)}
                        </p>
                      </div>
                      <HorizontalLine />
                      <div className="flex w-full flex-row items-center justify-between">
                        <div className="flex w-full flex-row items-center justify-between">
                          <p className="text-base font-normal text-grey">
                            قیمت پیشنهادی
                          </p>
                          <div className="flex flex-row items-center gap-[2px]">
                            <p className="text-xl font-medium text-blue">
                              {persianNumber(cart.preview.offer.price)}
                            </p>
                            <p className="text-sm font-light text-grey">
                              تومان
                            </p>
                          </div>
                        </div>
                      </div>
                      <HorizontalLine />
                      <div className="flex w-full flex-row items-center justify-between">
                        <p className="text-base font-normal text-grey">تاریخ</p>
                        <p className="text-base font-normal text-grey">
                          {new Date().toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>
                  )}
              </div>
              <div className="min-w-[440px] rounded-2xl border border-grey-200 bg-white p-6">
                <div className="flex w-full flex-col gap-4">
                  <div className="flex w-full flex-row items-center justify-between">
                    <p className="text-base font-normal text-grey">
                      تعداد سرویس
                    </p>
                    <p className="text-base font-normal text-grey">{`${persianNumber(cart?.count || 0)} عدد`}</p>
                  </div>
                  <HorizontalLine />
                  <div className="flex w-full flex-row items-center justify-between">
                    <p className="text-base font-normal text-grey">نوع سرویس</p>
                    <p className="text-base font-medium text-grey">
                      {cart?.serviceNameFa}
                    </p>
                  </div>
                  <HorizontalLine />
                  <button className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white">
                    تایید
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <ApplyCartModal
        open={applyCartOpen}
        handleClose={handleApplyCartClose}
        applyCartData={appliedCart}
      />
    </>
  );
}

function CartPreview({
  serviceNameFa,
  count,
  sellerSpells,
  handleSubmit,
  submitLoading,
}: {
  serviceNameFa: string;
  count: number;
  sellerSpells: string[];
  handleSubmit: () => void;
  submitLoading: boolean;
}) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-[558px] flex-col items-center gap-4 rounded-2xl border border-grey-200 bg-white p-6 pt-11">
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="text-base font-normal leading-5 text-grey">
              نوع سرویس
            </h2>
            <p className="text-base font-medium leading-5 text-grey">
              {serviceNameFa}
            </p>
          </div>
          <HorizontalLine />
          <div className="flex w-full flex-row items-center justify-between">
            <h2 className="text-base font-normal leading-5 text-grey">
              تعداد سرویس
            </h2>
            <p className="text-base font-medium leading-5 text-grey">
              {persianNumber(count) + " عدد"}
            </p>
          </div>
          <HorizontalLine />
        </div>
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2">
          {sellerSpells.map((item, index) => (
            <div
              key={index}
              className="flex h-[52px] w-[250px] items-center justify-center rounded-md bg-[#f7f7f7] p-4 text-base font-medium leading-5 text-grey"
            >
              {persianNumber(item)}
            </div>
          ))}
        </div>
        <button
          className="flex w-full items-center justify-center rounded-md bg-grey p-4"
          onClick={handleSubmit}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <Spinner />
          ) : (
            <p className="text-[17px] font-bold leading-6 text-white">تایید</p>
          )}
        </button>
      </div>
    </div>
  );
}

function CartPaymentMethods({
  cart,
  handleSubmit,
  handleSubscriptionCartClose,
  submitLoading,
  step,
  handleChangeStep,
}: {
  cart: Cart;
  handleSubmit: (paymentMethod: TransactionSource) => void;
  handleSubscriptionCartClose: () => void;
  submitLoading: boolean;
  step: number;
  handleChangeStep: (step: number) => void;
}) {
  const { auth } = useContext(AuthContext);
  const { setSubscriptionCartDialogOpen } = useContext(CartDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [offeredPlans, setOfferedPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<TransactionSource | null>(
    cart.paymentData.preferredPayment,
  );
  const [subscriptionCartId, setSubscriptionCartId] = useState<string>();

  useEffect(() => {
    handleGetOfferedPlans();
  }, []);

  const handleGetOfferedPlans = async () => {
    if (
      cart.service === "specialPlan" ||
      cart.paymentData.subscriptionResponse.hasSub
    )
      return;

    setPlansLoading(true);

    try {
      const res = await getOfferedPlans(
        10,
        [
          { field: "serviceNames", oprand: "in", value: [cart.serviceName] },
          { field: "isActive", oprand: "=", value: true },
        ],
        { field: "_id", order: -1 },
      );
      setOfferedPlans(res.plans);
    } catch (error) {
      setOfferedPlans([]);
    } finally {
      setPlansLoading(false);
    }
  };

  const handlePreAddPlan = async (plan: Plan) => {
    setPlansLoading(true);

    try {
      const response = await preAddPlan(auth.token, {
        planId: plan._id,
        // subPlan: plan.subPlan,
      });
      setSubscriptionCartId(response.cartId);
      setSubscriptionCartDialogOpen(true);
    } catch (error) {
      setSubscriptionCartId(undefined);
      console.log(error);
    } finally {
      setPlansLoading(false);
    }
  };

  const handleSubmitPaymentMethod = () => {
    if (step === 1) {
      handleChangeStep(2);
      return;
    }

    if (!paymentMethod) return;

    handleSubmit(paymentMethod);
  };

  return (
    <>
      <div className="flex h-full w-full flex-col items-start gap-8 md:flex-row md:justify-center">
        {(!fullScreen || (fullScreen && step === 2)) && (
          <div className="flex w-full flex-col items-center p-6 md:rounded-2xl md:border md:border-grey-200 md:bg-white">
            <p className="mb-4 text-base font-medium leading-6 text-grey">
              شما می‌توانید از یکی از روش‌های زیر برای پرداخت استفاده کنید:
            </p>
            <RadioGroup
              name="paymentMethod"
              value={paymentMethod}
              onChange={(event, value) =>
                setPaymentMethod(value as TransactionSource)
              }
              sx={{
                width: "100%",
                gap: "16px",
              }}
            >
              <div
                onClick={() =>
                  cart.paymentData.walletResponse.hasBlance
                    ? setPaymentMethod("wallet")
                    : setPaymentMethod("pay")
                }
                className="flex w-full cursor-pointer flex-col items-center gap-5 rounded-lg border border-grey-200 bg-white p-4"
              >
                <div className="flex w-full flex-row items-center justify-between">
                  <div className="flex flex-row items-center justify-start gap-1">
                    <Image
                      src="/icons/icon-wallet.svg"
                      alt=""
                      width={24}
                      height={24}
                    />
                    <h3 className="text-base font-medium leading-5 text-grey">
                      پرداخت با کیف پول
                    </h3>
                  </div>
                  <Radio
                    checked={
                      paymentMethod === "wallet" || paymentMethod === "pay"
                    }
                    value={
                      cart.paymentData.walletResponse.hasBlance
                        ? "wallet"
                        : "pay"
                    }
                    sx={{
                      padding: "0 !important",
                    }}
                  />
                </div>
                <div className="flex w-full flex-row items-center justify-between">
                  <h3 className="text-base font-normal leading-5 text-grey">
                    موجودی اعتبار
                  </h3>
                  <p className="leading-5 text-grey">
                    <span className="text-xl font-bold">
                      {persianNumber(
                        cart.paymentData.walletResponse.availableBalance,
                      )}
                    </span>
                    <span className="text-sm font-light"> تومان</span>
                  </p>
                </div>
                <WalletChargeDialog />
              </div>
              {cart.service !== "specialPlan" && (
                <>
                  {cart.paymentData.allowPayments.includes("trial") &&
                    !!cart.paymentData.trialResponse && (
                      <>
                        <div className="mt-2 flex w-full flex-row items-start justify-start gap-2">
                          <Image
                            src="/icons/icon-calendar-arrow.svg"
                            alt=""
                            width={18}
                            height={18}
                          />
                          <div className="flex flex-col items-start gap-2">
                            <p className="text-base font-medium leading-5 text-grey">
                              استفاده آزمایشی
                            </p>
                            <p className="text-sm font-normal leading-5 text-grey-800">
                              این بسته به صورت ماهانه و رایگان در اختیار شما
                              قرار میگیرد.
                            </p>
                          </div>
                        </div>
                        <AvailablePlanRadioCard
                          title=""
                          period={
                            cart.paymentData.trialResponse.period
                              ? persianNumber(
                                  cart.paymentData.trialResponse.period,
                                ) + " روزه"
                              : "نامشخص"
                          }
                          totalSubscriptionsCount={
                            cart.paymentData.trialResponse.counter
                              ? persianNumber(
                                  cart.paymentData.trialResponse.counter,
                                ) + " عدد"
                              : "نامشخص"
                          }
                          remainingSubscriptionsCount={
                            cart.paymentData.trialResponse.finalRemain !==
                            undefined
                              ? persianNumber(
                                  cart.paymentData.trialResponse.finalRemain,
                                ) + " عدد"
                              : "نامشخص"
                          }
                          checked={paymentMethod === "trial"}
                          onClick={() => setPaymentMethod("trial")}
                        />
                      </>
                    )}
                  {cart.paymentData.subscriptionResponse.hasSub ? (
                    <>
                      <div className="mt-2 flex w-full flex-row items-start justify-start gap-2">
                        <Image
                          src="/icons/icon-calendar-arrow.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                        <div className="flex flex-col items-start gap-2">
                          <p className="text-base font-medium leading-5 text-grey">
                            استفاده از بسته‌های اشتراکی
                          </p>
                          <p className="text-sm font-normal leading-5 text-grey-800">
                            اشتراک های شما
                          </p>
                        </div>
                      </div>
                      <AvailablePlanRadioCard
                        title={
                          cart.paymentData.subscriptionResponse.serviceNameFa ||
                          "نامشخص"
                        }
                        period={
                          cart.paymentData.subscriptionResponse.period
                            ? persianNumber(
                                cart.paymentData.subscriptionResponse.period,
                              ) + " روزه"
                            : "نامشخص"
                        }
                        remainingDays={
                          cart.paymentData.subscriptionResponse.expireDate
                            ? getRemainingTime(
                                cart.paymentData.subscriptionResponse
                                  .expireDate,
                              )
                            : undefined
                        }
                        totalSubscriptionsCount={
                          cart.paymentData.subscriptionResponse.counter
                            ? persianNumber(
                                cart.paymentData.subscriptionResponse.counter,
                              ) + " عدد"
                            : "نامشخص"
                        }
                        remainingSubscriptionsCount={
                          cart.paymentData.subscriptionResponse.finalRemain !==
                          undefined
                            ? persianNumber(
                                cart.paymentData.subscriptionResponse
                                  .finalRemain,
                              ) + " عدد"
                            : "نامشخص"
                        }
                        checked={paymentMethod === "subscription"}
                        onClick={() => setPaymentMethod("subscription")}
                      />
                    </>
                  ) : (
                    <>
                      <div className="mt-2 flex w-full flex-row items-start justify-start gap-2">
                        <Image
                          src="/icons/icon-calendar-arrow.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                        <div className="flex flex-col items-start gap-2">
                          <p className="text-base font-medium leading-5 text-grey">
                            خرید بسته‌های اشتراکی
                          </p>
                          <p className="text-sm font-normal leading-5 text-grey-800">
                            با استفاده هر یک از بسته‌های زیر از شرایط بسته‌ها
                            برخوردار شوید
                          </p>
                        </div>
                      </div>
                      {offeredPlans.map((item, index) => (
                        <OfferedPlanAccordion
                          key={index}
                          plan={item}
                          onBuyClick={() => {
                            handlePreAddPlan(item);
                          }}
                        />
                      ))}
                    </>
                  )}
                </>
              )}
            </RadioGroup>
          </div>
        )}
        <div className="flex w-full flex-col items-center gap-4 p-6 md:p-0">
          {(!fullScreen || (fullScreen && step === 1)) && (
            <div className="flex w-full flex-col items-start gap-4 rounded-lg bg-white p-4 md:rounded-2xl md:border md:border-grey-200 md:p-6">
              {cart.service === "specialPlan" ? (
                <div className="flex w-full flex-col items-start gap-4">
                  <div className="flex w-full flex-row items-center justify-between">
                    <h2 className="text-base font-medium leading-5 text-grey">
                      {cart.serviceNameFa}
                    </h2>
                    <div className="hidden rounded-lg bg-biege px-2 py-[2px] text-[10px] font-medium leading-5 text-brown md:flex">
                      {persianNumber(cart.preview.period || 0) + " روزه"}
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start gap-3">
                    {cart.preview.subList.map((subItem, subIndex) => (
                      <div
                        key={subIndex}
                        className="flex w-full flex-row items-center justify-start gap-2"
                      >
                        <Image
                          src="/icons/icon-check-biege-circle.svg"
                          alt=""
                          width={18}
                          height={18}
                        />
                        <p className="text-sm font-normal leading-5 text-grey">
                          {subItem.serviceNameFa}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <p className="hidden text-base font-medium leading-6 text-grey md:flex">
                    آگهی‌های انتخاب شده:
                  </p>
                  <div className="flex w-full flex-col items-center gap-4 md:hidden">
                    <Space value={0} />
                    <div className="flex w-full flex-row items-center justify-between">
                      <h2 className="text-base font-normal leading-5 text-grey">
                        نوع سرویس
                      </h2>
                      <p className="text-base font-medium leading-5 text-grey">
                        {cart.serviceNameFa}
                      </p>
                    </div>
                    <HorizontalLine />
                    {(paymentMethod === "wallet" ||
                      paymentMethod === "pay") && (
                      <>
                        <div className="flex w-full flex-row items-center justify-between">
                          <h2 className="text-base font-normal leading-5 text-grey">
                            <span>قیمت نهایی</span>
                            <span className="text-sm">{` (${persianNumber(cart.paymentData.count)} عدد)`}</span>
                          </h2>
                          <p className="">
                            <span className="text-lg font-bold leading-5 text-grey">
                              {persianNumber(
                                cart.paymentData.amount /
                                  cart.paymentData.count,
                              )}
                            </span>
                            <span className="text-sm font-light leading-5 text-grey">
                              {" "}
                              تومان
                            </span>
                          </p>
                        </div>
                        <HorizontalLine />
                      </>
                    )}
                    {(paymentMethod === "subscription" ||
                      paymentMethod === "trial") && (
                      <>
                        <div className="flex w-full flex-row items-center justify-between">
                          <h2 className="text-base font-normal leading-5 text-grey">
                            تعداد سرویس
                          </h2>
                          <p className="text-base font-medium leading-5 text-grey">
                            {persianNumber(cart.paymentData.count || 0) +
                              " عدد"}
                          </p>
                        </div>
                        <HorizontalLine />
                      </>
                    )}
                  </div>
                  <div className="flex w-full flex-col items-center justify-center gap-[10px] md:flex-row md:flex-wrap md:gap-2">
                    {(cart.service === "offPrice" ||
                    cart.service === "vipSim" ||
                    cart.service === "update"
                      ? cart.preview.simcards?.map(
                          (item) => item?.sellerSpel || "",
                        ) || []
                      : cart.service === "telegram"
                        ? cart.preview.simcards?.map(
                            (item) => item?.phoneNumber || "",
                          ) || []
                        : cart.payload.simcards?.map(
                            (item) => item?.phoneNumber || "",
                          ) || []
                    ).map((item, index) => (
                      <div
                        key={index}
                        className="flex h-[44px] w-full items-center justify-center rounded-md bg-[#f7f7f7] px-4 py-3 text-base font-medium leading-5 text-grey md:w-[189px]"
                      >
                        {persianNumber(item)}
                      </div>
                    ))}
                  </div>
                  {cart.service === "offPrice" ? (
                    <div className="hidden h-14 w-full flex-row items-center justify-between rounded-md bg-biege-200 p-3 text-base font-normal leading-5 text-grey md:flex">
                      <p>درصد تخفیف</p>
                      <p>
                        <span>٪ </span>
                        <span>
                          {persianNumber(cart.preview?.offPercent || 0)}
                        </span>
                      </p>
                    </div>
                  ) : cart.service === "vipSim" ? (
                    <div className="hidden h-14 w-full flex-row items-center justify-between rounded-md bg-biege-200 p-3 text-base font-normal leading-5 text-grey md:flex">
                      <p>سطح</p>
                      <p>{getSimCardLevelLabel(cart.preview?.vipType || 0)}</p>
                    </div>
                  ) : cart.service === "telegram" ? (
                    <>
                      <p className="text-base font-medium leading-6 text-grey">
                        کانال‌های انتخاب شده:
                      </p>
                      <div className="hidden h-14 w-full flex-row items-center justify-center gap-x-[10px] rounded-md bg-biege-200 p-3 text-base font-normal leading-5 text-grey md:flex">
                        {cart.preview.channels?.map((channel) => (
                          <div
                            key={channel.channelId}
                            className="flex w-[50%] flex-row items-center justify-center gap-2 rounded-md bg-white p-2"
                          >
                            <Image
                              src={
                                channel.channelPlatform === "telegram"
                                  ? "/icons/logo-telegram.svg"
                                  : "/icons/logo-bale.svg"
                              }
                              alt=""
                              width={18}
                              height={18}
                            />
                            <span className="text-sm font-medium leading-6 text-grey">
                              {channel.channelId}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : cart.service === "update" ? (
                    <></>
                  ) : (
                    <div className="hidden h-14 w-full flex-row items-center justify-start rounded-md bg-biege-200 p-3 text-base font-normal leading-5 text-grey md:flex">
                      {cart.serviceNameFa}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          <div className="flex md:hidden">
            <Space value={16} />
          </div>
          <div className="fixed bottom-0 left-0 flex h-20 w-full flex-row items-center justify-between gap-2 border-t border-grey-100 bg-white p-4 md:hidden">
            {paymentMethod === "pay" && (
              <div className="flex w-full flex-col items-start gap-3">
                <p className="font-mediumtext-base leading-5 text-grey">
                  اعتبار مورد نیاز
                </p>
                <p>
                  <span className="text-xl font-bold leading-6 text-blue">
                    {persianNumber(
                      cart.paymentData.walletResponse.needBalance || "نامشخص",
                    )}
                  </span>
                  <span className="text-sm font-normal leading-5 text-grey">
                    {" "}
                    تومان
                  </span>
                </p>
              </div>
            )}
            <CustomButton
              label={
                step === 1
                  ? "تایید"
                  : paymentMethod === "pay"
                    ? "پرداخت"
                    : paymentMethod === "wallet"
                      ? "کسر از اعتبار"
                      : paymentMethod === "subscription"
                        ? "استفاده از اشتراک"
                        : paymentMethod === "trial"
                          ? "استفاده از طرح آزمایشی"
                          : "لطفا روش پرداخت را انتخاب کنید"
              }
              loading={submitLoading}
              disabled={
                submitLoading ||
                !paymentMethod ||
                !cart.paymentData.allowPayments.includes(paymentMethod)
              }
              handleSubmit={handleSubmitPaymentMethod}
            />
          </div>
          <div className="hidden w-full flex-col items-start gap-4 rounded-2xl border border-grey-200 bg-white p-6 md:flex">
            <div className="flex w-full flex-col items-center gap-4">
              <div className="flex w-full flex-row items-center justify-between">
                <h2 className="text-base font-normal leading-5 text-grey">
                  نوع سرویس
                </h2>
                <p className="text-base font-medium leading-5 text-grey">
                  {cart.serviceNameFa}
                </p>
              </div>
              <HorizontalLine />
              {(paymentMethod === "wallet" || paymentMethod === "pay") && (
                <>
                  <div className="flex w-full flex-row items-center justify-between">
                    <h2 className="text-base font-normal leading-5 text-grey">
                      <span>قیمت نهایی</span>
                      <span className="text-sm">{` (${persianNumber(cart.paymentData.count)} عدد)`}</span>
                    </h2>
                    <p className="">
                      <span className="text-lg font-bold leading-5 text-grey">
                        {persianNumber(
                          cart.paymentData.amount / cart.paymentData.count,
                        )}
                      </span>
                      <span className="text-sm font-light leading-5 text-grey">
                        {" "}
                        تومان
                      </span>
                    </p>
                  </div>
                  <HorizontalLine />
                </>
              )}
              {(paymentMethod === "subscription" ||
                paymentMethod === "trial") && (
                <>
                  <div className="flex w-full flex-row items-center justify-between">
                    <h2 className="text-base font-normal leading-5 text-grey">
                      تعداد سرویس
                    </h2>
                    <p className="text-base font-medium leading-5 text-grey">
                      {persianNumber(cart.paymentData.count || 0) + " عدد"}
                    </p>
                  </div>
                  <HorizontalLine />
                </>
              )}
            </div>
            <div className="flex w-full flex-row items-center justify-center gap-8">
              {paymentMethod === "pay" && (
                <div className="flex w-full flex-col items-start gap-3">
                  <p className="font-mediumtext-base leading-5 text-grey">
                    اعتبار مورد نیاز
                  </p>
                  <p>
                    <span className="text-xl font-bold leading-6 text-blue">
                      {persianNumber(
                        cart.paymentData.walletResponse.needBalance || "نامشخص",
                      )}
                    </span>
                    <span className="text-sm font-normal leading-5 text-grey">
                      {" "}
                      تومان
                    </span>
                  </p>
                </div>
              )}
              <CustomButton
                label={
                  paymentMethod === "pay"
                    ? "پرداخت"
                    : paymentMethod === "wallet"
                      ? "کسر از اعتبار"
                      : paymentMethod === "subscription"
                        ? "استفاده از اشتراک"
                        : paymentMethod === "trial"
                          ? "استفاده از طرح آزمایشی"
                          : "لطفا روش پرداخت را انتخاب کنید"
                }
                loading={submitLoading}
                disabled={
                  submitLoading ||
                  !paymentMethod ||
                  !cart.paymentData.allowPayments.includes(paymentMethod)
                }
                handleSubmit={handleSubmitPaymentMethod}
              />
            </div>
          </div>
        </div>
      </div>
      {!!subscriptionCartId && (
        <CartModal
          cartId={subscriptionCartId}
          isSubscripitonCart
          onCloseSubscriptionCart={handleSubscriptionCartClose}
        />
      )}
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
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}

function SkeletonComponent() {
  return (
    <div className="flex w-full flex-row items-start gap-8">
      <div className="flex w-full flex-col gap-5 rounded-2xl border border-grey-200 bg-white p-6">
        <Skeleton variant="rounded" height={64} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
      </div>
      <div className="flex min-w-[440px] flex-col gap-5 rounded-2xl border border-grey-200 bg-white p-6">
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={24} />
        <Skeleton variant="rounded" height={64} />
      </div>
    </div>
  );
}
