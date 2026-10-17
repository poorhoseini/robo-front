"use client";

import { useContext, useEffect, useState } from "react";
import { LandingPageCard } from "@/lib/entities/landingPage";
import CardStack from "@/components/layout/CardStack";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import {
  SearchSingleSimCardResponseProps,
  SingleSimCard,
} from "@/lib/entities/singleSimCard";
import { SearchSimPackResponseProps, SimPack } from "@/lib/entities/simPack";
import searchSimPacks from "@/lib/api/searchSimPacks";
import { SearchSimKhastResponseProps, SimKhast } from "@/lib/entities/simKhast";
import searchSimKhasts from "@/lib/api/searchSimKhast";
import useScroll from "../forms/search/useScroll";
import searchMySimCards from "@/lib/api/searchMySimCards";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import {
  useGroupOperationActions,
  useOperation,
  useSelectedItems,
} from "@/lib/zustand/groupOperation";
import PackageSkeleton from "../skeletons/PackageSkeleton";
import {
  SearchStoresResponseProps,
  UserProfileStore,
} from "@/lib/entities/store";
import searchStores from "@/lib/api/searchStores";
import { StoreAdvertiser } from "@/lib/entities/advertiser";

export default function DashboardResultSection({
  serverResult,
  filters,
  sort,
  searchType,
  serverTime,
  direction = "horizontal",
}: {
  serverResult: LandingPageCard;
  filters: RequestFilter[];
  sort: RequestSort;
  searchType: "simcard" | "simPack" | "simKhast" | "store";
  serverTime: number;
  direction?: "horizontal" | "vertical";
}) {
  const operation = useOperation();
  const selectedItems = useSelectedItems();
  const { addItem, removeItem } = useGroupOperationActions();
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<
    Array<SimKhast | SingleSimCard | SimPack | StoreAdvertiser>
  >([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();

  useEffect(() => {
    if (!auth.token) return;

    setClientSideResult([]);
    setSkip(serverResult.data?.length || 0);
    handleGetNewResults(0);
  }, [auth.token, searchType, filters]);

  async function handleGetNewResults(skip: number) {
    if (skip > clientSideResult!.length) return;
    setLoading(true);

    try {
      switch (searchType) {
        case "simcard":
          const searchSingleSimCardResponse: SearchSingleSimCardResponseProps =
            await searchMySimCards(auth.token, 9, filters, sort, skip);
          setClientSideResult((prev) => [
            ...prev,
            ...searchSingleSimCardResponse.data.filter(
              (newItem) => !prev.some((item) => item._id === newItem._id),
            ),
          ]);
          break;
        case "simPack":
          const searchSimPacksResponse: SearchSimPackResponseProps =
            await searchSimPacks(
              9,
              filters.concat([
                {
                  field: "addvertiseTime",
                  oprand: "<",
                  value: serverTime,
                },
              ]),
              sort,
              skip,
            );
          setClientSideResult((prev) => [
            ...prev,
            ...searchSimPacksResponse.data.filter(
              (newItem) => !prev.some((item) => item._id === newItem._id),
            ),
          ]);
          break;
        case "simKhast":
          const searchSimKhastsResponse: SearchSimKhastResponseProps =
            await searchSimKhasts(
              9,
              filters.concat([
                {
                  field: "addvertiseTime",
                  oprand: "<",
                  value: serverTime,
                },
              ]),
              sort,
              skip,
            );
          setClientSideResult((prev) => [
            ...prev,
            ...searchSimKhastsResponse.data.filter(
              (newItem) => !prev.some((item) => item._id === newItem._id),
            ),
          ]);
          break;
        case "store":
          const searchStoresResponse: SearchStoresResponseProps =
            await searchStores(9, filters, sort, skip);
          setClientSideResult((prev) => [
            ...prev,
            ...searchStoresResponse.data
              .map((item) => ({
                addresses: item.addresses,
                numbers: item.numbers,
                services: item.services,
                _id: item._id,
                storeName: item.storeName,
                storeType: item.storeType,
                telegram: "",
                viewsCount: item.viewsCount,
              }))
              .filter(
                (newItem) => !prev.some((item) => item._id === newItem._id),
              ),
          ]);
          break;
      }
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
        toast.error("خطا در لیست سیم کارت ها");
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
    <div className="flex w-full flex-row items-start justify-start gap-4">
      {!!clientSideResult && !!clientSideResult.length && (
        <CardStack
          noTitle={searchType !== "store"}
          noMoreButton={searchType === "store"}
          isDashboardRoute
          stackData={{
            cardType: serverResult.cardType,
            title: searchType === "store" ? "فروشگاه‌ها" : "",
            data: clientSideResult,
          }}
          selectedData={operation ? selectedItems : undefined}
          onSelect={(item: SimKhast | SingleSimCard | SimPack) => {
            if (
              selectedItems.find(
                (selectedItem) => selectedItem._id === item._id,
              )
            ) {
              removeItem(item);
            } else {
              addItem(
                item,
                serverResult.cardType === "singleSim"
                  ? "simcard"
                  : serverResult.cardType === "simPack"
                    ? "simPack"
                    : serverResult.cardType === "simKhast"
                      ? "specialSim"
                      : "simcard",
              );
            }
          }}
          gap={4}
          direction={direction}
        />
      )}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <PackageSkeleton key={index} />)}
    </div>
  );
}
