import AddSimPackStepContent from "@/components/forms/dashboard/AddSimPackStepContent";
import AddSimPackStepperSection from "@/components/forms/dashboard/AddSimPackStepperSection";
import Header from "@/components/header/Header";
import getProvinces from "@/lib/api/getProvinces";
import { GetProvincesResponseProps } from "@/lib/entities/province";

export default async function AddSimPackPage() {
  const getProvincesResponse: GetProvincesResponseProps = await getProvinces();
  const provincesList = getProvincesResponse?.data?.provinces || [];

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] w-full flex-col items-center gap-6 bg-neutral md:h-full md:gap-8">
      <Header selectedMenu="addSimPack" />
      <main className="flex w-full max-w-7xl flex-col items-start gap-6 overflow-y-auto px-6 pb-[108px] md:flex-row md:justify-between md:overflow-y-visible md:px-0 md:pb-0">
        <AddSimPackStepperSection />
        <AddSimPackStepContent
          service="simPack"
          provincesList={provincesList}
        />
      </main>
    </div>
  );
}
