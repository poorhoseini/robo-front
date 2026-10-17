"use client";

import { useContext, useEffect, useState } from "react";
import useScroll from "../forms/search/useScroll";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import {
  GetUserSessionsResponseProps,
  UserSession,
} from "@/lib/entities/session";
import getUserSessions from "@/lib/api/getUserSessions";
import UserSessionSkeleton from "../skeletons/UserSessionSkeleton";
import UserSessionCard from "../cards/UserSessionCard";
import EndUserSessionDialog from "./EndUserSessionDialog";
import endUserSession from "@/lib/api/endUserSession";
import endAllOtherUserSessions from "@/lib/api/endAllOtherUserSessions";

export default function SessionsResultSection() {
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [clientSideResult, setClientSideResult] = useState<UserSession[]>([]);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingEndSession, setLoadingEndSession] = useState(false);
  const [scrollPosition, scrollLimit, scrollDirection] = useScroll();
  const [selectedUserSession, setSelectedUserSession] = useState<UserSession>();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  useEffect(() => {
    if (!auth.token) return;

    setClientSideResult([]);
    setSkip(0);
    handleGetNewResults(0);
  }, [auth.token]);

  async function handleGetNewResults(skip: number) {
    if (skip > clientSideResult!.length) return;

    setLoading(true);

    try {
      const userSessions: GetUserSessionsResponseProps = await getUserSessions(
        auth.token,
        9,
        [],
        { field: "_id", order: -1 },
        skip,
      );
      setClientSideResult((prev) => [
        ...prev,
        ...userSessions.data.filter(
          (newItem) => !prev.some((item) => item._id === newItem._id),
        ),
      ]);
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
        toast.error("خطا در دریافت لیست نشست ها");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleEndSession(sessionId?: string) {
    if (!sessionId) return;

    setLoadingEndSession(true);
    try {
      const res = await endUserSession(auth.token, sessionId);
      setClientSideResult([]);
      setSkip(0);
      handleGetNewResults(0);
      handleClose();
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
        toast.error("خطا در بستن نشست");
      }
    } finally {
      setLoadingEndSession(false);
    }
  }

  async function handleEndAllOtherSessions() {
    setLoadingEndSession(true);
    try {
      const res = await endAllOtherUserSessions(auth.token);
      setClientSideResult([]);
      setSkip(0);
      handleGetNewResults(0);
      handleClose();
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
        toast.error("خطا در بستن سایر نشست ها");
      }
    } finally {
      setLoadingEndSession(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4">
      {clientSideResult.map((userSession) => (
        <UserSessionCard
          key={userSession._id}
          device={userSession.browser === "PostmanRuntime" ? "bot" : "desktop"}
          browser={userSession.browser}
          date={userSession.loginTime}
          isCurrent={userSession.isCurrent}
          onLogoutClick={() => {
            setSelectedUserSession(userSession);
            handleOpen();
          }}
        />
      ))}
      {loading &&
        new Array(3)
          .fill(1)
          .map((item, index) => <UserSessionSkeleton key={index} />)}
      <EndUserSessionDialog
        endOthers={selectedUserSession?.isCurrent}
        open={open}
        handleClose={handleClose}
        loading={loadingEndSession}
        onFinish={() =>
          selectedUserSession
            ? selectedUserSession.isCurrent
              ? handleEndAllOtherSessions()
              : handleEndSession(selectedUserSession.sessionId)
            : {}
        }
      />
    </div>
  );
}
