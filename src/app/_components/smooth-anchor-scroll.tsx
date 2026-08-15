"use client";

import { useEffect } from "react";

const resetDelay = 1500;

export function SmoothAnchorScroll() {
  useEffect(() => {
    let resetTimer: number | undefined;
    const root = document.documentElement;
    const reset = () => {
      window.removeEventListener("scrollend", reset);
      root.style.removeProperty("scroll-behavior");
      if (resetTimer) window.clearTimeout(resetTimer);
      resetTimer = undefined;
    };
    const handleClick = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      ) {
        return;
      }

      const link = event.target.closest("a[href]");
      if (
        !(link instanceof HTMLAnchorElement) ||
        link.download ||
        (link.target && link.target !== "_self")
      ) {
        return;
      }

      const destination = new URL(link.href);
      if (
        destination.origin !== location.origin ||
        destination.pathname !== location.pathname ||
        destination.search !== location.search ||
        !destination.hash ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      reset();
      root.style.scrollBehavior = "smooth";
      window.addEventListener("scrollend", reset, { once: true });
      resetTimer = window.setTimeout(reset, resetDelay);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("scrollend", reset);
      reset();
    };
  }, []);

  return null;
}
