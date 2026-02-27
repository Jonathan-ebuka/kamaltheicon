"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useScrolled } from "@/hooks/useScrolled";
import { cn } from "@/lib/utils";
import MobileMenu from "./MobileMenu";

// Pages whose first section is always dark (#0A0A0A).
// Nav text should be white/light when unscrolled on these pages.
// Any page NOT listed here is treated as having a light header.
// Only pages whose FIRST visible section is hardcoded #0A0A0A (always dark,
// regardless of theme). /services starts with var(--color-bg) so it is NOT here.
const DARK_HERO_PAGES = ["/", "/booking"];

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Work",     href: "#work"     },
  { label: "About",    href: "#about"    },
  { label: "Services", href: "/services"  },
  { label: "Book",     href: "/booking"  },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2"    x2="12" y2="5.5"  />
      <line x1="12" y1="18.5" x2="12" y2="22"   />
      <line x1="2"  y1="12"   x2="5.5" y2="12"  />
      <line x1="18.5" y1="12" x2="22" y2="12"   />
      <line x1="4.93" y1="4.93"   x2="7.17" y2="7.17"   />
      <line x1="16.83" y1="16.83" x2="19.07" y2="19.07" />
      <line x1="16.83" y1="7.17"  x2="19.07" y2="4.93"  />
      <line x1="4.93"  y1="19.07" x2="7.17"  y2="16.83" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
    </svg>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render the icon client-side to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn(
        "w-9 h-9 flex items-center justify-center",
        "hover:opacity-50 transition-opacity duration-200",
        className
      )}
    >
      {/* Reserve space before mount so layout doesn't shift */}
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -30, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0,   scale: 1   }}
            exit={{    opacity: 0, rotate:  30, scale: 0.6 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        </AnimatePresence>
      ) : (
        // Invisible placeholder — same size, no icon, prevents layout shift
        <span className="w-4 h-4" />
      )}
    </button>
  );
}

function Hamburger({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className={cn("relative w-9 h-9 flex items-center justify-center", className)}
    >
      <motion.span
        className="absolute block bg-current"
        style={{ width: 20, height: 1.5, borderRadius: 2 }}
        animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -5 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
      <motion.span
        className="absolute block bg-current"
        style={{ width: 20, height: 1.5, borderRadius: 2 }}
        animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 5 }}
        transition={{ duration: 0.22, ease: "easeInOut" }}
      />
    </button>
  );
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

export default function Nav() {
  const scrolled  = useScrolled(80);
  const pathname  = usePathname();
  const { resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const isDark      = resolvedTheme === "dark";
  const forceWhite  = menuOpen;
  const hasDarkHero = DARK_HERO_PAGES.includes(pathname);

  // Dark mode       → always light text (glass + all heroes are dark)
  // Light mode
  //   scrolled      → dark text on light glass
  //   not scrolled
  //     dark hero   → white text (contrast against #0A0A0A section)
  //     light hero  → dark text (contrast against cream/white section)
  const textColor = cn(
    "transition-colors duration-300",
    forceWhite
      ? "text-white"
      : isDark
        ? "text-[#EDECE8]"
        : scrolled
          ? "text-[#111111]"
          : hasDarkHero
            ? "text-white"
            : "text-[#111111]"
  );

  return (
    <>
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-[76px]">

        {/* Glass background — fades in on scroll, disappears when menu opens */}
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: scrolled && !menuOpen ? 1 : 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          style={{
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            // Slightly elevated from pure black in dark mode so the nav
            // is visually distinct from the #0A0A0A page background
            backgroundColor: isDark
              ? "rgba(18,18,18,0.94)"
              : "rgba(248,247,244,0.94)",
            borderBottom: `1px solid ${
              isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)"
            }`,
            boxShadow: isDark
              ? "0 8px 40px rgba(0,0,0,0.55)"
              : "0 4px 24px rgba(0,0,0,0.07)",
          }}
        />

        <div className="relative z-10 h-full max-w-[1440px] mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className={cn("text-[15px] font-medium tracking-tight select-none", textColor)}
          >
            KamalTheIcon
          </Link>

          {/* Toggle + Hamburger — side by side, no gap */}
          <div className="flex items-center">
            <ThemeToggle className={textColor} />
            <Hamburger
              open={menuOpen}
              onToggle={() => setMenuOpen((v) => !v)}
              className={textColor}
            />
          </div>
        </div>
      </header>

      {/* ── Overlay menu ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            links={NAV_LINKS}
            onClose={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
