import Script from "next/script";
import React from "react";

export default function ServiceIntroductionCard() {
  return (
    <div className="flex h-[350px] w-[410px] flex-col items-center justify-start gap-2 rounded-lg border border-grey-200 bg-white p-8">
      <h3 className="w-full text-right text-lg font-medium text-grey">
        معرفی کانال تلگرام
      </h3>
      <p className="w-full text-right text-sm font-normal text-grey">
        توضیحات سیم خواست توضیحات سیم خواست توضیحات سیم خواستتوضیحات سیم خواست
        توضیحات سیم خواستتوضیحات سیم خواست
      </p>
      <div id="37638297068" className="w-full overflow-hidden rounded-xl">
        <Script
          type="text/JavaScript"
          src="https://www.aparat.com/embed/xmLEe?data[rnddiv]=37638297068&data[responsive]=yes"
        ></Script>
      </div>
    </div>
  );
}
