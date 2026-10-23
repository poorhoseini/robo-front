"use client";

import {
  formatPhoneNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import { SimKhastOffer } from "@/lib/entities/simKhastOffer";
import Space from "../general/Space";
import { Fragment } from "react";
import moment from "moment";

export default function SimKhastOffersSection({
  simKhastOffers,
  offerCount,
  offerLimit,
}: {
  simKhastOffers: SimKhastOffer[];
  offerCount: number;
  offerLimit: number;
}) {
  return (
    <div className="flex w-full flex-col items-center rounded-2xl bg-white p-6">
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-sm font-medium leading-5 text-grey">
          پیشنهاد باقی مانده
        </p>
        <div className="flex flex-row items-center justify-end gap-6">
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-biege pt-1 text-xs md:text-sm">
              {persianNumber(offerLimit)}
            </div>
            <p className="text-xs font-light">کل پیشنهادات</p>
          </div>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-biege pt-1 text-xs md:text-sm">
              {persianNumber(offerLimit - offerCount)}
            </div>
            <p className="text-xs font-light">پیشنهاد باقی‌مانده</p>
          </div>
        </div>
      </div>
      <Space value={24} />
      <div className="flex w-full flex-row items-center justify-between bg-blue-900 px-8 py-[22px]">
        <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey">
          زمان ثبت
        </p>
        <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey">
          شماره ثبت کننده
        </p>
        <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey">
          شماره پیشنهادی
        </p>
        <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey">
          قیمت پیشنهادی
        </p>
      </div>
      <div className="w-[90%] border-b border-grey-100" />
      {simKhastOffers.map((offer, index) => (
        <Fragment key={index}>
          <div className="flex w-full flex-row items-center justify-between px-8 py-[22px]">
            <div className="flex w-1/4 flex-row items-center justify-center gap-2 text-center text-sm font-normal leading-4 text-grey">
              <p>
                {moment
                  .unix(offer.createDate)
                  .toDate()
                  .toLocaleDateString("fa-IR")}
              </p>
              <VerticalLine />
              <p>
                {moment
                  .unix(offer.createDate)
                  .toDate()
                  .toLocaleTimeString("fa-IR")}
              </p>
            </div>
            <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey ltr">
              {formatPhoneNumber(offer.userData.phoneNumber)}
            </p>
            <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey ltr">
              {formatPhoneNumber(offer.phoneNumber)}
            </p>
            <p className="w-1/4 text-center text-base font-semibold leading-5 text-grey">
              {persianNumber(offer.price)}
            </p>
          </div>
          <div className="w-[90%] border-b border-grey-100" />
        </Fragment>
      ))}
    </div>
  );
}

function VerticalLine() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}
