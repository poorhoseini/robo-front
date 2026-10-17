"use client";

import {
  GetSingleSimCardPageResponseProps,
  SingleSimCard,
} from "@/lib/entities/singleSimCard";
import SimCardDetailCard from "@/components/simCardPages/SimCardDetailCard";
import getMySingleSimCardPage from "@/lib/api/getMySingleSimCardPage";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import ViewsGraphCard from "@/components/mySimcardPages/ViewsGraphCard";
import {
  GraphData,
  SimViewsGraphDataRequestProps,
  SimViewsGraphDataResponseProps,
} from "@/lib/entities/simViewsGraphData";
import getMySimViewsGraphData from "@/lib/api/getMySimViewsGraphData";
import SingleOperationsSection from "@/components/dashboard/SingleOperationsSection";
import SimCardDetailCardSkeleton from "../skeletons/SimCardDetailCardSkeleton";
import ViewsGraphCardSkeleton from "../skeletons/ViewsGraphCardSkeleton";
import { ServiceType } from "@/lib/entities/landingPage";
import { GetSimPackPageResponseProps, SimPack } from "@/lib/entities/simPack";
import {
  GetSimKhastPageResponseProps,
  SimKhast,
} from "@/lib/entities/simKhast";
import getMySimPackPage from "@/lib/api/getMySimPackPage";
import getMySimKhastPage from "@/lib/api/getMySimKhastPage";
import Space from "../general/Space";
import getMySimBidsData from "@/lib/api/getMySimBidsData";
import {
  Bid,
  GetSimBidsRequestProps,
  GetSimBidsResponseProps,
} from "@/lib/entities/bid";
import BidsSection from "./BidsSection";
import BidsSectionSkeleton from "../skeletons/BidsSectionSkeleton";
import {
  GetSimKhastOffersRequestProps,
  GetSimKhastOffersResponseProps,
  SimKhastOffer,
} from "@/lib/entities/simKhastOffer";
import getMySimKhastOffersData from "@/lib/api/getMySimKhastOffersData";
import SimKhastOffersSection from "./SimKhastOffersSection";
import SimKhastOffersSectionSkeleton from "../skeletons/SimKhastOffersSectionSkeleton";
import SingleOperationsDialog from "./SingleOperationsDialog";

