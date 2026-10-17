import InstallmentPlanSkeleton from "@/components/skeletons/InstallmentPlanSkeleton";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Radio,
  RadioGroup,
  Slide,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { forwardRef, TouchEvent, useMemo, useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import AddInstallmentPlanModal from "./AddInstallmentPlanModal";
import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { InstallmentPlan } from "@/lib/entities/installment";
import { TransitionProps } from "@mui/material/transitions";
import Image from "next/image";
import Spinner from "@/components/general/Spinner";

// type AddSimFormProps = { loanId: string; hasInstallmentPlan: boolean };
type AddSimFormProps = any;

export default function InstallmentPlanSelectorSwitch({
  control,
  watch,
  errors,
  setValue,
  fetchLoading,
  fetchError,
  installmentPlans,
  handleGetMyInstallmentPlans,
}: {
  control: Control<AddSimFormProps, any, AddSimFormProps>;
  watch: UseFormWatch<AddSimFormProps>;
  errors: FieldErrors<AddSimFormProps>;
  setValue: UseFormSetValue<AddSimFormProps>;
  fetchLoading: boolean;
  fetchError: boolean;
  installmentPlans: InstallmentPlan[];
  handleGetMyInstallmentPlans: () => void;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [draggable, setDraggable] = useState(false);
  const [open, setOpen] = useState(false);
  const loanIdWatcher = watch("loanId");

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCancelAndClose = () => {
    setValue("loanId", "");
    setOpen(false);
  };

  const selectedInstallmentPlan = useMemo(() => {
    return installmentPlans.find((item) => item._id === loanIdWatcher);
  }, [installmentPlans, loanIdWatcher]);

  const selectedInstallmentPlanIndex = useMemo(() => {
    return installmentPlans.findIndex((item) => item._id === loanIdWatcher);
  }, [installmentPlans, loanIdWatcher]);

  const handleRemoveInstallmentPlan = () => {
    setValue("loanId", "");
  };

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (!draggable) return;
    if (e.changedTouches[0].clientY > 150) handleCancelAndClose();
  }

  return (
    <>
      <div
        className={`flex max-h-[50vh] min-h-[56px] w-full flex-col items-center gap-4 overflow-y-auto rounded-lg border bg-white p-4 ${!!errors.loanId ? "border-error" : "border-grey-300"}`}
      >
        <div className="flex h-[22px] w-full flex-row items-center justify-between">
          <p className="text-sm font-normal text-grey">پلن اقساطی</p>
          {!!loanIdWatcher ? (
            <button
              type="button"
              onClick={handleRemoveInstallmentPlan}
              className="flex h-7 w-7 items-center justify-center rounded-[4px]"
            >
              <Image
                src="/icons/icon-garbage-red.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpen}
              className="flex h-7 w-7 items-center justify-center rounded-[4px] bg-blue-900"
            >
              <Image
                src="/icons/icon-arrow-left.svg"
                alt=""
                width={16}
                height={16}
              />
            </button>
          )}
        </div>
        {!!loanIdWatcher &&
          !fetchError &&
          !fetchLoading &&
          selectedInstallmentPlan && (
            <div className="flex w-full flex-col items-center gap-3 rounded-lg bg-neutral px-3 py-4">
              <div className="flex w-full flex-row items-center justify-between">
                <h3 className="text-sm font-medium leading-normal text-grey">
                  {"شرایط قسط " + (selectedInstallmentPlanIndex + 1)}
                </h3>
                <div className="flex h-6 w-[68px] items-center justify-center rounded-xl bg-biege px-3 py-[2px]">
                  <p className="text-[10px] font-medium leading-normal text-brown">
                    {persianNumber(selectedInstallmentPlan.profitPercent) +
                      "٪ سود"}
                  </p>
                </div>
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <h3 className="text-xs font-normal text-grey">
                  حداقل/حداکثر دوره بازپرداخت
                </h3>
                <p className="text-sm font-medium text-grey">
                  {persianNumber(selectedInstallmentPlan.minimumMonth) +
                    " ماهه/ " +
                    persianNumber(selectedInstallmentPlan.maximumMonth) +
                    " ماهه"}
                </p>
              </div>
              <HorizontalLine />
              <div className="flex w-full flex-row items-center justify-between">
                <h3 className="text-sm font-normal text-grey">پیش پرداخت</h3>
                <p className="text-sm font-medium text-grey">
                  {"حداقل " +
                    persianNumber(selectedInstallmentPlan.preFound) +
                    " درصد"}
                </p>
              </div>
            </div>
          )}
      </div>

      <Dialog
        open={open}
        draggable={draggable}
        onTouchMove={handleTouchMove}
        onClose={handleCancelAndClose}
        fullScreen={fullScreen}
        TransitionComponent={Transition}
        PaperProps={{
          sx: {
            width: "804px",
            maxWidth: "804px",
            ...(!fullScreen && { height: "824px" }),
            ...(fullScreen && { paddingBottom: "104px" }),
            borderRadius: "24px",
            // backgroundColor: "#F8F9FB",
            border: "1px solid #D9D9D9",
          },
        }}
      >
        <div
          onTouchStart={() => setDraggable(true)}
          onTouchEnd={() => setDraggable(false)}
          className="flex flex-row items-center justify-between px-6 pb-0 pt-[18px] md:pt-[26px]"
        >
          <DialogTitle sx={{ p: 0 }} component="h1">
            <span className="text-base font-medium leading-5 text-grey md:text-xl md:leading-6">
              پلن اقساطی
            </span>
          </DialogTitle>
          <IconButton onClick={handleCancelAndClose}>
            <Image
              src="/icons/icon-close.svg"
              alt="Close"
              width={24}
              height={24}
              className="h-[18px] w-[18px] md:h-6 md:w-6"
            />
          </IconButton>
        </div>
        <DialogContent
          sx={{
            p: fullScreen ? "16px" : "52px 32px 32px",
            overflowY: "visible",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {fetchError && (
            <div className="flex w-full flex-col items-center justify-center gap-2">
              <p>دریافت لیست شرایط اقساطی شما با مشکل مواجه شد!</p>
              <button
                type="button"
                className="rounded-lg border border-blue p-3 text-blue"
                onClick={handleGetMyInstallmentPlans}
              >
                تلاش مجدد
              </button>
            </div>
          )}
          {fetchLoading && <InstallmentPlanSkeleton />}
          {!fetchError && !fetchLoading && (
            <>
              <div className="flex w-full flex-row items-center justify-between">
                <p className="text-base font-medium text-grey">لیست اقساط</p>
                <AddInstallmentPlanModal
                  onSuccess={() => handleGetMyInstallmentPlans()}
                />
              </div>
              <Controller
                control={control}
                name="loanId"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    name="loanId"
                    value={value}
                    onChange={(event, value) => {
                      onChange(event, value);
                    }}
                    sx={{
                      width: "100%",
                      gap: "16px",
                    }}
                  >
                    {installmentPlans.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          onChange(item._id);
                        }}
                        className="flex w-full flex-col items-center gap-3 rounded-lg bg-neutral px-3 py-4"
                      >
                        <div className="flex w-full flex-row items-center justify-between">
                          <div className="flex flex-row items-center justify-start gap-1">
                            <Radio
                              checked={value === item._id}
                              value={item._id}
                              sx={{
                                mr: "-9px",
                                ...(!!errors.loanId && {
                                  color: "#f44336 !important",
                                }),
                              }}
                            />
                            <h3 className="text-sm font-medium leading-normal text-grey">
                              {"شرایط قسط " + (index + 1)}
                            </h3>
                          </div>
                          <div className="flex h-6 w-[68px] items-center justify-center rounded-xl bg-biege px-3 py-[2px]">
                            <p className="text-[10px] font-medium leading-normal text-brown">
                              {persianNumber(item.profitPercent) + "٪ سود"}
                            </p>
                          </div>
                        </div>
                        <div className="flex w-full flex-row items-center justify-between">
                          <h3 className="text-xs font-normal text-grey">
                            حداقل/حداکثر دوره بازپرداخت
                          </h3>
                          <p className="text-sm font-medium text-grey">
                            {persianNumber(item.minimumMonth) +
                              " ماهه/ " +
                              persianNumber(item.maximumMonth) +
                              " ماهه"}
                          </p>
                        </div>
                        <HorizontalLine />
                        <div className="flex w-full flex-row items-center justify-between">
                          <h3 className="text-sm font-normal text-grey">
                            پیش پرداخت
                          </h3>
                          <p className="text-sm font-medium text-grey">
                            {"حداقل " + persianNumber(item.preFound) + " درصد"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </RadioGroup>
                )}
              />
            </>
          )}
        </DialogContent>
        <div className="hidden w-full p-8 md:flex">
          <button
            type="button"
            disabled={fetchLoading || !loanIdWatcher}
            className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold text-white disabled:bg-grey-400"
            onClick={handleClose}
          >
            {fetchLoading ? <Spinner /> : "تایید"}
          </button>
        </div>
        <div className="fixed bottom-0 z-10 flex h-20 w-full items-center justify-center gap-4 border-t border-grey-200 bg-white p-4 md:hidden">
          <button
            type="button"
            disabled={fetchLoading || !loanIdWatcher}
            onClick={handleClose}
            className="flex w-full items-center justify-center rounded-md bg-grey p-3 text-[17px] font-bold leading-6 text-white disabled:bg-grey-400"
          >
            {fetchLoading ? <Spinner /> : "تایید"}
          </button>
        </div>
      </Dialog>
    </>
  );
}

function HorizontalLine() {
  return <div className="w-full border-b border-grey-200" />;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
