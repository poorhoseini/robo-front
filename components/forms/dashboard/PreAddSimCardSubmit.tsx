"use client";

import CartModal from "@/components/cart/CartModal";
import Spinner from "@/components/general/Spinner";
import { ResponseError } from "@/lib/api/error";
import preAddHighestBid from "@/lib/api/preAddHighestBid";
import preAddSimCard from "@/lib/api/preAddSimCard";
import { Service } from "@/lib/entities/cart";
import {
  PreAddSimCard,
  PreAddSimCardRequestProps,
  PreAddSimCardResponseProps,
} from "@/lib/entities/preAddSimCard";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { useSavedItems } from "@/lib/zustand/addSimCard";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

export default function PreAddSimCardSubmit({
  service,
  isBlack = false,
}: {
  service: Service;
  isBlack?: boolean;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const savedItems = useSavedItems();
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleFinalSubmit = () => {
    switch (service) {
      case "simcard":
        return handlePreAddSimCards();
      case "highBid-simcard":
        return handlePreAddHighestBids();
      default:
        return false;
    }
  };

  const handlePreAddSimCards = async () => {
    setLoading(true);

    const payloadSimCards: PreAddSimCard[] = [];

    for (const savedItem of savedItems) {
      payloadSimCards.push({
        phoneNumber: savedItem.phoneNumber,
        price: Number(savedItem.price),
        priceType: Number(savedItem.priceType),
        provinceId: Number(savedItem.province?.id),
        cityId: Number(savedItem.city?.id),
        state: Number(savedItem.status),
        type: Number(savedItem.type),
        isInstallment: savedItem.hasInstallmentPlan,
        installmentPlanId: savedItem.loanId || undefined,
      });
    }

    const payload: PreAddSimCardRequestProps = {
      simcards: payloadSimCards,
    };

    try {
      const response: PreAddSimCardResponseProps = await preAddSimCard(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در اضافه کردن سیم کارت");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreAddHighestBids = async () => {
    setLoading(true);

    const payloadSimCards: PreAddSimCard[] = [];

    for (const savedItem of savedItems) {
      payloadSimCards.push({
        phoneNumber: savedItem.phoneNumber,
        price: Number(savedItem.price),
        priceType: 2,
        provinceId: Number(savedItem.province?.id),
        cityId: Number(savedItem.city?.id),
        state: Number(savedItem.status),
        type: Number(savedItem.type),
        isInstallment: savedItem.hasInstallmentPlan,
        installmentPlanId: savedItem.loanId || undefined,
      });
    }

    const payload: PreAddSimCardRequestProps = {
      simcards: payloadSimCards,
    };

    try {
      const response: PreAddSimCardResponseProps = await preAddHighestBid(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در اضافه کردن بالاترین پیشنهاد سیم کارت");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className={`flex h-full w-full flex-row items-center justify-center gap-2 rounded-md border-[1.4px] border-grey  ${isBlack ? "bg-grey text-white" : "bg-white text-grey"}`}
        disabled={loading}
        onClick={handleFinalSubmit}
      >
        {loading ? (
          <Spinner />
        ) : (
          <>
            <p className="text-[17px] font-bold">ثبت نهایی آگهی</p>
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-normal leading-[14px] ${isBlack ? "bg-white text-grey" : "bg-grey text-white"}`}
            >
              {persianNumber(savedItems.length)}
            </div>
          </>
        )}
      </button>
      {!!cartId && <CartModal cartId={cartId} />}
    </>
  );
}
