import Image from "next/image";
import Link from "next/link";
import AdRegistrationDialog from "../cards/AdRegistrationDialog";

export default function MobileFooter({
  selectedMenu,
}: {
  selectedMenu: string;
}) {
  return (
    <div className="flex h-full w-full flex-row items-center justify-between">
      <Link href="/" className="flex flex-col items-center gap-1">
        <Image
          src={
            selectedMenu === "home"
              ? "/icons/icon-home-active.svg"
              : "/icons/icon-home.svg"
          }
          alt="Home Page"
          width={24}
          height={24}
        />
        <p>خانه</p>
      </Link>
      <Link href="/services" className="flex flex-col items-center gap-1">
        <Image
          src={
            selectedMenu === "services"
              ? "/icons/icon-squares-active.svg"
              : "/icons/icon-squares.svg"
          }
          alt="Home Page"
          width={24}
          height={24}
        />
        <p>سرویس ها</p>
      </Link>
      <AdRegistrationDialog type="button" />
      <Link href="/analyze" className="flex flex-col items-center gap-1">
        <Image
          src={
            selectedMenu === "analyze"
              ? "/icons/icon-graph.svg"
              : "/icons/icon-graph.svg"
          }
          alt="Analyze Page"
          width={24}
          height={24}
        />
        <p>آنالیز و تخمین</p>
      </Link>
      <Link href="/search" className="flex flex-col items-center gap-1">
        <Image
          src={
            selectedMenu === "search"
              ? "/icons/icon-magnifier-active.svg"
              : "/icons/icon-magnifier.svg"
          }
          alt="Search Page"
          width={24}
          height={24}
        />
        <p>جستجو</p>
      </Link>
    </div>
  );
}
