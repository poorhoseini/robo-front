"use client";

import {
  forwardRef,
  Fragment,
  TouchEvent,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContext } from "@/lib/providers/AuthProvider";
import { TransitionProps } from "@mui/material/transitions";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { CartDialogContext } from "@/lib/providers/CartDialogProvider";
import Image from "next/image";
import CartModal from "@/components/cart/CartModal";
import {
  useGroupOperationActions,
  useSelectedItems,
  useServiceType,
} from "@/lib/zustand/groupOperation";
import { SingleSimCard } from "@/lib/entities/singleSimCard";
import SavedItemCardClient from "@/components/forms/dashboard/SavedItemCardClient";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { ResponseError } from "@/lib/api/error";
import { toast } from "react-toastify";
import { LoginDialogContext } from "@/lib/providers/LoginDialogProvider";
import Spinner from "@/components/general/Spinner";
import { Channel, GetMyChannelsResponseProps } from "@/lib/entities/channel";
import {
  PreSendToChannelRequestProps,
  PreSendToChannelResponseProps,
} from "@/lib/entities/preSendToChannel";
import preSendToChannel from "@/lib/api/preSendToChannel";
import getMyChannels from "@/lib/api/getMyChannels";
import Space from "@/components/general/Space";
import { SimPack } from "@/lib/entities/simPack";
import { SimKhast } from "@/lib/entities/simKhast";
import AddChannelDialog from "../AddChannelDialog";
import ToggleChannelActivationDialog from "../ToggleChannelActivationDialog";

