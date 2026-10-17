import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import { useMediaQuery, useTheme } from "@mui/material";
import Image from "next/image";

export default function CustomStepper({
  step,
  title,
  stepperItems,
}: {
  step: number;
  title: string;
  stepperItems: Array<{ title: string; subTitles: string[] }>;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  if (fullScreen)
    return (
      <div className="flex w-full flex-row items-center justify-center gap-2">
        {stepperItems.map((stepperItem, index) => (
          <div
            key={index}
            className={`h-[10px] w-full rounded-lg ${index < step ? "bg-blue" : "bg-blue-700"}`}
          />
        ))}
      </div>
    );

  return (
    <div className="flex h-[80vh] min-h-[80vh] w-[290px] min-w-[290px] flex-col items-center gap-4 rounded-lg border border-grey-200 bg-white p-6">
      <h1 className="text-lg font-semibold text-grey">{title}</h1>
      <HorizontalLine />
      <div className="mr-10 flex w-full flex-col items-start gap-3">
        {stepperItems.map((stepperItem, index) => (
          <div
            key={index}
            className={`relative flex w-full flex-col items-start gap-3 border-r-2 ${step >= index + 1 ? "border-blue" : "border-grey-400"} pr-10`}
          >
            <div className="absolute -right-[21px] -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${step === index + 1 ? "border-blue" : step > index + 1 ? "border-blue bg-blue" : "border-grey-400"}`}
              >
                {step > index + 1 ? (
                  <Image
                    src="/icons/icon-check.svg"
                    alt=""
                    width={25}
                    height={24}
                  />
                ) : (
                  <p className="text-sm font-medium leading-normal text-grey">
                    {persianNumber(index + 1)}
                  </p>
                )}
              </div>
            </div>
            <h2 className="text-base font-medium text-grey">
              {stepperItem.title}
            </h2>
            {!!stepperItem.subTitles.length && (
              <div className="flex w-full flex-col items-start gap-4">
                {stepperItem.subTitles.map((subTitle, index) => (
                  <p key={index} className="text-sm font-normal text-grey-700">
                    {subTitle}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-300" />;
}
