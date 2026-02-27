"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { EASE_EXPO } from "@/lib/motion"

// ─── Data ─────────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Work",     href: "/work"     },
  { label: "About",    href: "#about"    },
  { label: "Services", href: "/services" },
  { label: "Book",     href: "/booking"  },
]

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com/kamaltheicon" },
  { label: "TikTok",    href: "https://tiktok.com/@kamaltheicon"   },
  { label: "Twitter/X", href: "https://x.com/kamaltheicon"         },
]

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ backgroundColor: "#0A0A0A" }}>
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-10 md:pb-12">

        {/* ── Main grid ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-16 md:gap-12 pb-16 md:pb-20">

          {/* Left — brand + description ───────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, ease: EASE_EXPO }}
          >
            <Link href="/" className="inline-block mb-6">
              <span
                className="text-white font-light tracking-[-0.03em]"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}
              >
                KamalTheIcon
              </span>
            </Link>
            <p className="text-white/40 text-[13px] font-light leading-[1.9] max-w-[280px]">
              If you have any questions or want to discuss a creative project,
              feel free to get in touch — we&apos;d love to hear from you.
            </p>
          </motion.div>

          {/* Centre — inquiries + nav ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE_EXPO }}
            className="flex flex-col gap-10"
          >
            {/* Inquiries */}
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase text-white/30 mb-4">
                General Inquiries
              </p>
              <a
                href="mailto:hello@kamaltheicon.com"
                className="text-white/60 text-[14px] font-light hover:text-white transition-colors duration-200"
              >
                hello@kamaltheicon.com
              </a>
            </div>

            {/* Nav links */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-8% 0px" }}
                    transition={{ duration: 0.5, delay: 0.15 + i * 0.06, ease: EASE_EXPO }}
                  >
                    <Link
                      href={link.href}
                      className="text-white/50 text-[14px] font-light hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Right — social ───────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.7, delay: 0.16, ease: EASE_EXPO }}
          >
            <ul className="flex flex-col gap-3">
              {SOCIAL_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.06, ease: EASE_EXPO }}
                >
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/50 text-[14px] font-light hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/25 text-[11px] tracking-[0.08em]">
            © {year} KamalTheIcon. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/terms"
              className="text-white/25 text-[11px] tracking-[0.08em] hover:text-white/50 transition-colors duration-200"
            >
              Terms of Use
            </Link>
            <Link
              href="/privacy"
              className="text-white/25 text-[11px] tracking-[0.08em] hover:text-white/50 transition-colors duration-200"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
