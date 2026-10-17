export default function SearchAdvertiserSkeleton() {
  return (
    <div
      className={`flex w-full flex-col items-center justify-start gap-8 rounded-2xl border border-grey-100 bg-white p-8 text-grey`}
    >
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="flex w-full flex-row items-center gap-2">
          <h3 className="text-base font-medium">{"skeleton"}</h3>
        </div>

        <div className="flex h-[20px] min-w-[73px] flex-row items-center justify-center gap-1 rounded-md bg-biege p-2">
          skeleton
          <p className="pt-1 text-xs font-normal text-orange">skeleton</p>
        </div>
      </div>

      <div className="flex w-full flex-row items-center justify-between gap-3 rounded-lg bg-neutral p-4 text-sm font-normal">
        <div className="flex w-1/3 flex-col items-start justify-between gap-3">
          <h4>نوع فروشگاه</h4>
          <p className="text-base font-medium">skeleton</p>
        </div>
        <VerticalLine />
        <div className="flex w-1/3 flex-col items-start justify-between gap-3">
          <h4>نوع خدمات</h4>
          <p className="text-base font-medium">skeleton</p>
        </div>
        <VerticalLine />
        <div className="flex w-1/3 flex-col items-start justify-between gap-3">
          <h4>کانال تلگرام</h4>
          <p className="text-base font-medium">skeleton</p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <h4 className="text-sm font-medium">شماره تماس:</h4>
        <div className="flex flex-row items-center justify-start gap-2 text-base font-medium">
          skeleeton
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <h4 className="text-sm font-medium">آدرس:</h4>
        skeleton
      </div>
    </div>
  );
}

function VerticalLine() {
  return <div className="h-[52px] w-[1px] bg-grey-200" />;
}

function VerticalLineSmall() {
  return <div className="h-[16px] w-[1px] bg-blue" />;
}
