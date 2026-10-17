"use client";

import { useContext, useEffect, useState } from "react";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { GetMyPlansResponseProps, MyPlan } from "@/lib/entities/plan";
import getMyPlans from "@/lib/api/getMyPlans";
import MyPlanCard from "../cards/MyPlanCard";
import MyPlanSkeleton from "../skeletons/MyPlanSkeleton";
import MyPlanDetailsDialog from "./MyPlanDetailsDialog";

export default function MyPlansResultSection({
  filters,
  sort,
}: {
  filters: RequestFilter[];
  sort: RequestSort;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<MyPlan[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();
  const [selectedPlan, setSelectedPlan] = useState<MyPlan>();

  useEffect(() => {
    if (!auth.token) return;

    setClientSideResult([]);
    setSkip(0);
    handleGetNewResults(0);
  }, [auth.token, filters]);
  console.log({ skip });
  async function handleGetNewResults(skip: number) {
    if (skip > clientSideResult!.length) return;

    setLoading(true);

    try {
      const getMyPlansResponse: GetMyPlansResponseProps = await getMyPlans(
        auth.token,
        9,
        filters,
        sort,
        skip,
      );
      setClientSideResult((prev) => [
        ...prev,
        ...(getMyPlansResponse?.data.plans?.filter(
          (newItem) => !prev.some((item) => item.id === newItem.id),
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
        toast.error("خطا در دریافت لیست بسته ها");
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
      {clientSideResult.map((plan) => (
        <MyPlanCard
          key={plan.id}
          title={plan.serviceNameFa}
          period={plan.period}
          expireDate={plan.endDate}
          onClick={() => {
            setSelectedPlan(plan);
          }}
        />
      ))}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <MyPlanSkeleton key={index} />)}
      <MyPlanDetailsDialog
        selectedPlan={selectedPlan}
        handleClose={() => {
          setSelectedPlan(undefined);
        }}
      />
    </div>
  );
}
