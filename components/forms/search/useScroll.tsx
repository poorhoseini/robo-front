"use client";

import { useCallback, useEffect, useState } from "react";

export default function useScroll() {
  let oldScrollPosition = 0;
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState(0);
  const [scrollLimit, setScrollLimit] = useState(0);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const yPosition = window.scrollY;
    if (oldScrollPosition > yPosition) setScrollDirection(1);
    if (oldScrollPosition < yPosition) setScrollDirection(-1);

    setScrollLimit(
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight,
      ) - window.innerHeight,
    );
    setScrollPosition(yPosition);
    oldScrollPosition = yPosition;
  }, [scrollPosition]);

  return [scrollPosition, scrollLimit, scrollDirection];
}
