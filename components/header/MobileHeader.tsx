"use client";

import {
  useAddSimcardActions,
  useStep as useSimcardStep,
} from "@/lib/zustand/addSimCard";
import {
  useStep as useSimKhastStep,
  useAddSimKhastActions,
} from "@/lib/zustand/addSimKhast";
import {
  useAddSimPackActions,
  useStep as useSimPackStep,
} from "@/lib/zustand/addSimPack";
import { IconButton } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserButton from "./UserButton";

export default function MobileHeader({
  selectedMenu,
}: {
  selectedMenu: string;
}) {
  const router = useRouter();
  const addSimcardStep = useSimcardStep();
  const { stepBack: addSimcardStepBack, reset: addSimcardReset } =
    useAddSimcardActions();
  const addSimPackStep = useSimPackStep();
  const { stepBack: addSimPackStepBack, reset: addSimPackReset } =
    useAddSimPackActions();
  const addSimKhastStep = useSimKhastStep();
  const { stepBack: addSimKhastStepBack, reset: addSimKhastReset } =
    useAddSimKhastActions();

  return (
    <div className="flex h-14 w-full flex-row items-center justify-between px-4 py-1">
      {(selectedMenu === "addSimcard" ||
        selectedMenu === "addHighestBidSimcard" ||
        selectedMenu === "addExcel") &&
      addSimcardStep !== 1 &&
      addSimcardStep !== 5 ? (
        <IconButton
          onClick={() => {
            addSimcardStepBack();
          }}
        >
          <Image
            src="/icons/icon-chevron-right-black.svg"
            alt=""
            width={7}
            height={12}
          />
        </IconButton>
      ) : (selectedMenu === "addSimPack" ||
          selectedMenu === "addHighestBidSimPack") &&
        addSimPackStep !== 1 ? (
        <IconButton
          onClick={() => {
            addSimPackStepBack();
          }}
        >
          <Image
            src="/icons/icon-chevron-right-black.svg"
            alt=""
            width={7}
            height={12}
          />
        </IconButton>
      ) : selectedMenu === "addSimKhast" && addSimKhastStep !== 1 ? (
        <IconButton
          onClick={() => {
            addSimKhastStepBack();
          }}
        >
          <Image
            src="/icons/icon-chevron-right-black.svg"
            alt=""
            width={7}
            height={12}
          />
        </IconButton>
      ) : selectedMenu === "dashboard" ? (
        <IconButton
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/icons/icon-chevron-right-black.svg"
            alt=""
            width={7}
            height={12}
          />
        </IconButton>
      ) : selectedMenu === "my-simcards" ||
        selectedMenu === "my-simpacks" ||
        selectedMenu === "my-simkhasts" ? (
        <IconButton
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          <Image
            src="/icons/icon-chevron-right-black.svg"
            alt=""
            width={7}
            height={12}
          />
        </IconButton>
      ) : selectedMenu === "terms" ? (
        <IconButton
          onClick={() => {
            router.push("/");
          }}
        >
          <Image
            src="/icons/icon-chevron-right-black.svg"
            alt=""
            width={7}
            height={12}
          />
        </IconButton>
      ) : (
        <UserButton />
      )}
      <h1 className="text-sm font-medium text-grey">
        {selectedMenu === "addSimcard"
          ? "ثبت آگهی سیم کارت"
          : selectedMenu === "addHighestBidSimcard"
            ? "آگهی بالاترین پیشنهاد سیم کارت"
            : selectedMenu === "addSimPack"
              ? "ثبت آگهی سیم پک"
              : selectedMenu === "addHighestBidSimPack"
                ? "آگهی بالاترین پیشنهاد سیم پک"
                : selectedMenu === "addSimKhast"
                  ? "ثبت آگهی سیم خواست"
                  : selectedMenu === "addExcel"
                    ? "آگهی سیم کارت با فایل اکسل"
                    : selectedMenu === "dashboard"
                      ? "پروفایل"
                      : selectedMenu === "my-simcards"
                        ? "سیم کارت ها"
                        : selectedMenu === "my-simpacks"
                          ? "سیم پک ها"
                          : selectedMenu === "my-simkhasts"
                            ? "سیم خواست ها"
                            : selectedMenu === "terms"
                              ? "شرایط و قوانین"
                              : "خانه"}
      </h1>
      {selectedMenu === "addSimcard" ||
      selectedMenu === "addHighestBidSimcard" ? (
        <IconButton
          onClick={() => {
            router.push("/");
            addSimcardReset();
          }}
        >
          <Image src="/icons/icon-close.svg" alt="" width={16} height={16} />
        </IconButton>
      ) : selectedMenu === "addSimPack" ||
        selectedMenu === "addHighestBidSimPack" ? (
        <IconButton
          onClick={() => {
            router.push("/");
            addSimPackReset();
          }}
        >
          <Image src="/icons/icon-close.svg" alt="" width={16} height={16} />
        </IconButton>
      ) : selectedMenu === "addSimKhast" ? (
        <IconButton
          onClick={() => {
            router.push("/");
            addSimKhastReset();
          }}
        >
          <Image src="/icons/icon-close.svg" alt="" width={16} height={16} />
        </IconButton>
      ) : (
        <IconButton onClick={() => {}}>
          <Image
            src="/icons/icon-bell-black.svg"
            alt="User Profile"
            width={20}
            height={20}
          />
        </IconButton>
      )}
    </div>
  );
}
