import { ServiceType } from "../entities/landingPage";
import { GroupOperationType } from "../zustand/groupOperation";

export type OperationOption = {
  id: number;
  title: string;
  subTitle: string;
  imageSrc: string;
  operation: GroupOperationType;
  serviceTypes: ServiceType[];
};

export const discountOperationOption: OperationOption = {
  id: 1,
  title: "اعمال تخفیف",
  subTitle:
    "علاوه بر نمایش داده شدن آگهی با نشان تخفیف دار، آگهی شما در گروه تخفیف دارها نمایش داده خواهد شد.",
  imageSrc: "/icons/icon-percent.svg",
  operation: "discount",
  serviceTypes: ["simcard", "simPack"],
};

export const vipOperationOption: OperationOption = {
  id: 2,
  title: "تعیین سطح",
  subTitle:
    "علاوه بر نمایش داده شدن آگهی شما با نشان برنزی، نقره‌ای یا طلایی در جستجو سیم کارت‌ها آگهی شما با الویت بالاتری نمایش داده خواهد شد.",
  imageSrc: "/icons/icon-check-circle.svg",
  operation: "vip",
  serviceTypes: ["simcard", "simPack", "simcardHighBid", "simPackHighBid"],
};

export const activationOperationOption: OperationOption = {
  id: 3,
  title: "فعال یا غیر فعال سازی",
  subTitle: "می‌توانید نمایش آگهی خود را فعال یا غیر فعال کنید.",
  imageSrc: "/icons/icon-battery.svg",
  operation: "activation",
  serviceTypes: [
    "simcard",
    "simPack",
    "specialSim",
    "simcardHighBid",
    "simPackHighBid",
  ],
};

export const channelOperationOption: OperationOption = {
  id: 4,
  title: "ارسال در کانال",
  subTitle:
    "با استفاده از این سرویس می‌توانید آگهی خود را در کانال روبورند یا کانال‌های شخصی خود بازنشر دهید",
  imageSrc: "/icons/icon-megaphone.svg",
  operation: "channel",
  serviceTypes: ["simcard", "simPack", "simcardHighBid", "simPackHighBid"],
};

export const updateTimeOperationOption: OperationOption = {
  id: 5,
  title: "به روزرسانی تاریخ",
  subTitle:
    "با توجه به الویت نمایش آگهی بر اساس تاریخ، تاریخ آگهی شما به روز خواهد شد.",
  imageSrc: "/icons/icon-card-refresh.svg",
  operation: "updateTime",
  serviceTypes: ["simcard", "simPack"],
};

export const installmentOperationOption: OperationOption = {
  id: 6,
  title: "شرایط اقساطی",
  subTitle:
    "می‌توانید از بین پلن‌های اقساطی خود برای آگهی‌های موردنظرتان پلن اقساطی مناسب را انتخاب کنید.",
  imageSrc: "/icons/icon-cards.svg",
  operation: "installment",
  serviceTypes: ["simcard", "simPack", "simcardHighBid", "simPackHighBid"],
};

export const updatePriceOperationOption: OperationOption = {
  id: 7,
  title: "تغییر قیمت",
  subTitle: "با استفاده از این سرویس می‌توانید قیمت آگهی خود را تغییر دهید.",
  imageSrc: "/icons/icon-cards.svg",
  operation: "updatePrice",
  serviceTypes: ["simcard", "simPack"],
};

export const groupOperationOptions = [
  discountOperationOption,
  vipOperationOption,
  activationOperationOption,
  channelOperationOption,
  updateTimeOperationOption,
  installmentOperationOption,
];

export const singleSimOperationOptions = [
  discountOperationOption,
  vipOperationOption,
  activationOperationOption,
  channelOperationOption,
  updateTimeOperationOption,
  installmentOperationOption,
  updatePriceOperationOption,
];
