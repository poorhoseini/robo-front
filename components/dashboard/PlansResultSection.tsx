"use client";

import { useContext, useEffect, useState } from "react";
import Space from "../general/Space";
import PlanTabsSection from "./PlanTabsSection";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { Plan } from "@/lib/entities/plan";
import getOfferedPlans from "@/lib/api/getPlans";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import OfferedPlanCard from "../cards/OfferedPlanCard";
import preAddPlan from "@/lib/api/preAddPlan";
import CartModal from "../cart/CartModal";
import { Skeleton } from "@mui/material";

export default function PlansResultSection() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>();
  const { auth } = useContext(AuthContext);
  const { setSubscriptionCartDialogOpen } = useContext(CartDialogContext);
  const [offeredPlans, setOfferedPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [subscriptionCartId, setSubscriptionCartId] = useState<string>();

  useEffect(() => {
    handleGetOfferedPlans();
  }, []);

  const handleGetOfferedPlans = async () => {
    setLoading(true);

    try {
      const res = await getOfferedPlans(
        10,
        [{ field: "isActive", oprand: "=", value: true }],
        { field: "_id", order: -1 },
      );
      setOfferedPlans(res.plans);
      setSelectedPlan(res.plans.length ? res.plans[0] : undefined);
    } catch (error) {
      setOfferedPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePreAddPlan = async (plan: Plan) => {
    setAddLoading(true);

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
      setAddLoading(false);
    }
  };

  return (
    <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
      {loading ? (
        <PlanTabsSectionSkeleton />
      ) : (
        <PlanTabsSection
          selectedTab={
            selectedPlan
              ? {
                  id: selectedPlan._id,
                  label: selectedPlan.serviceNameFa,
                  value: selectedPlan._id,
                }
              : undefined
          }
          tabs={offeredPlans.map((plan) => ({
            id: plan._id,
            label: plan.serviceNameFa,
            value: plan._id,
          }))}
          onTabChange={(tab) =>
            setSelectedPlan(offeredPlans.find((plan) => plan._id === tab.value))
          }
        />
      )}
      <Space value={40} />
      {loading ? (
        <OfferedPlanCardSkeleton />
      ) : selectedPlan ? (
        <OfferedPlanCard
          plan={selectedPlan}
          onBuyClick={() => handlePreAddPlan(selectedPlan)}
          buttonLoading={addLoading}
        />
      ) : (
        <p className="w-full">بسته ای انتخاب نشده است</p>
      )}
      {!!subscriptionCartId && (
        <CartModal cartId={subscriptionCartId} isSubscripitonCart />
      )}
    </div>
  );
}

function PlanTabsSectionSkeleton() {
  return (
    <div className="flex w-full flex-row items-center justify-start gap-6">
      {new Array(3).fill(1).map((item, index) => (
        <Skeleton key={index} variant="rounded" width={160} height={48} />
      ))}
    </div>
  );
}

function OfferedPlanCardSkeleton() {
  return <Skeleton variant="rounded" width={"100%"} height={258} />;
}
