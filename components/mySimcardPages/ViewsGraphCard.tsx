import { GraphData } from "@/lib/entities/simViewsGraphData";
import Space from "../general/Space";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";

export default function ViewsGraphCard({
  graphData,
}: {
  graphData: GraphData;
}) {
  const maxIntervalCount = graphData.graphDatas.reduce(
    (acumulator, currentValue) => Math.max(acumulator, currentValue.count),
    -Infinity,
  );

  return (
    <div className="flex h-[203px] w-full flex-col items-start justify-start rounded-2xl bg-white pt-5 md:min-w-[820px]">
      <div className="mx-auto">
        <h2 className="text-sm font-bold text-grey">
          <span>تعداد بازدید: </span>
          <span className="text-[#314CFF]">
            {persianNumber(graphData.sumCount)}
          </span>
        </h2>
        <Space value={10} />
        <div className="flex min-h-[150px] w-full flex-row-reverse items-end justify-center gap-3 md:gap-6">
          {graphData.graphDatas.map((item, index) => (
            <GraphBar
              key={index}
              count={item.count}
              heightPercent={(item.count / maxIntervalCount) * 100}
              timeStamp={item.endOfRangeTimestamp}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GraphBar({
  count,
  heightPercent,
  timeStamp,
}: {
  count: number;
  heightPercent: number;
  timeStamp: EpochTimeStamp;
}) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <Tooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      placement="top-start"
      title={
        <div className="rounded-xl bg-white px-2 py-1 text-[10px] font-bold text-[#344BFD] shadow-md">
          {persianNumber(count)}
        </div>
      }
      followCursor
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: "white",
            borderRadius: "12px",
            padding: 0,
          },
        },
      }}
    >
      <div className="flex h-[150px] w-10 flex-col items-center justify-end gap-[10px]">
        <div
          className={`w-full rounded-xl ${open ? "bg-[#ebedff]" : "bg-gradient-to-t from-[#f4f5fa] to-white"}`}
          style={{ height: (110 * heightPercent) / 100 }}
        />
        <p
          className={`text-center text-[10px] ${open ? "font-medium text-[#314CFF]" : "font-normal text-grey"}`}
        >
          {new Date(timeStamp * 1000).toLocaleDateString("fa-IR")}
          <br />
          {new Date(timeStamp * 1000).toLocaleTimeString("fa-IR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </Tooltip>
  );
}
