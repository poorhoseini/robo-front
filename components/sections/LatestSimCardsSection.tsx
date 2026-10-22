"use client";

import searchSingleSimCards from "@/lib/api/searchSingleSimCards";
import {
  SearchSingleSimCardResponseProps,
  SingleSimCard,
} from "@/lib/entities/singleSimCard";
import {
  getSimCardStateLabel,
  getSimCardTypeLabel,
} from "@/lib/helpers/decodeSimCardData";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { getElapsetTime } from "@/lib/helpers/timeDifference";
import {
  Checkbox,
  MenuItem,
  SelectChangeEvent,
  Skeleton,
  TextField,
} from "@mui/material";
import Image from "next/image";
import ResponsiveLink from "../general/ResponsiveLink";
import { Fragment, useCallback, useEffect, useState } from "react";
import { preNumberSelectOptions } from "@/lib/constants/filters";
import { RequestFilter } from "@/lib/entities/api";
import CardStack from "../layout/CardStack";

export default function LatestSimCardsSection() {
  const [simCards, setSimCards] = useState<SingleSimCard[]>([]);
  const [preNumber, setPreNumber] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [viewType, setViewType] = useState<string>("vitrin");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearchSimCards = useCallback(
    async (preNumber: string[], code: string) => {
      setLoading(true);

      const filters: RequestFilter[] = [
        { field: "isHighBid", oprand: "=", value: false },
      ];

      preNumber &&
        preNumber.length &&
        preNumber[0] !== "all" &&
        filters.push({ field: "preNumber", oprand: "or", value: preNumber });
      code &&
        filters.push({ field: "code", oprand: "or", value: [Number(code)] });

      try {
        const response: SearchSingleSimCardResponseProps =
          await searchSingleSimCards(8, filters, { field: "_id", order: -1 });
        setSimCards(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    handleSearchSimCards(preNumber, code);
    // setSimCards
  }, [code, handleSearchSimCards, preNumber]);

  const handlePreNumberChange = (event: SelectChangeEvent<unknown>) => {
    const value = event.target.value as string[];
    value.length && value[value.length - 1] === "all"
      ? setPreNumber(["all"])
      : setPreNumber(value.filter((item) => item !== "all"));
  };

  const handleCodeClick = (inputCode: string) => {
    setCode(inputCode);
  };

  return (
    <section className="flex w-full flex-col items-center gap-8">
      <div className="flex w-full flex-row items-center gap-2">
        <Image
          src="/icons/sections/icon-section-latest.svg"
          alt="آخرین سیم کارت ها"
          width={32}
          height={32}
        />
        <h2 className="text-2xl font-medium text-grey">آخرین سیم کارت ها</h2>
      </div>
      <div className="flex w-full flex-col items-center gap-5">
        <div className="flex h-[80px] w-full flex-row items-center justify-between gap-2 rounded-t-2xl bg-white px-6 py-5">
          <div className="flex flex-row items-center gap-2">
            <TextField
              id="pre-number-select"
              select
              value={preNumber}
              SelectProps={{
                multiple: true,
                value: preNumber,
                renderValue: (selected) =>
                  persianNumber(
                    (selected as string[])
                      .map(
                        (item) =>
                          preNumberSelectOptions.find(
                            (option) => option.value === item,
                          )?.label || "",
                      )
                      .join(", "),
                  ),
                onChange: handlePreNumberChange,
                defaultValue: [],
              }}
              label="پیش شماره"
              sx={{
                width: "165px",
                height: "48px",
                marginLeft: "8px",
                "& .MuiInputBase-root": {
                  height: "48px",
                },
              }}
              variant="outlined"
            >
              {preNumberSelectOptions.map((option, index) => (
                <MenuItem
                  key={option.id}
                  value={option.value}
                  sx={{
                    direction: "ltr",
                    justifyContent: "space-between",
                    "&::before": {
                      content: `""`,
                      position: "absolute",
                      marginRight: "auto",
                      marginLeft: "auto",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: "1px",
                      width: "85%",
                      borderBottom:
                        index !== preNumberSelectOptions.length - 1
                          ? "1px solid #ECECEC"
                          : undefined,
                    },
                  }}
                >
                  <Checkbox
                    checked={preNumber.indexOf(option.value) > -1}
                    icon={
                      <Image
                        src="/form/checkbox.svg"
                        alt="checkbox"
                        width={20}
                        height={20}
                      />
                    }
                    checkedIcon={
                      <Image
                        src="/form/checkbox-checked.svg"
                        alt="checked checkbox"
                        width={20}
                        height={20}
                      />
                    }
                  />
                  <p> {persianNumber(option.label)} </p>
                </MenuItem>
              ))}
            </TextField>
            <button
              onClick={() => handleCodeClick("")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              همه
            </button>
            <button
              onClick={() => handleCodeClick("1")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "1" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۱
            </button>
            <button
              onClick={() => handleCodeClick("2")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "2" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۲
            </button>
            <button
              onClick={() => handleCodeClick("3")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "3" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۳
            </button>
            <button
              onClick={() => handleCodeClick("4")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "4" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۴
            </button>
            <button
              onClick={() => handleCodeClick("5")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "5" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۵
            </button>
            <button
              onClick={() => handleCodeClick("6")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "6" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۶
            </button>
            <button
              onClick={() => handleCodeClick("7")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "7" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۷
            </button>
            <button
              onClick={() => handleCodeClick("8")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "8" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۸
            </button>
            <button
              onClick={() => handleCodeClick("9")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "9" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۹
            </button>
            <button
              onClick={() => handleCodeClick("0")}
              className={`h-[48px] w-[55px] rounded-lg border border-grey-300 text-sm font-medium ${code === "0" ? "bg-primary text-white" : "bg-white text-grey-700"}`}
            >
              کد ۰
            </button>
          </div>
          <div>
            <TextField
              id="view-type-select"
              select
              label="نوع نمایش"
              defaultValue="vitrin"
              value={viewType}
              onChange={(e) => {
                setViewType(e.target.value);
              }}
              sx={{
                width: "165px",
                height: "48px",
                "& .MuiInputBase-root": {
                  height: "48px",
                },
              }}
              variant="outlined"
            >
              <MenuItem value="vitrin">ویترین</MenuItem>
              <MenuItem value="card">کارت</MenuItem>
            </TextField>
          </div>
        </div>
        {viewType === "vitrin" ? (
          <div className="flex w-full flex-col items-center rounded-b-2xl bg-white">
            <div className="flex h-[64px] w-full flex-row items-center bg-blue-900 px-6 py-2 text-base font-semibold text-grey">
              <h3 className="w-[176px]">سیم کارت</h3>
              <h3 className="w-[176px]">قیمت (تومان)</h3>
              <h3 className="w-[176px]">وضعیت</h3>
              <h3 className="w-[176px]">نوع</h3>
              <h3 className="w-[176px]">شهر</h3>
              <h3 className="w-[176px]">تاریخ</h3>
            </div>
            <div className="h-[2px] w-[95%] bg-grey-100" />
            {loading
              ? [1, 2, 3].map((item, index) => (
                  <div key={index} className="flex w-full flex-col gap-2 p-2">
                    <Skeleton
                      variant="rounded"
                      height={64}
                      className="w-full px-6 py-2"
                    />
                  </div>
                ))
              : simCards.map((item) => (
                  <Fragment key={item._id}>
                    <ResponsiveLink
                      href={`single-sim-card/${item._id}`}
                      className="flex h-[64px] w-full flex-row items-center bg-white px-6 py-2 text-sm font-normal text-grey hover:bg-[#f5f5f5]"
                    >
                      <h3 className="ltr w-[176px] text-end text-base font-medium">
                        {persianNumber(item.sellerSpel)}
                      </h3>
                      <h3 className="w-[176px]">
                        {item.priceType === 1 ||
                        !item.price ||
                        Number(item.price) === 0
                          ? "توافقی"
                          : persianNumber(item.offPrice || item.price)}
                      </h3>
                      <h3 className="w-[176px]">
                        {getSimCardStateLabel(item.state)}
                      </h3>
                      <h3 className="w-[176px]">
                        {getSimCardTypeLabel(item.type)}
                      </h3>
                      <h3 className="w-[176px]">{item.cityFa}</h3>
                      <h3 className="w-[176px]">
                        {getElapsetTime(item.addvertiseTime)}
                      </h3>
                    </ResponsiveLink>
                    <div className="h-[1px] w-[95%] bg-grey-100" />
                  </Fragment>
                ))}
            <div className="flex h-[68px] w-full flex-row items-center justify-end gap-2 px-6">
              <div className="itemx-center flex flex-row text-base font-medium text-grey">
                <p>مشاهده بیشتر</p>
              </div>
              <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] bg-blue-900">
                <Image
                  src="/icons/icon-arrow-left.svg"
                  alt="Enter"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4">
            <CardStack
              stackData={{
                cardType: "singleSim",
                title: "",
                data: simCards.slice(0, 4),
              }}
              noTitle
            />
            {!!simCards.slice(4, 9).length && (
              <CardStack
                stackData={{
                  cardType: "singleSim",
                  title: "",
                  data: simCards.slice(4, 9),
                }}
                noTitle
              />
            )}
            <div className="flex w-full flex-row items-center justify-end gap-2 px-6">
              <div className="itemx-center flex flex-row text-base font-medium text-grey">
                <p>مشاهده بیشتر</p>
              </div>
              <div className="flex h-[28px] w-[28px] items-center justify-center rounded-[4px] bg-blue-900">
                <Image
                  src="/icons/icon-arrow-left.svg"
                  alt="Enter"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
