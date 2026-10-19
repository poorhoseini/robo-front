import DashboardMenu from "@/components/dashboard/DashboardMenu";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import Space from "@/components/general/Space";
import WalletBalanceSection from "@/components/dashboard/WalletBalanceSection";
import SettingTabsSection from "@/components/dashboard/SettingTabsSection";
import UserProfileFormSection from "@/components/dashboard/UserProfileFormSection";

export default async function MyAccountSettingsPage() {
  const tab = "my-account";

  return (
    <div className="relative flex h-full min-h-[100dvh] flex-col items-center bg-neutral md:gap-8">
      <Header />
      <main className="flex w-full max-w-7xl flex-col gap-6 pb-24 md:pb-0">
        <div className="flex w-full flex-col items-center gap-5 md:flex-row md:items-start">
          <div className="sticky top-20 hidden w-[320px] md:flex">
            <DashboardMenu />
          </div>
          <div className="relative hidden w-[938px] flex-col items-end justify-start md:flex">
            <SettingTabsSection selectedTab={tab} />
            <Space value={24} />
            <WalletBalanceSection />
            <Space value={24} />
            <UserProfileFormSection />
            <Space value={36} />
          </div>
        </div>
      </main>
      <Footer selectedMenu="dashboard" />
    </div>
  );
}
