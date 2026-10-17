"use client";

import { useContext, useEffect, useState } from "react";
import { RequestFilter, RequestSort } from "@/lib/entities/api";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import {
  GetCartTransactionsResponseProps,
  GetWalletTransactionsResponseProps,
  CartTransaction,
  WalletTransaction,
} from "@/lib/entities/transaction";
import getCartTransactions from "@/lib/api/getCartTransactions";
import TransactionCard from "../cards/TransactionCard";
import TransactionSkeleton from "../skeletons/TransactionSkeleton";
import getWalletTransactions from "@/lib/api/getWalletTransactions";

export default function TransactionsResultSection({
  filters,
  sort,
  selectedTab,
}: {
  filters: RequestFilter[];
  sort: RequestSort;
  selectedTab: string;
}) {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<
    (CartTransaction | WalletTransaction)[]
  >([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();

  useEffect(() => {
    if (!auth.token) return;

    setClientSideResult([]);
    setSkip(0);
    handleGetNewResults(0);
  }, [auth.token, filters]);
  console.log({ skip });
  async function handleGetNewResults(skip: number) {
    if (skip > clientSideResult!.length) return;
    console.log("handlegetresult");
    setLoading(true);

    try {
      switch (selectedTab) {
        case "all":
          const allTransactionsResponse: GetCartTransactionsResponseProps =
            await getCartTransactions(auth.token, 9, filters, sort, skip);
          setClientSideResult((prev) => [
            ...prev,
            ...allTransactionsResponse.data.filter(
              (newItem) =>
                !prev.some(
                  (item) => (item as CartTransaction)._id === newItem._id,
                ),
            ),
          ]);
          break;
        case "wallet":
          const walletTransactionsResponse: GetWalletTransactionsResponseProps =
            await getWalletTransactions(auth.token, 9, filters, sort, skip);
          setClientSideResult((prev) => [
            ...prev,
            ...walletTransactionsResponse.data.transactions.filter(
              (newItem) =>
                !prev.some(
                  (item) => (item as WalletTransaction).id === newItem.id,
                ),
            ),
          ]);
          break;
        case "gateway":
          // const searchSimKhastsResponse: SearchSimKhastResponseProps =
          //   await searchSimKhasts(
          //     9,
          //     filters.concat([
          //       {
          //         field: "addvertiseTime",
          //         oprand: "<",
          //         value: serverTime,
          //       },
          //     ]),
          //     sort,
          //     skip,
          //   );
          // setClientSideResult((prev) => [
          //   ...prev,
          //   ...searchSimKhastsResponse.data.filter(
          //     (newItem) => !prev.some((item) => item._id === newItem._id),
          //   ),
          // ]);
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
        toast.error("خطا در دریافت لیست تراکنش ها");
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
    <div className="flex w-full flex-col items-start justify-start gap-4">
      {selectedTab === "all" ? (
        (clientSideResult as CartTransaction[]).map((transaction) => (
          <TransactionCard
            key={transaction._id}
            type={transaction.transactionData.type}
            source={transaction.transactionData.source}
            title={transaction.transactionData.desc}
            transactionId={transaction.transactionData.transactionId}
            date={transaction.transactionData.createDate}
            amount={transaction.transactionData.amount}
            count={transaction.transactionData.count}
          />
        ))
      ) : selectedTab === "wallet" ? (
        (clientSideResult as WalletTransaction[]).map((transaction) => (
          <TransactionCard
            key={transaction.id}
            type={transaction.transactionType}
            source={transaction.source}
            title={transaction.desc}
            transactionId={transaction.id}
            date={transaction.createDate}
            amount={transaction.amount}
            count={transaction.count}
          />
        ))
      ) : (
        <></>
      )}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <TransactionSkeleton key={index} />)}
    </div>
  );
}
