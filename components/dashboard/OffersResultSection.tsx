"use client";

import { useContext, useEffect, useState } from "react";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import TransactionSkeleton from "../skeletons/TransactionSkeleton";
import { useRouter } from "next/navigation";
import OfferCard from "../cards/OfferCard";
import getOffers from "@/lib/api/getOffers";
import { GetMyOffersResponseProps, MyOffer } from "@/lib/entities/myOffer";

export default function OffersResultSection({
  filters,
  sort,
  mode,
}: {
  filters: RequestFilter[];
  sort: RequestSort;
  mode: string;
}) {
  const router = useRouter();
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<MyOffer[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();

  useEffect(() => {
    if (!auth.token) return;

    setClientSideResult([]);
    setSkip(0);
    handleGetNewResults(0);
  }, [auth.token, filters]);
  console.log({ skip });
  async function handleGetNewResults(skip: number) {
    if (skip > clientSideResult!.length) return;
    console.log("handlegetresult");
    setLoading(true);

    try {
      const getMyOffersResponse: GetMyOffersResponseProps = await getOffers(
        auth.token,
        mode,
        9,
        filters,
        sort,
        skip,
      );
      setClientSideResult((prev) => [
        ...prev,
        ...(getMyOffersResponse?.data?.filter(
          (newItem) => !prev.some((item) => item._id === newItem._id),
        ) || []),
      ]);
      setSkip((prev) => prev + 9);
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
        toast.error("خطا در دریافت لیست پیشنهادها");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading || !auth.token) return;

    const scrollFraction = scrollPosition / scrollLimit;
    if (scrollFraction > 0.8 && scrollDirection === -1)
      handleGetNewResults(skip);
  }, [auth.token, scrollPosition, scrollLimit, skip]);

  return (
    <div className="flex w-full flex-row flex-wrap items-start justify-start gap-4">
      {clientSideResult.map((offer) => (
        <OfferCard
          key={offer._id}
          title={offer.simcards.map((item) => item.sellerSpel)}
          date={offer.highBidData.expireDate}
          bid={offer.bidPrice}
          highestBid={offer.highestBidPrice}
          footer={offer.desc}
          onClick={() => router.push(offer.redirect)}
        />
      ))}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <TransactionSkeleton key={index} />)}
    </div>
  );
}
