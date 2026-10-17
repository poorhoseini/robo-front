import { Fragment } from "react";

type LoanBoxProps = {
  rondLevelsFa: string[];
};

export default function RoundListBox({ rondLevelsFa }: LoanBoxProps) {
  return (
    <div className="hidden w-full flex-col items-start gap-3 rounded-lg bg-neutral p-4 text-sm font-normal text-grey md:flex">
      <h3 className="mb-4">انواع رندی</h3>
      {rondLevelsFa?.map((item, index) => (
        <Fragment key={index}>
          <p>{item}</p>
          {index !== rondLevelsFa.length - 1 && <HorizontalLine />}
        </Fragment>
      ))}
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-100" />;
}
