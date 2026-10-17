import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import SingleOperationsPageLayout from "@/components/dashboard/SingleOperationsPageLayout";

export default function MySimPackPage({ params }: { params: { id: string } }) {
  let refetchTrigger = [];
  refetchTrigger.push(params.id);

  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] flex-col items-center gap-8 bg-white md:bg-neutral lg:h-full">
      <div className="hidden w-full md:block">
        <Header />
      </div>
      <main className="flex min-h-screen w-full max-w-7xl flex-col gap-12 overflow-y-auto pb-[104px] md:overflow-y-visible md:pb-0">
        <SingleOperationsPageLayout
          id={params.id}
          serviceType="simPack"
          refetchTrigger={refetchTrigger}
        />
      </main>
      <div className="hidden w-full md:block">
        <Footer selectedMenu="packageDetail" />
      </div>
    </div>
  );
}
