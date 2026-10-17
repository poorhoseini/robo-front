import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import Space from "../general/Space";

export default function PriceGraph({
  data,
  hasLegend = true,
}: {
  data: Array<{ value: number; color: string; label: string }>;
  hasLegend?: boolean;
}) {
  return (
    <div className="flex w-full flex-col items-center">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        {data
          .sort((a, b) => b.value - a.value)
          .map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="flex items-center justify-center text-nowrap rounded-[4px] bg-biege-200 p-2">
                {persianNumber(item.value) + " تومان"}
              </div>
              <Triangle color={item.color} />
            </div>
          ))}
      </div>
      <Space value={8} />
      <div className="relative w-full">
        <div className="h-[5px] w-full rounded-[4px] bg-grey-200" />
        <div className="absolute top-0 flex w-full flex-row items-center justify-between">
          {data.map((item, index) => (
            <Dot key={index} />
          ))}
          {data.map((item, index) => (
            <Dot key={index} />
          ))}
        </div>
      </div>
      {hasLegend && (
        <>
          <Space value={32} />
          <div className="flex w-full flex-row items-center justify-end gap-6">
            {data.map((item, index) => (
              <div
                key={index}
                className="flex flex-row-reverse items-center justify-start gap-2"
              >
                <p className="text-sm font-normal text-[#465668]">
                  {item.label}
                </p>
                <div
                  className="h-[5px] w-[25px] rounded-[10px]"
                  style={{ backgroundColor: item.color }}
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Dot() {
  return <div className="h-[5px] w-[5px] rounded-full bg-grey" />;
}

function Triangle({ color }: { color: string }) {
  return (
    <div
      className="-mb-[15px] h-0 w-0 border-[15px] border-b-transparent border-l-transparent border-r-transparent"
      style={{ borderTopColor: color }}
    />
  );
}
