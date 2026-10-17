"use client";

import { useEffect, useState } from "react";
import useScroll from "./useScroll";
import { LandingPageCard } from "@/lib/entities/landingPage";
import CardStack from "@/components/layout/CardStack";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import {
  SearchSingleSimCardResponseProps,
  SingleSimCard,
} from "@/lib/entities/singleSimCard";
import searchSingleSimCards from "@/lib/api/searchSingleSimCards";
import { SearchSimPackResponseProps, SimPack } from "@/lib/entities/simPack";
import searchSimPacks from "@/lib/api/searchSimPacks";
import { SearchSimKhastResponseProps, SimKhast } from "@/lib/entities/simKhast";
import searchSimKhasts from "@/lib/api/searchSimKhast";
import PackageSkeleton from "@/components/skeletons/PackageSkeleton";

export default function SearchResultSection({
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
  searchType: "simcard" | "simPack" | "simKhast";
  serverTime: number;
  direction?: "horizontal" | "vertical";
}) {
  const [clientSideResult, setClientSideResult] = useState<
    Array<SimKhast | SingleSimCard | SimPack>
  >([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();

  useEffect(() => {
    setClientSideResult([]);
    setSkip(serverResult.data?.length || 0);
  }, [searchType, filters]);

  async function handleGetNewResults() {
    if (!serverResult.data || serverResult.data.length < 9) return;
    if (skip > serverResult.data.length + clientSideResult!.length) return;

    setLoading(true);

    try {
      switch (searchType) {
        case "simcard":
          const searchSingleSimCardResponse: SearchSingleSimCardResponseProps =
            await searchSingleSimCards(
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
          setClientSideResult((prev) =>
            prev?.concat(searchSingleSimCardResponse.data),
          );
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
          setClientSideResult((prev) =>
            prev?.concat(searchSimPacksResponse.data),
          );
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
          setClientSideResult((prev) =>
            prev?.concat(searchSimKhastsResponse.data),
          );
          break;
      }
      setSkip((prev) => prev + 9);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (loading) return;

    const scrollFraction = scrollPosition / scrollLimit;
    if (scrollFraction > 0.8 && scrollDirection === -1) handleGetNewResults();
  }, [scrollPosition, scrollLimit]);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 pb-4">
      <CardStack
        noTitle
        stackData={{
          cardType: serverResult.cardType,
          title: "",
          data: serverResult.data,
        }}
        gap={4}
        direction={direction}
      />
      {!!clientSideResult && !!clientSideResult.length && (
        <CardStack
          noTitle
          stackData={{
            cardType: serverResult.cardType,
            title: "",
            data: clientSideResult!.filter((item) =>
              serverResult.data && serverResult.data.length
                ? item.serviceType ===
                  (serverResult.data[0] as SingleSimCard).serviceType
                : false,
            ),
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
