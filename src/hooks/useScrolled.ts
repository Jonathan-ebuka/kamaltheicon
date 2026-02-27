"use client";

import { useState, useEffect } from "react";

/**
 * Returns `true` once the window has scrolled past `threshold` px.
 * Passive listener — zero layout-recalculation cost.
 */
export function useScrolled(threshold = 80): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run immediately in case the page loads mid-scroll

    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
