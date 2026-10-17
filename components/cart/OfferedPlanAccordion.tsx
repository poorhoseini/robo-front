import { Plan } from "@/lib/entities/plan";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";

export default function OfferedPlanAccordion({
  plan,
  onBuyClick,
}: {
  plan: Plan;
  onBuyClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const handleToggleOpen = () => setOpen((prev) => !prev);

  return (
    <Accordion
      disableGutters
      expanded={open}
      onChange={handleToggleOpen}
      sx={{
        width: "100%",
        minHeight: 56,
        boxShadow: "none",
        color: "#404040",
        fontSize: 14,
        fontWeight: 400,
        border: "1px solid #D9D9D9",
        borderRadius: "8px",
        px: "16px",
        "&:before": { opacity: "0 !important" },
      }}
    >
      <AccordionSummary expandIcon={undefined} sx={{ p: 0 }}>
        <div className="flex w-full flex-col items-start gap-3">
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-start gap-1">
              <h3 className="text-base font-medium leading-5 text-grey">
                {plan.serviceNameFa}
              </h3>
              <div className="rounded-lg bg-biege px-2 py-[2px] text-[10px] font-medium leading-5 text-brown">
                {persianNumber(plan.period) + " روزه"}
              </div>
            </div>
            <IconButton>
              <Image
                src="/icons/icon-chevron-down-grey-circled.svg"
                alt=""
                width={20}
                height={20}
                className={`transition-all ${open ? "rotate-180" : "rotate-0"}`}
              />
            </IconButton>
          </div>
          <div className="flex w-full flex-row items-center justify-between">
            <p className="leading-5 text-grey">
              <span className="text-xl font-bold">
                {persianNumber(plan.price)}
              </span>
              <span className="text-sm font-light"> تومان</span>
            </p>
            <Button
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onBuyClick();
              }}
            >
              <p className="text-xs font-medium leading-5 text-white">
                خرید اشتراک
              </p>
            </Button>
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>
        <div className="flex w-full flex-col items-start gap-3">
          {plan.subList.map((subItem, subIndex) => (
            <div
              key={subIndex}
              className="flex w-full flex-row items-center justify-start gap-2"
            >
              <Image
                src="/icons/icon-check-biege-circle.svg"
                alt=""
                width={18}
                height={18}
              />
              <p>
                <span>{persianNumber(subItem.counter)} عدد</span>
                <span>{subItem.serviceNameFa}</span>
              </p>
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
