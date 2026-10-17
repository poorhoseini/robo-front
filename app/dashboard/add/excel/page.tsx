import AddExcelStepContent from "@/components/forms/dashboard/AddExcelStepContent";
import AddExcelStepperSection from "@/components/forms/dashboard/AddExcelStepperSection";
import Header from "@/components/header/Header";
import getProvinces from "@/lib/api/getProvinces";
import { GetProvincesResponseProps } from "@/lib/entities/province";

export default async function ExcelPage() {
  const getProvincesResponse: GetProvincesResponseProps = await getProvinces();
  const provincesList = getProvincesResponse?.data?.provinces || [];

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] flex-col items-center gap-6 bg-neutral md:h-full md:gap-8">
      <Header selectedMenu="addExcel" />
      <main className="flex w-full max-w-7xl flex-col items-start gap-6 overflow-y-auto px-6 pb-[108px] md:mb-0 md:flex-row md:justify-between md:overflow-y-visible md:px-0 md:pb-[68px]">
        <AddExcelStepperSection />
        <AddExcelStepContent service="simcard" provincesList={provincesList} />
      </main>
    </div>
  );
}
