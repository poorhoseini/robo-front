"use client";

import {
  englishNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Control, useForm } from "react-hook-form";
import OperatorFilterAccordion from "./OperatorFilterAccordion";
import SimCardTypeFilterAccordion from "./SimCardTypeFilterAccordion";
import RoundTypesFilterModal from "./RoundTypesFilterModal";
import SimCardStateFilterAccordion from "./SimCardStateFilterAccordion";
import IsHighestBidFilterSwitch from "./IsHighestBidFilterSwitch";
import HasPriceFilterSwitch from "./HasPriceFilterSwitch";
import AdvertiserTypeFilterAccordion from "./AdvertiserTypeFilterAccordion";
import HasDiscountFilterSwitch from "./HasDiscountFilterSwitch";
import { Province } from "@/lib/entities/province";
import ProvincesFilterModal from "./ProvincesFilterModal";
// import SimPackCountsFilterAccordion from "./SimPackCountsFilterAccordion";
import SearchTypeSelector from "./SearchTypeSelector";
import { RoundType } from "@/lib/entities/roundType";
import PricesFilterBox from "./PricesFilterBox";
import PhoneNumbersFilterBox from "./PhoneNumbersFilterBox";
import SimPackTypesFilterAccordion from "./SimPackTypesFilterAccordion";
import { SearchType } from "@/lib/entities/api";

export type SearchFilterFormProps = {
  preNumber: string;
  code: string;
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
  minPrice: string;
  maxPrice: string;
  roundTypes: string;
  provinces: string;
  operator: string;
  simCardType: string;
  simCardState: string;
  hasDiscount: string;
  isHighestBid: string;
  hasPrice: string;
  advertiserType: string;
  simPackCounts: string;
  simPackType: string;
};

