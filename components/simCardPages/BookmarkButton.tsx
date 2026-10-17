"use client";

import getBookmarkState from "@/lib/api/getBookmarkState";
import {
  ChangeBookmarkStateRequestProps,
  ChangeBookmarkStateResponseProps,
  GetBookmarkStateRequestProps,
  GetBookmarkStateResponseProps,
} from "@/lib/entities/bookmark";
import { ServiceType } from "@/lib/entities/landingPage";
import { AuthContext } from "@/lib/providers/AuthProvider";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Spinner from "../general/Spinner";
import changeBookmarkState from "@/lib/api/changeBookmarkState";
import { toast } from "react-toastify";
import { ResponseError } from "@/lib/api/error";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";

export default function BookmarkButton({
  id,
  serviceType,
}: {
  id: string;
  serviceType: ServiceType;
}) {
  const { auth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth.token) {
      setIsBookmarked(false);
      return;
    }

    handleGetBookmarkState();
  }, [auth.token]);

  async function handleGetBookmarkState() {
    setLoading(true);

    const payload: GetBookmarkStateRequestProps = {
      refrence: serviceType,
      refrenceId: id,
    };

    try {
      const res: GetBookmarkStateResponseProps = await getBookmarkState(
        payload,
        auth.token,
      );
      setIsBookmarked(res.data.isBookmark);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBookmarkClick() {
    setLoading(true);

    const payload: ChangeBookmarkStateRequestProps = {
      refrence: serviceType,
      refrenceId: id,
      isActive: !isBookmarked,
    };

    try {
      const response: ChangeBookmarkStateResponseProps =
        await changeBookmarkState(payload, auth.token);
      setIsBookmarked((prev) => !prev);
      toast.success(response.message);
    } catch (error) {
      if (error instanceof ResponseError) {
        toast.error(error.printError());

        const errorReason = error.getErrorReason();
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
    <button onClick={handleBookmarkClick}>
      <div className="hidden h-10 w-10 items-center justify-center rounded-lg bg-blue-900 md:flex">
        {loading ? (
          <Spinner />
        ) : isBookmarked ? (
          <Image
            src="/icons/icon-bookmark-active.svg"
            alt="Bookmarked"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src="/icons/icon-bookmark-outlined.svg"
            alt="Not Bookmarked"
            width={24}
            height={24}
          />
        )}
      </div>
      <div className="flex items-center justify-center md:hidden">
        {loading ? (
          <Spinner />
        ) : isBookmarked ? (
          <Image
            src="/icons/icon-bookmark-black-active.svg" //زchange this
            alt="Bookmarked"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src="/icons/icon-bookmark-black.svg"
            alt="Not Bookmarked"
            width={24}
            height={24}
          />
        )}
      </div>
    </button>
  );
}
