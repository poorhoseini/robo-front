import { Installment } from "@/lib/entities/installment";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import LoanRemoveButton from "./LoanRemoveButton";

export default function LoanBox({
  installmentPlan,
  isRemovable,
}: {
  installmentPlan: Installment[];
  isRemovable: boolean;
}) {
  return (
    <div className="hidden w-full text-sm font-normal md:block">
      {installmentPlan.map((plan: Installment, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: "#FBEFD2",
            boxShadow: "none",
            color: "#404040",
            borderRadius: "8px !important",
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <h3>شرایط اقساطی</h3>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0 }}>
            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
                <p>حداقل دوره بازپرداخت اقساط</p>
                <p className="font-medium">{`${persianNumber(plan.minimumMonth)} ماهه`}</p>
              </div>
              <HorizontalLine />
              <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
                <p>حداکثر دوره بازپرداخت اقساط</p>
                <p className="font-medium">{`${persianNumber(plan.maximumMonth)} ماهه`}</p>
              </div>
              <HorizontalLine />
              <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
                <p>پیش پرداخت</p>
                <p className="font-medium">{`حداقل ${persianNumber(plan.preFound || 0)} ٪`}</p>
              </div>
              <HorizontalLine />
              <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
                <p>سود</p>
                <p className="ltr font-medium">{`${persianNumber(plan.profitPercent)} ٪`}</p>
              </div>
              {isRemovable && (
                <>
                  <HorizontalLine />
                  <div className="flex w-full flex-row items-center justify-between gap-2 px-4">
                    <LoanRemoveButton />
                  </div>
                </>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}