export default function FiltersForm({
  screen = "small",
  searchType,
  preNumber = "",
  code = "",
  digit1 = "",
  digit2 = "",
  digit3 = "",
  digit4 = "",
  digit5 = "",
  digit6 = "",
  minPrice = "",
  maxPrice = "",
  roundTypesList = [],
  roundTypes = "",
  provincesList = [],
  provinces = "",
  operator = "",
  simCardType = "",
  simCardState = "",
  hasDiscount = "",
  isHighestBid = "",
  hasPrice = "",
  advertiserType = "",
  simPackCounts = "",
  simPackType = "",
  onFinish,
}: {
  screen?: "large" | "small";
  searchType: SearchType;
  preNumber?: string;
  code?: string;
  digit1?: string;
  digit2?: string;
  digit3?: string;
  digit4?: string;
  digit5?: string;
  digit6?: string;
  minPrice?: string;
  maxPrice?: string;
  roundTypesList?: RoundType[];
  roundTypes?: string;
  provincesList?: Province[];
  provinces?: string;
  operator?: string;
  simCardType?: string;
  simCardState?: string;
  hasDiscount?: string;
  isHighestBid?: string;
  hasPrice?: string;
  advertiserType?: string;
  simPackCounts?: string;
  simPackType?: string;
  onFinish?: () => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false,
  );

  const { handleSubmit, control, setValue } = useForm<SearchFilterFormProps>({
    defaultValues: {
      preNumber: preNumber,
      code: code,
      digit1: digit1,
      digit2: digit2,
      digit3: digit3,
      digit4: digit4,
      digit5: digit5,
      digit6: digit6,
      minPrice: minPrice ? persianNumber(Number(minPrice)) : "",
      maxPrice: maxPrice ? persianNumber(Number(maxPrice)) : "",
      roundTypes: roundTypes,
      provinces: provinces,
      operator: operator,
      simCardType: simCardType,
      simCardState: simCardState,
      hasDiscount: hasDiscount,
      isHighestBid: isHighestBid,
      hasPrice: hasPrice,
      advertiserType: advertiserType,
      simPackCounts: simPackCounts,
      simPackType: simPackType,
    },
  });

  useEffect(() => {
    setValue("preNumber", preNumber);
    setValue("code", code);
    setValue("digit1", digit1);
    setValue("digit2", digit2);
    setValue("digit3", digit3);
    setValue("digit4", digit4);
    setValue("digit5", digit5);
    setValue("digit6", digit6);
    setValue("minPrice", minPrice ? persianNumber(Number(minPrice)) : "");
    setValue("maxPrice", maxPrice ? persianNumber(Number(maxPrice)) : "");
    setValue("roundTypes", roundTypes);
    setValue("provinces", provinces);
    setValue("operator", operator);
    setValue("simCardType", simCardType);
    setValue("simCardState", simCardState);
    setValue("hasDiscount", hasDiscount);
    setValue("isHighestBid", isHighestBid);
    setValue("hasPrice", hasPrice);
    setValue("advertiserType", advertiserType);
    setValue("simPackCounts", simPackCounts);
    setValue("simPackType", simPackType);
  }, [
    preNumber,
    code,
    digit1,
    digit2,
    digit3,
    digit4,
    digit5,
    digit6,
    minPrice,
    maxPrice,
    roundTypes,
    provincesList,
    provinces,
    operator,
    simCardType,
    simCardState,
    hasDiscount,
    isHighestBid,
    hasPrice,
    advertiserType,
    simPackCounts,
    simPackType,
    setValue,
  ]);

  const handleSubmitFilters = (values: SearchFilterFormProps) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(values)) {
      value
        ? params.set(
            key === "simCardType"
              ? "type"
              : key === "simCardState"
                ? "state"
                : key,
            key === "minPrice" || key === "maxPrice"
              ? englishNumber(value.replaceAll("٬", ""))
              : value,
          )
        : params.delete(
            key === "simCardType"
              ? "type"
              : key === "simCardState"
                ? "state"
                : key,
          );
    }

    if (onFinish) onFinish();
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    const shopIdParam = searchParams.get("shopId");
    const sortByParam = searchParams.get("sortBy");
    const viewTypeParam = searchParams.get("viewType");
    const searchTypeParam = searchParams.get("searchType");
    shopIdParam && params.set("shopId", shopIdParam);
    sortByParam && params.set("sortBy", sortByParam);
    viewTypeParam && params.set("viewType", viewTypeParam);
    searchTypeParam && params.set("searchType", searchTypeParam);

    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div
      className={`ltr top-20 w-full rounded-lg border-grey-100 bg-white px-4 pt-6 md:sticky md:max-h-[80vh] md:overflow-y-auto md:border ${screen === "large" ? "" : "md:w-[320px]"}`}
    >
      <div className="rtl flex h-full w-full flex-col items-center justify-start gap-6">
        <div className="flex w-full flex-row items-center justify-between">
          <h2 className="text-lg font-medium text-black">فیلترها</h2>
          <button
            className="text-sm font-medium text-blue"
            onClick={handleClearFilters}
          >
            حذف فیلترها
          </button>
        </div>
        <form
          onSubmit={handleSubmit(handleSubmitFilters)}
          className="flex w-full flex-col items-center gap-4"
        >
          {screen === "small" && (
            <div className="hidden w-full md:block">
              <SearchTypeSelector
                searchType={searchType}
                hasShop={!!searchParams.get("shopId")}
              />
            </div>
          )}
          {searchType !== "simPack" && (
            <PhoneNumbersFilterBox control={control} setValue={setValue} />
          )}
          <PricesFilterBox control={control} />
          <div className="relative flex w-full flex-col items-center">
            {searchType === "simcard" && (
              <RoundTypesFilterModal
                options={roundTypesList.map((roundType) => ({
                  id: roundType.id,
                  label: roundType.rondLevelFa,
                  value: roundType.id.toString(),
                }))}
                defaultValues={roundTypes}
                control={control as Control<any, any, any>}
                setValue={setValue}
                setAccordionExpanded={setAccordionExpanded}
              />
            )}
            <ProvincesFilterModal
              options={provincesList.map((province) => ({
                id: province.id,
                label: province.name,
                value: province.slug,
              }))}
              defaultValues={provinces}
              control={control as Control<any, any, any>}
              setValue={setValue}
              setAccordionExpanded={setAccordionExpanded}
            />
            {searchType !== "simPack" && (
              <OperatorFilterAccordion
                defaultValues={operator}
                control={control}
                setValue={setValue}
                accordionExpanded={accordionExpanded}
                setAccordionExpanded={setAccordionExpanded}
              />
            )}
            {searchType !== "simPack" && (
              <SimCardTypeFilterAccordion
                defaultValue={simCardType}
                control={control}
                setValue={setValue}
                accordionExpanded={accordionExpanded}
                setAccordionExpanded={setAccordionExpanded}
              />
            )}
            {searchType === "simPack" && (
              <SimPackTypesFilterAccordion
                defaultValues={simPackType}
                control={control}
                setValue={setValue}
                accordionExpanded={accordionExpanded}
                setAccordionExpanded={setAccordionExpanded}
              />
            )}
            {searchType !== "simPack" && (
              <SimCardStateFilterAccordion
                defaultValues={simCardState}
                control={control}
                setValue={setValue}
                accordionExpanded={accordionExpanded}
                setAccordionExpanded={setAccordionExpanded}
              />
            )}
            {searchType !== "simKhast" && (
              <AdvertiserTypeFilterAccordion
                defaultValues={advertiserType}
                control={control}
                setValue={setValue}
                accordionExpanded={accordionExpanded}
                setAccordionExpanded={setAccordionExpanded}
              />
            )}
            {searchType !== "simKhast" && (
              <HasDiscountFilterSwitch
                defaultValue={hasDiscount}
                control={control}
                setValue={setValue}
              />
            )}
            {searchType !== "simKhast" && (
              <IsHighestBidFilterSwitch
                defaultValue={isHighestBid}
                control={control}
                setValue={setValue}
              />
            )}
            {searchType !== "simKhast" && (
              <HasPriceFilterSwitch
                defaultValue={hasPrice}
                control={control}
                setValue={setValue}
              />
            )}
            {/* <SimPackCountsFilterAccordion
            defaultValues={simPackCounts}
            control={control}
            setValue={setValue}
          /> */}
            <div className="sticky bottom-0 w-full bg-white">
              <HorizontalLine />
              <button
                type="submit"
                className="my-3 h-12 w-full rounded-lg bg-grey text-sm font-medium text-white"
              >
                اعمال فیلترها
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}
