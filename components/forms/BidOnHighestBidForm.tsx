"use client";

import { ResponseError } from "@/lib/api/error";
import offerHighestBid from "@/lib/api/offerHighestBid";
import {
  OfferHighestBidFormProps,
  OfferHighestBidRequestProps,
  OfferHighestBidResponseProps,
} from "@/lib/entities/highestBid";
import {
  englishNumber,
  persianNumber,
} from "@/lib/helpers/persianNumber.helper";
import { numberInputRegex } from "@/lib/helpers/regex";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CartModal from "../cart/CartModal";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";

export default function BidOnHighestBidForm({
  highestBidId,
  minimumAcceptableOffer,
  maximumAcceptableOffer,
}: {
  highestBidId: string;
  minimumAcceptableOffer: number;
  maximumAcceptableOffer: number;
}) {
  const { auth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorReasons, setErrorReasons] = useState<
    {
      [key: string]: string | number;
    }[]
  >([]);
  const [showError, setShowError] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<OfferHighestBidFormProps>({
    defaultValues: {
      price: "",
    },
  });

  async function handleOfferHighestBidClick(
    formData: OfferHighestBidFormProps,
  ) {
    setLoading(true);
    setShowError(false);
    setErrorReasons([]);

    const payload: OfferHighestBidRequestProps = {
      highBidId: highestBidId,
      bidPrice: Number(
        englishNumber(formData.price.replaceAll("٬", "").replaceAll(",", "")),
      ),
    };

    try {
      const response: OfferHighestBidResponseProps = await offerHighestBid(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
    } catch (error) {
      if (error instanceof ResponseError) {
        toast.error(error.printError());

        const errorData = error.getErrorData();
        const errorReason = error.getErrorReason();

        if (errorData) {
          setShowError(true);
          setErrorReasons(
            errorReason === 153 || errorReason === 200
              ? [{ message: error.message }]
              : errorData.confilicts,
          );
        }
        if (errorReason === 163) {
          setLoginDialogOpen(true);
        }
      } else {
        toast.error("خطایی رخ داده است");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleOfferHighestBidClick)}
        className="flex w-full flex-col items-center justify-start gap-4 bg-white pb-[104px] md:gap-6 md:pb-0"
      >
        <div className="flex w-full flex-col items-center gap-4 md:flex-row md:justify-between md:gap-0">
          <p className="w-full text-right text-sm font-medium text-grey md:w-1/2">
            قیمت پیشنهادی خود را وارد کنید:
          </p>
          <div className="w-full md:w-1/2">
            <Controller
              control={control}
              name="price"
              rules={{
                validate: {
                  range: (value) => {
                    if (
                      Number(
                        englishNumber(
                          value.replaceAll("٬", "").replaceAll(",", ""),
                        ),
                      ) < minimumAcceptableOffer
                    )
                      return `از ${persianNumber(minimumAcceptableOffer)}`;
                    if (
                      Number(
                        englishNumber(
                          value.replaceAll("٬", "").replaceAll(",", ""),
                        ),
                      ) > maximumAcceptableOffer
                    )
                      return `حداکثر ${persianNumber(maximumAcceptableOffer)}`;
                  },
                  required: (value) => {
                    if (!value) return "مبلغ اجباری می باشد";
                  },
                },
              }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <TextField
                  id="price"
                  label={
                    errors.price?.message || "قیمت"
                  }
                  placeholder={`از ${persianNumber(minimumAcceptableOffer)}`}
                  value={value}
                  onChange={(e) => {
                    const lastCharacter = e.target.value.slice(-1);
                    if (!numberInputRegex.test(lastCharacter)) return;

                    const result = Number(
                      englishNumber(
                        e.target.value.replaceAll("٬", "").replaceAll(",", ""),
                      ),
                    ).toLocaleString("fa-ir");

                    onChange(result === "۰" ? "" : result);
                  }}
                  error={!!errors.price}
                  sx={{
                    width: "100%",
                    height: "56px",
                    "& .MuiInputBase-root": {
                      height: "56px",
                    },
                  }}
                  variant="outlined"
                  inputProps={{ inputMode: "numeric" }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ "& p": { fontSize: 12, fontWeight: 500 } }}
                      >
                        تومان
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
        </div>
        {showError && (
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl border border-red p-4 text-sm font-normal text-grey">
            <div className="flex w-full flex-row items-center gap-3">
              <Image
                src="/icons/icon-close-square.svg"
                alt="Error"
                width={32}
                height={32}
              />
              <p className="font-medium">لطفا موارد زیر را اصلاح کنید</p>
            </div>
            {errorReasons.map((item, index) => (
              <div
                key={index}
                className="flex w-full flex-row items-center gap-2"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-red pt-1 text-red">
                  {persianNumber(index)}
                </div>
                <p>{persianNumber(item.message)}</p>
              </div>
            ))}
          </div>
        )}
        <div className="absolute bottom-0 z-20 flex h-20 w-full flex-row-reverse items-center justify-start border-t border-grey-200 bg-white p-4 md:static md:justify-between md:border-0 md:p-0">
          <button
            type="submit"
            disabled={loading}
            className="flex h-[56px] w-full items-center justify-center rounded-lg bg-grey text-base font-semibold text-white md:w-1/2"
          >
            {loading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-4 border-t-4 border-slate-300 border-t-grey-800"></div>
            ) : (
              <p> ثبت پیشنهاد</p>
            )}
          </button>
        </div>
      </form>
      <CartModal cartId={cartId} />
    </>
  );
}
