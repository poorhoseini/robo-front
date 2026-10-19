import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Space from "@/components/general/Space";
import ChannelMessagesResultSection from "@/components/dashboard/ChannelMessagesResultSection";

export default async function MyMessagesPage({
  searchParams,
}: {
  searchParams?: {
    id?: string;
  };
}) {
  const selectedChannelId = searchParams?.id || "";

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header />
      <main className="flex w-full max-w-7xl flex-col gap-6 pb-24 md:pb-0">
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>
          <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
            <ChannelMessagesResultSection
              initialChannelId={selectedChannelId}
            />
            <Space value={36} />
          </div>
        </div>
      </main>
      <Footer selectedMenu="dashboard" />
    </div>
  );
}
