"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  speed: 400,
  minimum: 0.1,
  easing: "ease",
});

/**
 * TopProgressBar - Shows a thin progress bar at the top of the page
 * during client-side navigation in Next.js App Router.
 */
export default function TopProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loadingUrl = useRef<string | null>(null);
  const currentPath = useRef(pathname);

  // Detect route completion (pathname or searchParams changed after navigation started)
  useEffect(() => {
    if (loadingUrl.current) {
      NProgress.done();
      loadingUrl.current = null;
    }
    currentPath.current = pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    /**
     * Intercept clicks on <a> tags used by Next.js for client-side navigation.
     * When an internal link is clicked, start the progress bar.
     */
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Skip external links, hash links, mailto, tel, etc.
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      // Skip if target _blank
      if (anchor.target === "_blank") return;

      // Skip if modifier keys are pressed (ctrl, shift, meta, alt)
      if (e.ctrlKey || e.shiftKey || e.metaKey || e.altKey) return;

      // Determine the resolved URL
      let targetPath: string;
      if (href.startsWith("?")) {
        // Query-only navigation (e.g., ?page=2)
        targetPath = currentPath.current;
      } else if (href.startsWith("/")) {
        targetPath = href.split("?")[0];
      } else {
        return;
      }

      // Only start progress if navigating to a different page
      if (targetPath === currentPath.current && !href.startsWith("?")) return;

      loadingUrl.current = href;
      NProgress.start();
    };

    document.addEventListener("click", handleClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
      NProgress.done();
    };
  }, []);

  return null;
}
