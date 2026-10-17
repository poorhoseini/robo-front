"use client";

import { useContext, useEffect, useState } from "react";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import TransactionSkeleton from "../skeletons/TransactionSkeleton";
import { GetPredictsResponseProps, Predict } from "@/lib/entities/predict";
import getPredicts from "@/lib/api/getPredicts";
import PredictCard from "../cards/PredictCard";
import PredictDetailsDialog from "./PredictDetailsDialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PredictsResultSection({
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
  const [clientSideResult, setClientSideResult] = useState<Predict[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();
  const [selectedPredictId, setSelectedPredictId] = useState(initialPredictId);

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
      const getPredictsResponse: GetPredictsResponseProps = await getPredicts(
        auth.token,
        9,
        filters,
        sort,
        skip,
      );
      setClientSideResult((prev) => [
        ...prev,
        ...(getPredictsResponse?.data?.filter(
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
        toast.error("خطا در دریافت لیست تخمین قیمت ها");
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
      {clientSideResult.map((predict) => (
        <PredictCard
          key={predict._id}
          predictType="ai"
          type={predict.simcard.type}
          state={predict.simcard.state}
          title={predict.simcard.phoneNumber}
          accuracy={predict.accuracy}
          date={predict.createDate}
          onClick={() => setSelectedPredictId(predict._id)}
          price={predict.prices.finalPrice}
        />
      ))}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <TransactionSkeleton key={index} />)}
      <PredictDetailsDialog
        selectedPredictId={selectedPredictId}
        handleClose={() => {
          if (searchParams.get("id")) {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("id");
            router.replace(`${pathname}?${params}`);
          }
          setSelectedPredictId(undefined);
        }}
      />
    </div>
  );
}
