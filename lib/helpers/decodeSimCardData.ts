import { Operator } from "../entities/operator";
import { SimPackType } from "../entities/simPack";

export function getSimCardStateLabel(state: number): string {
  switch (state) {
    case 0:
      return "صفر بی نام";
    case 1:
      return "کارکرده";
    case 2:
      return "درحد نو";
    case 3:
      return "صفر به نام";
    default:
      return "نامشخص";
  }
}

export function getSimCardTypeLabel(type: number): string {
  switch (type) {
    case 0:
      return "دائمی";
    case 1:
      return "اعتباری";
    default:
      return "نامشخص";
  }
}

export function getSimCardOperatorIconUrl(operator: Operator): string {
  switch (operator) {
    case "mci":
      return "/icons/icon-hamrah.svg";
    case "mtn":
      return "/icons/icon-irancell.svg";
    case "rightel":
      return "/icons/icon-rightel.svg";
    default:
      return "/icons/icon-not-found.svg";
  }
}

export function getSimCardOperatorLabel(operator: Operator): string {
  switch (operator) {
    case "mci":
      return "همراه اول";
    case "mtn":
      return "ایرانسل";
    case "X":
      return "فرقی ندارد";
    default:
      return "نامشخص";
  }
}

export function getSimCardPriceTypeLabel(priceType: number): string {
  switch (priceType) {
    case 0:
      return "قیمت مشخص";
    case 1:
      return "تماس بگیرید";
    case 2:
      return "بالاترین پیشنهاد";
    case 3:
      return "تخفیف خورده";
    case 4:
      return "قابل رزرو";
    default:
      return "نامشخص";
  }
}

export function getSimCardSaleConditionsLabel(
  priceType: number,
  hasInstallment: boolean | "X",
): string {
  if (priceType === 2) return "بالاترین پیشنهاد";
  if (hasInstallment === true) return "نقدی و اقساطی";
  return "نقدی";
}

export function getSimPackTypeLabel(simPackType: SimPackType) {
  switch (simPackType) {
    case "hamzad":
      return "همزادی";
    case "sabad":
      return "سبدی";
    case "serial":
      return "سریالی";
    default:
      return "نامشخص";
  }
}

export function getSimCardLevelLabel(vip: number): string {
  switch (vip) {
    case 1:
      return "برنزی";
    case 2:
      return "نقره ای";
    case 3:
      return "طلایی";
    default:
      return "نامشخص";
  }
}

export function getSimCardLevelIconUrl(vip: number): string {
  switch (vip) {
    case 1:
      return "/icons/icon-star-bronze.svg";
    case 2:
      return "/icons/icon-star-silver.svg";
    case 3:
      return "/icons/icon-star-gold.svg";
    default:
      return "/";
  }
}
