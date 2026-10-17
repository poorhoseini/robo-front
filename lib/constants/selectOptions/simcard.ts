import { SelectOption } from "@/lib/entities/form";

export const simcardTypeSelectOptions: SelectOption[] = [
  {
    id: 1,
    label: "دائمی",
    value: "0",
  },
  {
    id: 2,
    label: "اعتباری",
    value: "1",
  },
];

export const simcardStateSelectOptions: SelectOption[] = [
  {
    id: 1,
    label: "صفر بی نام",
    value: "0",
  },
  {
    id: 2,
    label: "کارکرده",
    value: "1",
  },
  {
    id: 3,
    label: "درحد نو",
    value: "2",
  },
  {
    id: 4,
    label: "صفر به نام",
    value: "3",
  },
];

export const simcardPriceTypeSelectOptions: SelectOption[] = [
  {
    id: 1,
    label: "مقطوع",
    value: "0",
  },
  {
    id: 2,
    label: "توافقی",
    value: "1",
  },
];

export const simpackTypeSelectOptions: SelectOption[] = [
  {
    id: 1,
    label: "سریالی",
    value: "serial",
  },
  {
    id: 2,
    label: "سبدی",
    value: "sabad",
  },
  {
    id: 3,
    label: "همزادی",
    value: "hamzad",
  },
];
