import Link from "next/link";
import HighestBidMenu from "./HighestBidMenu";
import SimCardMenu from "./SimCardMenu";
import SimPackMenu from "./SimPackMenu";
import Image from "next/image";
import UserButton from "./UserButton";
import AdRegistrationDialog from "../cards/AdRegistrationDialog";
import PriceAndRoundAnalysisDialog from "../cards/PriceAndRoundAnalysisDialog";

export default function DesktopHeader() {
  return (
    <nav className="flex h-14 w-full max-w-7xl flex-row items-center justify-between py-6 md:h-24">
      <ul className="flex w-full flex-row items-center justify-start gap-8 text-lg font-normal text-white">
        <li>
          <Link href="/" className="text-2xl font-extrabold text-secondary">
            <Image src="/logo.svg" alt="RoboRond" width={55} height={38} />
          </Link>
        </li>
        <VerticalLine />
        <li>
          <SimCardMenu />
        </li>
        <li>
          <SimPackMenu />
        </li>
        <li>
          <HighestBidMenu />
        </li>
        <li>
          <Link href="/search?searchType=simKhast">سیم خواست</Link>
        </li>
        <li>
          <PriceAndRoundAnalysisDialog type="button" />
        </li>
      </ul>
      <div className="flex w-fit flex-row items-center justify-center gap-4">
        <AdRegistrationDialog type="button" />
        <UserButton />
      </div>
    </nav>
  );
}

function VerticalLine() {
  return <div className="h-[32px] w-[0.5px] bg-grey-500" />;
}
