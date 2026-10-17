import { persianNumber } from "@/lib/helpers/persianNumber.helper";

export default function FilterBadge({ count }: { count: number }) {
  if (!count) return <></>;
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-biege pt-1 text-sm font-normal text-grey">
      {persianNumber(count)}
    </div>
  );
}