export default function SingleOperationsPageLayout({
  id,
  serviceType,
  refetchTrigger,
}: {
  id: string;
  serviceType: ServiceType;
  refetchTrigger: string[];
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [loading, setLoading] = useState(true);
  const [loadingGraphData, setLoadingGraphData] = useState(true);
  const [loadingBidsData, setLoadingBidsData] = useState(true);
  const [loadingSimKhastOffersData, setLoadingSimKhastOffersData] =
    useState(true);
  const [item, setItem] = useState<SingleSimCard | SimPack | SimKhast>();
  const [graphData, setGraphData] = useState<GraphData>();
  const [bidsData, setBidsData] = useState<Bid[]>([]);
  const [simKhastOffersData, setSimKhastOffersData] = useState<SimKhastOffer[]>(
    [],
  );

  const highestBidItem = item as SingleSimCard;
  const simKhastItem = item as SimKhast;

  const serviceLabel =
    serviceType === "simcard"
      ? "سیم کارت تکی"
      : serviceType === "simPack"
        ? "سیم کارت گروهی"
        : serviceType === "specialSim"
          ? "سیم خواست"
          : serviceType === "simcardHighBid"
            ? "بالاترین پیشنهاد سیم کارت"
            : serviceType === "simPackHighBid"
              ? "بالاترین پیشنهاد سیم پک"
              : "نامشخص";

  useEffect(() => {
    if (!auth.token) return;

    handleFetchSimGraphData();

    switch (serviceType) {
      case "simcardHighBid":
      case "simcard":
        handleFetceSingleSimData();
        break;
      case "simPackHighBid":
      case "simPack":
        handleFetchSimPackData();
        break;
      case "specialSim":
        handleFetcheSimKhastData();
        break;
    }
  }, [auth.token, refetchTrigger, serviceType]);

  const handleFetceSingleSimData = async () => {
    setLoading(true);

    try {
      const singleSimCardPageResponse: GetSingleSimCardPageResponseProps =
        await getMySingleSimCardPage(auth.token, id);
      setItem(singleSimCardPageResponse.data);
      handleFetchBidsData(singleSimCardPageResponse.data);
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
        toast.error("خطا در دریافت سیم کارت");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSimPackData = async () => {
    setLoading(true);

    try {
      const simPackPageResponse: GetSimPackPageResponseProps =
        await getMySimPackPage(auth.token, id);
      setItem(simPackPageResponse.data);
      handleFetchBidsData(simPackPageResponse.data);
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
        toast.error("خطا در دریافت سیم پک");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetcheSimKhastData = async () => {
    setLoading(true);

    try {
      const simKhastPageResponse: GetSimKhastPageResponseProps =
        await getMySimKhastPage(auth.token, id);
      setItem(simKhastPageResponse.data);
      handleFetchSimKhastOffersData(simKhastPageResponse.data);
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
        toast.error("خطا در دریافت سیم خواست");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSimGraphData = async () => {
    setLoadingGraphData(true);

    const payload: SimViewsGraphDataRequestProps = {
      refrenceId: id,
      refrence:
        serviceType === "simPackHighBid"
          ? "simPack"
          : serviceType === "simcardHighBid"
            ? "simcard"
            : serviceType,
    };

    try {
      const simGraphDataResponse: SimViewsGraphDataResponseProps =
        await getMySimViewsGraphData(auth.token, payload);
      setGraphData(simGraphDataResponse.data);
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
        toast.error("خطا در دریافت گزارشات تعداد مشاهده سیم کارت");
      }
    } finally {
      setLoadingGraphData(false);
    }
  };

  const handleFetchBidsData = async (
    highestBidItem: SingleSimCard | SimPack,
  ) => {
    if (!highestBidItem.highBidData || !highestBidItem.highBidData.length)
      return;

    setLoadingBidsData(true);

    const payload: GetSimBidsRequestProps = {
      limit: 10,
      sort: { field: "-id", order: 1 },
      skip: 0,
      mode: "customer",
      filters: [
        {
          field: "highBidId",
          oprand: "=",
          value: highestBidItem.highBidData[0]._id,
        },
      ],
    };

    try {
      const simBidsDataResponse: GetSimBidsResponseProps =
        await getMySimBidsData(auth.token, payload);
      setBidsData(simBidsDataResponse.data);
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
        toast.error("خطا در دریافت پیشنهادات سیم کارت");
      }
    } finally {
      setLoadingBidsData(false);
    }
  };

  const handleFetchSimKhastOffersData = async (simKhastItem: SimKhast) => {
    setLoadingSimKhastOffersData(true);

    const payload: GetSimKhastOffersRequestProps = {
      limit: 10,
      sort: { field: "-id", order: 1 },
      skip: 0,
      mode: "customer",
      filters: [
        {
          field: "specialSimId",
          oprand: "=",
          value: simKhastItem._id,
        },
      ],
    };

    try {
      const simKhastOffersResponse: GetSimKhastOffersResponseProps =
        await getMySimKhastOffersData(auth.token, payload);
      setSimKhastOffersData(simKhastOffersResponse.data);
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
        toast.error("خطا در دریافت پیشنهادات سیم خواست");
      }
    } finally {
      setLoadingSimKhastOffersData(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:items-start">
        {loading ? (
          <SimCardDetailCardSkeleton
            title={serviceLabel}
            itemDetail={{
              serviceType: serviceType,
              priceData: {
                priceType: 0,
              },
            }}
          />
        ) : !item ? (
          <p>error</p>
        ) : (
          <PackageItem item={item} serviceType={serviceType} />
        )}
        <div className="flex w-full flex-col items-center px-6 md:px-0">
          {loadingGraphData ? (
            <ViewsGraphCardSkeleton />
          ) : !graphData ? (
            <p>خطا در دریافت اطلاعات نمودار</p>
          ) : (
            <ViewsGraphCard graphData={graphData} />
          )}
          <Space value={36} />
          {(serviceType === "simPackHighBid" ||
            serviceType === "simcardHighBid") &&
            (loadingBidsData ? (
              <>
                <BidsSectionSkeleton />
                <Space value={36} />
              </>
            ) : !!highestBidItem && !!highestBidItem.highBidData ? (
              <>
                <BidsSection
                  highestBidData={highestBidItem.highBidData[0]}
                  bids={bidsData}
                />
                <Space value={36} />
              </>
            ) : (
              <></>
            ))}
          {serviceType === "specialSim" &&
            (loadingSimKhastOffersData ? (
              <>
                <SimKhastOffersSectionSkeleton />
                <Space value={36} />
              </>
            ) : (
              <>
                <SimKhastOffersSection
                  simKhastOffers={simKhastOffersData}
                  offerCount={simKhastItem.offerCount}
                  offerLimit={simKhastItem.offerLimit}
                />
                <Space value={36} />
              </>
            ))}
          <div className="hidden w-full md:flex">
            <SingleOperationsSection
              selectedItem={item}
              serviceType={serviceType}
            />
          </div>
        </div>
      </div>
      {serviceType !== "specialSim" && (
        <div className="absolute bottom-0 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
          {loading || !item ? (
            <button
              disabled
              className="flex h-full w-full items-center justify-center rounded-md bg-grey text-[17px] font-bold text-white"
            >
              سرویس ها
            </button>
          ) : (
            <SingleOperationsDialog
              selectedItem={item}
              serviceType={serviceType}
            />
          )}
        </div>
      )}
    </>
  );
}

function PackageItem({
  item,
  serviceType,
}: {
  item: SingleSimCard | SimPack | SimKhast;
  serviceType: ServiceType;
}) {
  switch (serviceType) {
    case "simcard":
      const singleSimcard = item as SingleSimCard;

      return (
        <SimCardDetailCard
          isPanel
          title="سیم کارت تکی"
          itemDetail={{
            id: singleSimcard._id,
            serviceType: singleSimcard.serviceType,
            createTime: singleSimcard.addvertiseTime,
            viewsCount: singleSimcard.viewsCount,
            simCards: [
              {
                sellerSpel: singleSimcard.sellerSpel,
                operator: singleSimcard.operator,
              },
            ],
            priceData: {
              isApprovedByExpert: singleSimcard.isExpert,
              price: singleSimcard.price,
              offPercent: singleSimcard.offPercent,
              offPrice: singleSimcard.offPrice,
              priceType: singleSimcard.priceType,
            },
            loanData: {
              hasInstallment: singleSimcard.isInstallment,
              installmentPlan: singleSimcard.installmentPlan,
            },
            roundData: singleSimcard.rondData,
            specificationsData: {
              simCardLevel: singleSimcard.vip,
              simCardType: singleSimcard.type,
              preNumber: singleSimcard.preNumber,
              code: singleSimcard.code,
              simCardStatus: singleSimcard.state,
              provinceFa: singleSimcard.provinceFa,
              cityFa: singleSimcard.cityFa,
            },
          }}
        />
      );

    case "simPack":
      const simPackData = item as SimPack;

      return (
        <SimCardDetailCard
          isPanel
          title="سیم کارت گروهی"
          itemDetail={{
            id: simPackData._id,
            serviceType: simPackData.serviceType,
            createTime: simPackData.addvertiseTime,
            viewsCount: simPackData.viewsCount,
            simCards: simPackData.simcards.map((item) => ({
              sellerSpel: item.sellerSpel,
              operator: item.operator,
            })),
            priceData: {
              price: simPackData.price,
              offPercent: simPackData.offPercent,
              offPrice: simPackData.offPrice,
              priceType: simPackData.priceType,
            },
            loanData: {
              hasInstallment: simPackData.isInstallment,
              installmentPlan: simPackData.installmentPlan,
            },
            specificationsData: {
              simPackType: simPackData.simPackType,
              provinceFa: simPackData.provinceFa,
              cityFa: simPackData.cityFa,
            },
          }}
        />
      );

    case "specialSim":
      const simKhastData = item as SimKhast;

      return (
        <SimCardDetailCard
          isPanel
          title="سیم خواست"
          itemDetail={{
            id: simKhastData._id,
            serviceType: simKhastData.serviceType,
            createTime: simKhastData.createDate,
            viewsCount: simKhastData.viewsCount,
            simCards: [
              {
                sellerSpel: simKhastData.condition.sellerSpel,
                operator: simKhastData.condition.operator,
              },
            ],
            priceData: {
              minPrice: simKhastData.condition.minPrice,
              maxPrice: simKhastData.condition.maxPrice,
            },
            loanData: {
              hasInstallment: simKhastData.condition.isInstallment,
            },
            rondLevelsFa: simKhastData.condition.rondLevelsFa,
            specificationsData: {
              simCardType: simKhastData.condition.type,
              preNumber: simKhastData.condition.preNumber,
              code: simKhastData.condition.code,
              simCardStatus: simKhastData.condition.state,
              provinceFa: simKhastData.condition.provinceFa,
              cityFa: simKhastData.condition.cityFa,
            },
          }}
        />
      );

    case "simcardHighBid":
      const highestBidSimcardData = item as SingleSimCard;

      return (
        <SimCardDetailCard
          isPanel
          title="بالاترین پیشنهاد تکی"
          itemDetail={{
            id: highestBidSimcardData._id,
            serviceType: highestBidSimcardData.serviceType,
            createTime: highestBidSimcardData.addvertiseTime,
            viewsCount: highestBidSimcardData.viewsCount,
            simCards: [
              {
                sellerSpel: highestBidSimcardData?.sellerSpel!,
                operator: highestBidSimcardData?.operator!,
              },
            ],
            priceData: {
              startPrice: highestBidSimcardData?.price,
              priceType: highestBidSimcardData?.priceType,
            },
            loanData: {
              hasInstallment: highestBidSimcardData?.isInstallment!,
              installmentPlan: highestBidSimcardData?.installmentPlan,
            },
            roundData: highestBidSimcardData?.rondData,
            specificationsData: {
              simCardType: highestBidSimcardData?.type!,
              simCardLevel: highestBidSimcardData?.vip,
              preNumber: highestBidSimcardData?.preNumber,
              code: highestBidSimcardData?.code!,
              simCardStatus: highestBidSimcardData?.state!,
              provinceFa: highestBidSimcardData?.provinceFa!,
              cityFa: highestBidSimcardData?.cityFa!,
            },
          }}
        />
      );

    case "simPackHighBid":
      const highestBidSimPackData = item as SimPack;

      return (
        <SimCardDetailCard
          isPanel
          title="بالاترین پیشنهاد گروهی"
          itemDetail={{
            id: highestBidSimPackData._id,
            serviceType: highestBidSimPackData.serviceType,
            createTime: highestBidSimPackData.addvertiseTime,
            viewsCount: highestBidSimPackData.viewsCount,
            simCards: highestBidSimPackData.simcards.map((item) => {
              return {
                sellerSpel: item.sellerSpel,
                operator: item.operator,
              };
            }),
            priceData: {
              startPrice: highestBidSimPackData.price,
              priceType: highestBidSimPackData.priceType,
            },
            loanData: {
              hasInstallment: highestBidSimPackData?.isInstallment!,
            },
            specificationsData: {
              simPackType: highestBidSimPackData?.simPackType,
              provinceFa: highestBidSimPackData?.provinceFa!,
              cityFa: highestBidSimPackData?.cityFa!,
            },
          }}
        />
      );

    default:
      return <></>;
  }
}
