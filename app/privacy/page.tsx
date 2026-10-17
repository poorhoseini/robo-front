import Footer from "@/components/footer/Footer";
import Space from "@/components/general/Space";
import Header from "@/components/header/Header";
import { privacy } from "@/lib/constants/privacy";

export default function PrivacyPage() {
  return (
    <div className="relative flex h-[100dvh] min-h-[100dvh] flex-col items-center bg-neutral lg:h-full">
      <Header selectedMenu="privacy" />

      <main className="mb-[68px] w-full max-w-7xl overflow-y-auto px-6 py-9 md:mb-0 md:overflow-y-visible md:px-20 md:py-14">
        <h1 className="text-2xl font-medium leading-6 text-grey md:text-[32px]">
          {privacy.title}
        </h1>
        <Space value={24} />
        <ul className="text-base font-normal leading-7 text-grey md:text-2xl md:leading-[38px]">
          {privacy.body.map((item, index) => (
            <li key={index} className="mb-3">{item}</li>
          ))}
        </ul>
      </main>
      <Footer selectedMenu="privacy" />
    </div>
  );
}
