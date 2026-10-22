import { LandingPageCardType } from "@/lib/entities/landingPage";

/**
 * Returns a standardized, theme-matched SVG icon for each section
 * based on its title and cardType.
 */
export function getSectionIcon(
  cardType?: LandingPageCardType | string,
  title?: string,
  customIcon?: string,
): string {
  if (customIcon) return customIcon;

  const normalizedTitle = (title || "").trim();

  // Match by title keywords
  if (normalizedTitle.includes("سرویس") || normalizedTitle.includes("خدمات")) {
    return "/icons/sections/icon-section-services.svg";
  }
  if (
    normalizedTitle.includes("آخرین") ||
    normalizedTitle.includes("جدیدترین")
  ) {
    return "/icons/sections/icon-section-latest.svg";
  }
  if (
    normalizedTitle.includes("ویژه") ||
    normalizedTitle.includes("پیشنهاد ویژه") ||
    normalizedTitle.includes("منتخب")
  ) {
    return "/icons/sections/icon-section-special-offer.svg";
  }
  if (normalizedTitle.includes("فروشگاه")) {
    return "/icons/sections/icon-section-store.svg";
  }
  if (normalizedTitle.includes("تخفیف")) {
    return "/icons/sections/icon-section-discount.svg";
  }
  if (normalizedTitle.includes("مشابه")) {
    return "/icons/sections/icon-section-similar.svg";
  }
  if (normalizedTitle.includes("خواست")) {
    return "/icons/sections/icon-section-simkhast.svg";
  }
  if (
    normalizedTitle.includes("پیشنهاد") ||
    normalizedTitle.includes("مزایده")
  ) {
    return "/icons/sections/icon-section-bid.svg";
  }
  if (
    normalizedTitle.includes("گروهی") ||
    normalizedTitle.includes("بسته") ||
    normalizedTitle.includes("پک")
  ) {
    return "/icons/sections/icon-section-simpack.svg";
  }
  if (normalizedTitle.includes("رند")) {
    return "/icons/sections/icon-section-rond.svg";
  }

  // Fallback by cardType
  switch (cardType) {
    case "store":
      return "/icons/sections/icon-section-store.svg";
    case "offPrice":
      return "/icons/sections/icon-section-discount.svg";
    case "simPack":
      return "/icons/sections/icon-section-simpack.svg";
    case "simKhast":
      return "/icons/sections/icon-section-simkhast.svg";
    case "highBidSimcard":
    case "highBidSimPack":
      return "/icons/sections/icon-section-bid.svg";
    case "singleSim-table":
      return "/icons/sections/icon-section-latest.svg";
    case "videoCard":
      return "/icons/sections/icon-section-services.svg";
    case "singleSim":
      return "/icons/sections/icon-section-simcard.svg";
    default:
      return "/icons/sections/icon-section-default.svg";
  }
}
