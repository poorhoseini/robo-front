import { StoreAdvertiser, UserAdvertiser } from "@/lib/entities/advertiser";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import DeleteUserProfileStoreDialog from "../dashboard/DeleteUserProfileStoreDialog";
import StoreVitrinModal from "../dashboard/serviceModals/StoreVitrinModal";

type AdvertiserCardProps = {
  isStore: boolean;
  user: UserAdvertiser[];
  store: StoreAdvertiser;
  searchPage?: boolean;
  userProfilePage?: boolean;
  onFinishDelete?: () => void;
};

export default function AdvertiserCard({
  isStore,
  user,
  store,
  searchPage,
  userProfilePage,
  onFinishDelete,
}: AdvertiserCardProps) {
  let advertiserName;
  let phoneNumbers: string[];

  if (isStore) {
    advertiserName = store.storeName;
    phoneNumbers = store.numbers;
  } else {
    advertiserName = "آگهی دهنده شخصی";
    phoneNumbers = user[0].phoneNumber;
  }

  return (
    <div
      className={`flex flex-col items-center justify-start gap-6 rounded-2xl bg-white p-4 text-grey md:gap-8 md:p-8 ${searchPage ? "w-full border border-grey-100" : "w-full border border-grey-100 md:w-[916px] md:border-0"}`}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          {!searchPage && (
            <Image
              src="/icons/icon-shop.svg"
              alt="Shop"
              width={40}
              height={40}
            />
          )}
          <h3 className="text-base font-medium">{advertiserName}</h3>
        </div>

        {isStore && (
          <div className="flex h-[20px] min-w-[73px] flex-row items-center justify-center gap-1 rounded-md bg-transparent p-2 md:bg-biege">
            <Image
              src="/icons/icon-eye-orange.svg"
              alt="View Count"
              width={16}
              height={16}
            />
            <p className="pt-1 text-xs font-normal text-orange">
              {persianNumber(store.viewsCount || 0)}
            </p>
          </div>
        )}
      </div>
      {isStore && (
        <div className="hidden w-full flex-row items-center justify-between gap-3 rounded-lg bg-neutral p-4 text-sm font-normal md:flex">
          <div className="flex w-1/3 flex-col items-start justify-between gap-3">
            <h4>نوع فروشگاه</h4>
            <p className="text-base font-medium">
              {store.storeType || "نامشخص"}
            </p>
          </div>
          <VerticalLine />
          <div className="flex w-1/3 flex-col items-start justify-between gap-3">
            <h4>نوع خدمات</h4>
            <p className="text-base font-medium">{store.services.join(", ")}</p>
          </div>
          <VerticalLine />
          <div className="flex w-1/3 flex-col items-start justify-between gap-3">
            <h4>کانال تلگرام</h4>
            <p className="text-base font-medium">
              {store.telegram || "نامشخص"}
            </p>
          </div>
        </div>
      )}
      <div className="hidden w-full flex-col items-start gap-2 md:flex">
        <h4 className="text-sm font-medium">شماره تماس:</h4>
        <div className="flex flex-row items-center justify-start gap-2 text-base font-medium">
          {phoneNumbers.map((phone, index) => (
            <Fragment key={index}>
              {(index && <VerticalLineSmall />) || ""}
              <p>{persianNumber(phone)}</p>
            </Fragment>
          ))}
        </div>
      </div>
      {isStore && (
        <div className="flex w-full flex-col items-center gap-3 text-sm font-normal md:hidden">
          <div className="flex w-full flex-row items-center justify-between">
            <p>نوع خدمات</p>
            <p>{store.services.join(", ")}</p>
          </div>
          <HorizontalLine />
          <div className="flex w-full flex-row items-center justify-between">
            <p>نوع فروشگاه</p>
            <p>{store.storeType || "نامشخص"}</p>
          </div>
        </div>
      )}
      {isStore && (
        <>
          <div className="hidden w-full flex-col items-start gap-2 md:flex">
            <h4 className="text-sm font-medium">آدرس:</h4>
            {store.addresses.map((address, index) => (
              <div
                key={index}
                className="flex flex-row items-center justify-start gap-2 text-base font-medium"
              >
                <p className="text-base font-normal">{address}</p>
              </div>
            ))}
          </div>
          {!searchPage && (
            <>
              <Link
                href={`/search?shopId=${store._id}`}
                rel="noopener noreferrer"
                target="_blank"
                className="hidden w-[352px] flex-row items-center justify-center gap-2 self-end rounded-xl bg-grey-200 py-4 text-base font-medium md:flex"
              >
                <p>مشاهده فروشگاه</p>
                <Image
                  src="/icons/icon-arrow-left-black.svg"
                  alt="Visit Shop"
                  width={16}
                  height={16}
                />
              </Link>
              <Link
                href={`/search?shopId=${store._id}`}
                className="flex w-full flex-row items-center justify-end gap-2 self-end text-sm font-normal md:hidden"
              >
                <p>مشاهده فروشگاه</p>
                <div className="flex h-5 w-5 items-center justify-center rounded-[4px] bg-blue-900">
                  <Image
                    src="/icons/icon-arrow-left.svg"
                    alt="Enter"
                    width={16}
                    height={16}
                  />
                </div>
              </Link>
            </>
          )}
        </>
      )}
      {!!userProfilePage && (
        <div className="flex w-full flex-row items-center justify-end gap-4">
          <StoreVitrinModal id={store._id} name={store.storeName} />
          <DeleteUserProfileStoreDialog
            storeId={store._id}
            onFinish={onFinishDelete ? onFinishDelete : () => {}}
          />
        </div>
      )}
    </div>
  );
}

function VerticalLine() {
  return <div className="h-[52px] w-[1px] bg-grey-200" />;
}

function VerticalLineSmall() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}
