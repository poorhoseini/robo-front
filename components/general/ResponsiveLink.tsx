import Link from "next/link";
import { ReactNode } from "react";

type ResponsiveLinkProps = {
  href: string;
  children: ReactNode;
  display?: string;
  mdDisplay?: string;
  className?: string;
  otherProps?: any;
};

export default function ResponsiveLink({
  href,
  children,
  display = "flex",
  mdDisplay = "md:flex",
  className,
  ...otherProps
}: ResponsiveLinkProps) {
  return (
    <>
      <Link
        href={href}
        className={`${display} md:hidden ${className}`}
        {...otherProps}
      >
        {children}
      </Link>
      <Link
        href={href}
        className={`hidden ${mdDisplay} ${className}`}
        {...otherProps}
      >
        {children}
      </Link>
    </>
  );
}
