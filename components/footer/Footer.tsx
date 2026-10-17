import DesktopFooter from "./DesktopFooter";
import MobileFooter from "./MobileFooter";

export default function Footer({
  selectedMenu = "",
}: {
  selectedMenu?: string;
}) {
  return (
    <footer className="absolute bottom-0 flex w-full md:static">
      <div className="flex h-[68px] w-full items-center justify-center bg-grey px-4 py-2 text-[10px] font-normal text-biege md:hidden">
        <MobileFooter selectedMenu={selectedMenu} />
      </div>
      <div className="hidden w-full items-center justify-center bg-grey-900 p-[80px] pb-[40px] text-lg font-normal text-white md:flex">
        <DesktopFooter />
      </div>
    </footer>
  );
}
