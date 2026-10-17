"use client";

import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { Button, Skeleton, Switch } from "@mui/material";
import { Channel, GetMyChannelsResponseProps } from "@/lib/entities/channel";
import getMyChannels from "@/lib/api/getMyChannels";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import AddChannelDialog from "./AddChannelDialog";
import Image from "next/image";
import ToggleChannelActivationDialog from "./ToggleChannelActivationDialog";
import { useRouter } from "next/navigation";

export default function ChannelsResultSection() {
  const router = useRouter();
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();

  useEffect(() => {
    if (!auth.token) return;

    handleGetChannels();
  }, [auth.token]);

  async function handleGetChannels() {
    if (!auth.token) return;

    setLoading(true);

    try {
      const response: GetMyChannelsResponseProps = await getMyChannels(
        auth.token,
        { filters: [] },
      );
      setChannels(response.data.channelDatas);
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
        toast.error("خطا در دریافت لیست کانال ها");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex w-[938px] flex-col items-end justify-start rounded-2xl border border-grey-200 bg-white px-10 py-6">
      <div className="flex h-12 w-full flex-row items-center justify-between gap-2">
        <span className="text-lg font-medium leading-5 text-grey">
          لیست کانال‌های شخصی
        </span>
        <AddChannelDialog onSuccess={() => handleGetChannels()} />
      </div>
      {loading ? (
        <div className="flex w-full flex-col items-center gap-2">
          {new Array(4).fill(1).map((item, index) => (
            <Skeleton key={index} variant="rounded" width="100%" height={53} />
          ))}
        </div>
      ) : (
        channels.map((channel) => (
          <Fragment key={channel.id}>
            <div className="flex w-full flex-row items-center justify-between gap-2">
              <Button
                variant="text"
                size="large"
                onClick={() => {
                  router.push(`my-messages?id=${channel.id}`);
                }}
                sx={{ p: 0, width: "100%", height: "56px" }}
              >
                <div className="flex w-full flex-row items-center justify-start gap-2">
                  <Image
                    src={
                      channel.channelPlatform === "telegram"
                        ? "/icons/logo-telegram.svg"
                        : "/icons/logo-bale.svg"
                    }
                    alt=""
                    width={18}
                    height={18}
                  />
                  <span className="text-sm font-medium leading-6 text-grey">
                    {channel.channelId}
                  </span>
                </div>
              </Button>
              <Switch
                checked={channel.isActive}
                onChange={(e) => {
                  setSelectedChannel(channel);
                }}
              />
            </div>
            <div className="w-full border-t border-grey-100" />
          </Fragment>
        ))
      )}
      <ToggleChannelActivationDialog
        selectedChannel={selectedChannel}
        onSuccess={handleGetChannels}
        open={!!selectedChannel}
        handleClose={() => setSelectedChannel(undefined)}
      />
    </div>
  );
}
