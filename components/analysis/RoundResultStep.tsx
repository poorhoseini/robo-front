import { persianNumber } from "@/lib/helpers/persianNumber.helper";
import {
  useAnalysisActions,
  useCode,
  useDigit10,
  useDigit11,
  useDigit6,
  useDigit7,
  useDigit8,
  useDigit9,
  usePreNumber,
  useRoundData,
  useRoundTypesList,
} from "@/lib/zustand/analysis";
import Space from "../general/Space";
import CustomButton from "../general/CustomButton";

export default function RoundResultStep() {
  const roundTypesList = useRoundTypesList();
  const simCardRoundTypes = useRoundData();
  const preNumber = usePreNumber();
  const code = useCode();
  const digit6 = useDigit6();
  const digit7 = useDigit7();
  const digit8 = useDigit8();
  const digit9 = useDigit9();
  const digit10 = useDigit10();
  const digit11 = useDigit11();
  const { setStep, setAnalysisType } = useAnalysisActions();

  const phoneNumber =
    "09" +
    preNumber +
    code +
    digit6 +
    digit7 +
    digit8 +
    digit9 +
    digit10 +
    digit11;

  return (
    <div className="flex h-full w-full flex-col items-center">
      <div className="flex w-full items-center justify-center rounded-xl bg-grey p-6 text-3xl font-medium leading-8 text-white">
        {persianNumber(phoneNumber)}
      </div>
      <Space value={32} />
      <div className="flex w-full flex-col items-center rounded-xl bg-white p-6">
        <div className="flex w-full flex-row items-center justify-between">
          <p className="text-base font-medium text-grey">مشاهده نوع رندی</p>
          <div className="flex h-9 w-[124px] flex-row items-center justify-center gap-2 rounded-lg bg-biege">
            <p className="text-sm font-medium text-brown">تعداد رندی</p>
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <p className="text-xs font-normal leading-normal text-brown">
                {persianNumber(simCardRoundTypes?.rondData.length || 0)}
              </p>
            </div>
          </div>
        </div>
        <Space value={24} />
        <div className="flex w-full flex-col items-center">
          {simCardRoundTypes?.rondData.map((item, index) => (
            <div key={index} className="flex w-full flex-col items-center">
              <div className="flex w-full flex-row items-start justify-between">
                <div className="flex flex-row items-start gap-1">
                  <div className="flex h-4 w-4 items-center justify-center rounded-full bg-biege text-[10px] font-normal leading-normal text-orange">
                    {persianNumber(index + 1)}
                  </div>
                  <div className="flex flex-col items-start gap-1">
                    <p className="text-sm font-normal text-grey">
                      {item.rondLevelFa}
                    </p>
                    <p className="text-xs font-normal text-grey-700">
                      {
                        roundTypesList.find(
                          (roundType) => roundType.rondLevel === item.rondLevel,
                        )?.desc
                      }
                    </p>
                  </div>
                </div>
                <p className="ltr text-sm font-medium text-grey">
                  {persianNumber(item.spell.join("   "))}
                </p>
              </div>
              <Space value={12} />
              {index + 1 < simCardRoundTypes?.rondData.length && (
                <>
                  <HorizontalLine />
                  <Space value={16} />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <Space value={32} />
      <div className="flex w-full flex-col items-center rounded-xl bg-biege-300 p-6">
        <div className="flex w-full flex-row items-center justify-between gap-8">
          <p className="text-lg font-medium leading-6 text-grey">
            هوش مصنوعی روبورند اولین و دقیق ترین ابزار هوشمند تخمین قیمت سیم
            کارت می‌باشد که قیمت سیم کارت شما را تخمین می‌زند.
          </p>
          <div className="w-full max-w-[227px]">
            <CustomButton
              label="قیمت گذاری هوش مصنوعی"
              loading={false}
              disabled={false}
              handleSubmit={() => {
                setAnalysisType("ai");
                setStep(3);
              }}
            />
          </div>
        </div>
        <Space value={32} />
        <div className="flex w-full flex-row items-center justify-between gap-8">
          <p className="text-lg font-medium leading-6 text-grey">
            کارشناسان ما در کمتر از ۲۴ ساعت سیم کارت شما را به صورت دقیق قیمت
            گذاری می‌کنند. همچنین تخمین با هوش به صورت رایگان انجام خواهد شد.
          </p>
          <div className="w-full max-w-[227px]">
            <CustomButton
              label="قیمت گذاری دقیق"
              loading={false}
              disabled={false}
              handleSubmit={() => {
                setAnalysisType("expert");
                setStep(3);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function HorizontalLine() {
  return <div className="h-[1px] w-full border-b border-grey-200" />;
}
