"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface NavLink {
  label: string;
  href: string;
}

interface MobileMenuProps {
  links: NavLink[];
  onClose: () => void;
}

// ─── Easing ───────────────────────────────────────────────────────────────────
// Strong deceleration — feels like each word lands with weight, not a float
const EASE_LAND  = [0.22, 1, 0.36, 1]  as const;  // primary: text reveals
const EASE_PANEL = [0.16, 1, 0.3,  1]  as const;  // panel slide

// ─── Animation config ─────────────────────────────────────────────────────────
const PANEL_DURATION  = 0.75;   // how long the panel takes to slide in
const REVEAL_DURATION = 0.90;   // how long each link takes to wipe up
const REVEAL_START    = 0.22;   // delay before first link starts (after panel begins)
const STAGGER         = 0.12;   // extra delay between each link
const FOOTER_DELAY    = 0.80;   // when the contact block fades in

export default function MobileMenu({ links, onClose }: MobileMenuProps) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* ── Backdrop — desktop blur, click to close ───────────────────────── */}
      <motion.div
        className="hidden md:block flex-1 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        onClick={onClose}
        style={{
          backdropFilter:       "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          backgroundColor:      "rgba(0, 0, 0, 0.25)",
        }}
      />

      {/* ── Panel — 30% desktop / full mobile ───────────────────────────────── */}
      <motion.div
        className="
          relative flex flex-col justify-between
          w-full md:w-[30%]
          bg-[#0A0A0A]
          px-8 md:px-10
          pt-24 pb-12
          overflow-y-auto
        "
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "100%" }}
        transition={{ duration: PANEL_DURATION, ease: EASE_PANEL }}
      >
        {/* ── Links ──────────────────────────────────────────────────────────── */}
        <nav aria-label="Menu navigation">
          <ul className="flex flex-col">
            {links.map((link, i) => (
              <li
                key={link.href}
                className="overflow-hidden border-b border-white/[0.06]"
              >
                {/*
                 * Each link starts fully below the clip boundary (y: 115%)
                 * and eases up into place. The delay grows with each item
                 * so you clearly see each word arrive one after the other.
                 */}
                <motion.div
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  exit={{
                    y: "115%",
                    transition: {
                      duration: 0.3,
                      // reverse stagger on exit — last item leaves first
                      delay: (links.length - 1 - i) * 0.04,
                      ease: "easeIn",
                    },
                  }}
                  transition={{
                    duration: REVEAL_DURATION,
                    delay:    REVEAL_START + i * STAGGER,
                    ease:     EASE_LAND,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="
                      group flex items-baseline gap-3
                      py-5
                      text-[clamp(2rem,4.5vw,3rem)]
                      font-light tracking-tight leading-none
                      text-white/75
                      hover:text-white
                      transition-colors duration-300
                    "
                  >
                    {/* Tiny index — adds editorial depth */}
                    <span className="
                      text-[11px] tracking-widest text-white/20
                      group-hover:text-white/40
                      transition-colors duration-300
                      self-center
                      hidden md:inline
                    ">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {link.label}
                  </Link>
                </motion.div>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Contact footer ──────────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col gap-3 mt-12"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ delay: FOOTER_DELAY, duration: 0.5, ease: "easeOut" }}
        >
          <a
            href="mailto:hello@kamaltheicon.com"
            className="text-white/25 text-[11px] tracking-[0.2em] uppercase hover:text-white/60 transition-colors duration-200"
          >
            hello@kamaltheicon.com
          </a>
          <a
            href="https://instagram.com/kamaltheicon"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/25 text-[11px] tracking-[0.2em] uppercase hover:text-white/60 transition-colors duration-200"
          >
            @kamaltheicon
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
