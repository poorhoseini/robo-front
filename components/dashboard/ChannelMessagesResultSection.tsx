"use client";

import { ChangeEvent, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { MenuItem, TextField } from "@mui/material";
import { Channel, GetMyChannelsResponseProps } from "@/lib/entities/channel";
import getMyChannels from "@/lib/api/getMyChannels";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Space from "../general/Space";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import getMyChannelMessages from "@/lib/api/getMyChannelMessages";
import {
  ChannelMessage,
  GetMyChannelMessagesResponseProps,
} from "@/lib/entities/channelMessage";
import { RequestFilter } from "@/lib/entities/api";
import ChannelMessageCard from "../cards/ChannelMessageCard";
import preResendToChannel from "@/lib/api/preResendToChannel";
import { PreResendToChannelResponseProps } from "@/lib/entities/preResendToChannel";
import CartModal from "../cart/CartModal";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";

export default function ChannelMessagesResultSection({
  initialChannelId,
}: {
  initialChannelId?: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { auth, resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loadingChannels, setLoadingChannels] = useState(true);
  const [selectedChannelId, setSelectedChannelId] = useState(
    initialChannelId || "all",
  );
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [channelMessages, setChannelMessages] = useState<ChannelMessage[]>([]);
  const [cartId, setCartId] = useState<string>();

  useEffect(() => {
    if (!auth.token) return;

    handleGetChannels();
  }, [auth.token]);

  useEffect(() => {
    if (!auth.token) return;

    handleGetChannelMessages(selectedChannelId);
  }, [auth.token, selectedChannelId]);

  async function handleGetChannels() {
    if (!auth.token) return;

    setLoadingChannels(true);

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
      setLoadingChannels(false);
    }
  }

  async function handleGetChannelMessages(channelId?: string) {
    if (!auth.token) return;

    setLoadingMessages(true);

    const filters: RequestFilter[] = [];
    if (channelId) {
      filters.push({
        field: "roboChannelId",
        oprand: "=",
        value: channelId,
      });
    }

    try {
      const response: GetMyChannelMessagesResponseProps =
        await getMyChannelMessages(auth.token, {
          filters: filters,
        });
      setChannelMessages(response.data);
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
        toast.error("خطا در دریافت لیست پیام های کانال");
      }
    } finally {
      setLoadingMessages(false);
    }
  }

  async function handleResendMessage(messageId: string) {
    if (!auth.token) return;

    // setLoadingChannels(true);

    try {
      const response: PreResendToChannelResponseProps =
        await preResendToChannel(auth.token, {
          messageIds: [messageId],
        });
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در ارسال مجدد پیام");
      }
    } finally {
      // setLoadingChannels(false);
    }
  }

  const handleChannelIdChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (searchParams.get("id")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("id");
      router.replace(`${pathname}?${params}`);
    }
    setSelectedChannelId(e.target.value);
  };

  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <h2 className="text-2xl font-medium text-grey">لیست پیام‌ها</h2>
        <TextField
          id="channel-id"
          select
          label="لیست کانال ها"
          value={selectedChannelId}
          onChange={handleChannelIdChange}
          sx={{
            width: "165px",
            height: "48px",
            "& .MuiInputBase-root": {
              height: "48px",
              backgroundColor: "white",
            },
            "& fieldset": {
              borderColor: "#ECECEC",
            },
          }}
          variant="outlined"
        >
          <MenuItem value="all">همه کانال ها</MenuItem>
          {channels.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.channelId}
            </MenuItem>
          ))}
        </TextField>
      </div>
      <Space value={24} />
      <div className="flex w-full flex-col items-center gap-6">
        {channelMessages.map((message) => (
          <ChannelMessageCard
            key={message._id}
            date={message.sentDate}
            state={message.state}
            body={message.message}
            targetUrl={message?.url || "my-simcards"}
            onResendClick={() => handleResendMessage(message._id)}
          />
        ))}
      </div>
      {!!cartId && <CartModal cartId={cartId} />}
    </div>
  );
}
