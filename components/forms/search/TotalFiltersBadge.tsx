import { persianNumber } from "@/lib/helpers/persianNumber.helper";

export default function TotalFiltersBadge({ count }: { count: number }) {
  if (!count) return <></>;
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white pt-1 text-xs font-normal text-brown">
      {persianNumber(count)}
    </div>
  );
}