export default function ChannelModal({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: () => void;
}) {
  const { resetAuth } = useContext(AuthContext);
  const { setLoginDialogOpen } = useContext(LoginDialogContext);
  const selectedItems = useSelectedItems();
  const serviceType = useServiceType();
  const { removeItem } = useGroupOperationActions();
  const { auth } = useContext(AuthContext);
  const { setCartDialogOpen } = useContext(CartDialogContext);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [cartId, setCartId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<string[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel>();

  useEffect(() => {
    if (!auth.token || !open) return;

    handleGetChannels();
  }, [auth.token, open]);

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

  async function handleSubmitPreSendToChannel() {
    setLoading(true);

    const payload: PreSendToChannelRequestProps = {
      refrence: serviceType,
      refrenceIds: selectedItems.map((item) => item._id),
      channelType: selectedChannelIds.includes("robo")
        ? "roborond"
        : "personal",
      ...(!selectedChannelIds.includes("robo") && {
        channelIds: selectedChannelIds,
      }),
    };

    try {
      const response: PreSendToChannelResponseProps = await preSendToChannel(
        payload,
        auth.token,
      );
      setCartId(response.cartId);
      setCartDialogOpen(true);
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
        toast.error("خطا در ارسال پیام به کانال");
      }
    } finally {
      setLoading(false);
    }
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleClose();
  }

  return (
    <>
      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "1032px",
            maxWidth: "1032px",
            ...(!fullScreen && { height: "774px" }),
            ...(fullScreen && { paddingBottom: "104px" }),
            borderRadius: "24px",
            backgroundColor: "#F8F9FB",
            border: "1px solid #D9D9D9",
          },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-6 pb-0 pt-[26px]"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-xl font-medium leading-6 text-grey">
              سیم کارت‌های انتخابی
            </span>
          </DialogTitle>
          <IconButton onClick={handleClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
            />
          </IconButton>
        </div>
        <DialogContent
          sx={{
            p: fullScreen ? "24px" : "32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div className="flex w-full flex-col items-start gap-4 md:flex-row md:gap-8">
            <div className="flex w-full flex-col items-center gap-3 rounded-2xl border border-grey-200 bg-white p-4 md:min-w-[464px] md:p-6">
              {serviceType === "simcard" || serviceType === "simcardHighBid" ? (
                (selectedItems as SingleSimCard[]).map((item) => (
                  <SavedItemCardClient
                    key={item._id}
                    serviceType={serviceType}
                    phoneNumber={[item.sellerSpel]}
                    cityName={item.cityFa}
                    provinceName={item.provinceFa}
                    simCardState={item.state}
                    priceType={item.priceType}
                    price={item.price}
                    roundLevelsFa={item.rondData.rondLevelsFa}
                    hasInstallmentPlan={item.isInstallment}
                    onDelete={() => removeItem(item)}
                  />
                ))
              ) : serviceType === "simPack" ||
                serviceType === "simPackHighBid" ? (
                (selectedItems as SimPack[]).map((item) => (
                  <SavedItemCardClient
                    key={item._id}
                    serviceType={serviceType}
                    phoneNumber={item.simcards.map(
                      (simcard) => simcard.sellerSpel,
                    )}
                    cityName={item.cityFa}
                    provinceName={item.provinceFa}
                    simPackType={item.simPackType}
                    priceType={item.priceType}
                    price={item.price}
                    hasInstallmentPlan={item.isInstallment}
                    onDelete={() => removeItem(item)}
                  />
                ))
              ) : serviceType === "specialSim" ? (
                (selectedItems as SimKhast[]).map((item) => (
                  <SavedItemCardClient
                    key={item._id}
                    serviceType={serviceType}
                    phoneNumber={[item.condition.sellerSpel]}
                    operator={item.condition.operator}
                    maxPrice={item.condition.maxPrice}
                    minPrice={item.condition.minPrice}
                    cityName={item.condition.cityFa}
                    provinceName={item.condition.provinceFa}
                    simCardState={item.condition.state}
                    roundLevelsFa={item.condition.rondLevelsFa}
                    onDelete={() => removeItem(item)}
                  />
                ))
              ) : (
                <></>
              )}
            </div>
            <div className="flex w-full flex-col items-start gap-4 md:min-w-[440px]">
              <div className="flex w-full flex-col gap-4 rounded-2xl border border-grey-200 bg-white p-6">
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    نوع سرویس
                  </p>
                  <p className="text-sm font-medium text-grey md:text-base">
                    ارسال در کانال
                  </p>
                </div>
                <HorizontalLine />
                <div className="flex w-full flex-row items-center justify-between">
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">
                    تعداد سرویس
                  </p>
                  <p className="text-sm font-normal leading-5 text-grey md:text-base">{`${persianNumber(selectedItems.length)} عدد`}</p>
                </div>
              </div>
              <div className="flex w-full flex-col items-center rounded-2xl border border-grey-200 bg-white py-4 md:py-6">
                <Button
                  variant="text"
                  size="large"
                  onClick={() =>
                    setSelectedChannelIds((prev) =>
                      prev.includes("robo") ? [] : ["robo"],
                    )
                  }
                  sx={{ p: 0, width: "100%", height: "48px" }}
                >
                  <div className="flex w-full flex-row items-center justify-between px-4 md:px-6">
                    <div className="flex flex-row items-center gap-2">
                      <Image
                        src="/icons/logo-telegram.svg"
                        alt=""
                        width={18}
                        height={18}
                      />
                      <Image
                        src="/icons/logo-bale.svg"
                        alt=""
                        width={18}
                        height={18}
                      />
                      <span className="text-sm font-normal leading-6 text-grey">
                        کانال روبورند
                      </span>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox
                        checked={selectedChannelIds.includes("robo")}
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
                    </div>
                  </div>
                </Button>
                <Space value={16} />
                <div className="flex h-12 w-full flex-row items-center justify-between gap-2 px-4 md:px-6">
                  <span className="text-base font-normal leading-5 text-grey">
                    لیست کانال‌های شخصی
                  </span>
                  <AddChannelDialog onSuccess={() => handleGetChannels()} />
                </div>
                {loadingChannels ? (
                  <div className="flex w-full flex-col items-center gap-2">
                    {new Array(2).fill(1).map((item, index) => (
                      <Skeleton
                        key={index}
                        variant="rounded"
                        width="100%"
                        height={53}
                      />
                    ))}
                  </div>
                ) : (
                  channels
                    .filter((channel) => channel.isActive)
                    .map((channel) => (
                      <Fragment key={channel.id}>
                        <div className="flex w-full flex-row items-center gap-2">
                          <Button
                            variant="text"
                            size="large"
                            onClick={() =>
                              setSelectedChannelIds((prev) =>
                                prev.includes(channel.id)
                                  ? prev.filter((item) => item !== channel.id)
                                  : [
                                      ...prev.filter((item) => item !== "robo"),
                                      channel.id,
                                    ],
                              )
                            }
                            sx={{ p: 0, width: "100%", height: "56px" }}
                          >
                            <div className="flex w-full flex-row items-center justify-between px-4 md:px-6">
                              <div className="flex flex-row items-center gap-2">
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
                              <div className="flex flex-row items-center gap-2">
                                <Checkbox
                                  checked={selectedChannelIds.includes(
                                    channel.id,
                                  )}
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
                              </div>
                            </div>
                          </Button>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedChannel(channel);
                            }}
                          >
                            <Image
                              src="/icons/icon-close-square.svg"
                              alt=""
                              width={16}
                              height={16}
                            />
                          </IconButton>
                        </div>
                        <div className="w-[90%] border-t border-grey-100" />
                      </Fragment>
                    ))
                )}
                <Space value={16} />
                <div className="hidden w-full px-6 md:flex">
                  <button
                    type="button"
                    disabled={loading || !selectedChannelIds.length}
                    className="flex w-full items-center justify-center rounded-md bg-grey p-4 text-[17px] font-bold text-white"
                    onClick={handleSubmitPreSendToChannel}
                  >
                    {loading ? <Spinner /> : "تایید"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
        <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
          <button
            type="button"
            disabled={loading || !selectedChannelIds.length}
            className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white"
            onClick={handleSubmitPreSendToChannel}
          >
            {loading ? <Spinner /> : "تایید"}
          </button>
        </div>
      </Dialog>
      {!!cartId && <CartModal cartId={cartId} />}
      <ToggleChannelActivationDialog
        selectedChannel={selectedChannel}
        onSuccess={() => {
          setSelectedChannelIds((prev) =>
            prev.filter((item) => item !== selectedChannel?.id),
          );
          handleGetChannels();
        }}
        open={!!selectedChannel}
        handleClose={() => setSelectedChannel(undefined)}
      />
    </>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
