type EntityField =
  | "_id"
  | "digit0"
  | "digit1"
  | "digit2"
  | "digit3"
  | "digit4"
  | "digit5"
  | "digit6"
  | "digit7"
  | "digit8"
  | "digit9"
  | "digit10"
  | "digit11"
  | "isActive"
  | "state"
  | "type"
  | "isInstallment"
  | "operator"
  | "code"
  | "preNumber"
  | "rondLevels"
  | "userId"
  | "provinceId"
  | "city"
  | "installmentPlanId"
  | "simcardId"
  | "hasPrice"
  | "priceType"
  | "price"
  | "position"
  | "addvertiseTime"
  | "rondLevels"
  | "isHighBid"
  | "storeId"
  | "storeType"
  | "simPackType"
  | "skip"
  | "highBidId"
  | "specialSimId"
  | "createDate"
  | "serviceNames"
  | "roboChannelId"
  | "serviceType";

type FilterOperand = "=" | "!=" | "and" | "or" | ">" | "<" | "in";

export type RequestFilter = {
  field: EntityField;
  oprand: FilterOperand;
  value: number | number[] | string | string[] | boolean;
};

export type RequestSort = {
  field: EntityField;
  order: -1 | 0 | 1;
};

export type ResponseProps = {
  message: string;
  reason: number;
  status: string;
};

export type SortType = "newest" | "cheapest" | "mostExpensive";
export type SearchType = "simcard" | "simPack" | "simKhast";
export type ViewType = "vitrin" | "card";
