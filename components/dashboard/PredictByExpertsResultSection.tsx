"use client";

import { useContext, useEffect, useState } from "react";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import TransactionSkeleton from "../skeletons/TransactionSkeleton";
import {
  GetPredictByExpertsResponseProps,
  PredictByExpert,
} from "@/lib/entities/predict";
import getPredictByExperts from "@/lib/api/getPredictByExperts";
import PredictCard from "../cards/PredictCard";
import PredictByExpertDetailsDialog from "./PredictByExpertDetailsDialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PredictByExpertsResultSection({
  filters,
  sort,
  initialPredictId,
  direction = "horizontal",
}: {
  filters: RequestFilter[];
  sort: RequestSort;
  initialPredictId?: string;
  direction?: "horizontal" | "vertical";
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<PredictByExpert[]>(
    [],
  );
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();
  const [selectedPredictByExpertId, setSelectedPredictByExpertId] =
    useState(initialPredictId);

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
      const predictByExpertssResponse: GetPredictByExpertsResponseProps =
        await getPredictByExperts(auth.token, 9, filters, sort, skip);
      setClientSideResult((prev) => [
        ...prev,
        ...(predictByExpertssResponse?.data?.filter(
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
        toast.error("خطا در دریافت لیست کارشناسی ها");
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
    <div
      className={`flex flex-nowrap items-center justify-start gap-4 md:w-full md:flex-wrap ${direction === "horizontal" ? "w-[1264px] flex-row" : "w-full flex-col"}`}
    >
      {clientSideResult.map((predictByExpert) => (
        <PredictCard
          key={predictByExpert._id}
          predictType="expert"
          type={predictByExpert.type}
          state={predictByExpert.state}
          title={predictByExpert.phoneNumber}
          date={predictByExpert.createDate}
          onClick={() => setSelectedPredictByExpertId(predictByExpert._id)}
          isDone={predictByExpert.isDone}
          priceRange={
            predictByExpert.lowPrice && predictByExpert.highPrice
              ? [predictByExpert.lowPrice, predictByExpert.highPrice]
              : undefined
          }
        />
      ))}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <TransactionSkeleton key={index} />)}
      <PredictByExpertDetailsDialog
        selectedPredictByExpertId={selectedPredictByExpertId}
        handleClose={() => {
          if (searchParams.get("id")) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("id");
            router.replace(`${pathname}?${params}`);
          }
          setSelectedPredictByExpertId(undefined);
        }}
      />
    </div>
  );
}
