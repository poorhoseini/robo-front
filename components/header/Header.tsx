import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

export default function Header({
  selectedMenu = "",
}: {
  selectedMenu?: string;
}) {
  return (
    <header className="flex w-full">
      <div className="flex h-full w-full items-center justify-center bg-white md:hidden">
        <MobileHeader selectedMenu={selectedMenu} />
      </div>
      <div className="hidden h-full w-full bg-primary md:flex md:items-center md:justify-center">
        <DesktopHeader />
      </div>
    </header>
  );
}
