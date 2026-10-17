import { TransactionSource, TransactionType } from "@/lib/entities/cart";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";

export default function TransactionCard({
  type,
  source,
  title,
  date,
  transactionId,
  amount,
  count,
}: {
  type: TransactionType;
  source: TransactionSource;
  title: string;
  date: EpochTimeStamp;
  transactionId: number;
  amount: number;
  count: number;
}) {
  return (
    <div className="flex w-full flex-row items-center justify-start gap-4 rounded-lg border border-grey-200 bg-white px-6 py-4">
      <Image
        src={
          type === "credit"
            ? "/icons/square-arrow-bottom-green.svg"
            : type === "debit"
              ? "/icons/square-arrow-up-red.svg"
              : // : type === "partialRefund"// manage refund and partialRefund
                //   ? ""
                "/icons/square-cross-gray.svg"
        }
        alt=""
        width={32}
        height={33}
      />
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <h2 className="flex flex-row items-center justify-start gap-2 text-base leading-5">
          <span className="font-medium">
            {source === "wallet"
              ? "کیف پول"
              : source === "subscription"
                ? "اشتراک"
                : source === "trial"
                  ? "هدیه ماهانه"
                  : source}
          </span>
          <VerticalLineBlue />
          <span className="ltr font-normal">{title}</span>
        </h2>
        <div className="flex flex-row items-center justify-start gap-2 text-sm font-normal leading-5 text-grey">
          <Image src="/icons/clock-grey.svg" alt="" width={20} height={21} />
          <span className="ltr">
            {new Date(date * 1000).toLocaleDateString("fa-IR", {
              weekday: "long",
            })}{" "}
            {new Date(date * 1000).toLocaleDateString("fa-IR", {
              day: "numeric",
              year: "numeric",
              month: "long",
            })}
          </span>
          <VerticalLineBlue />
          {new Date(date * 1000).toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <VerticalLineBlue />
          <span className="font-medium text-grey-700">شماره پیگیری: </span>
          <span className="font-medium text-grey-700">
            {persianNumber(transactionId)}
          </span>
        </div>
      </div>
      {source === "wallet" ? (
        <p className="text-nowrap">
          <span className="text-2xl font-bold leading-6 text-grey">
            {persianNumber(amount)}
          </span>
          <span className="text-sm font-normal leading-4 text-grey">
            {" "}
            تومان
          </span>
        </p>
      ) : (
        <p className="text-nowrap">
          <span className="text-2xl font-bold leading-6 text-grey">
            {persianNumber(count)}
          </span>
          <span className="text-sm font-normal leading-4 text-grey"> عدد</span>
        </p>
      )}
    </div>
  );
}

function VerticalLineBlue() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}
