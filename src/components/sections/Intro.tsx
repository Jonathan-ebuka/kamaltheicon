"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const EASE_LAND = [0.22, 1, 0.36, 1] as const;

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  // Trigger when just 10 % of the section enters the viewport
  const inView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      id="intro"
      className="w-full min-h-screen flex items-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">

          {/* ── Left — cinematic heading + subtext ─────────────────────────── */}
          <div>
            <h2>
              {/* Line 1 */}
              <div className="overflow-hidden">
                <motion.span
                  className="block font-light leading-[0.92] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3.5rem, 9.5vw, 10rem)", color: "var(--color-ink)" }}
                  initial={{ y: "108%" }}
                  animate={{ y: inView ? "0%" : "108%" }}
                  transition={{ duration: 1.05, delay: 0.05, ease: EASE_LAND }}
                >
                  Capturing
                </motion.span>
              </div>

              {/* Line 2 — italic */}
              <div className="overflow-hidden">
                <motion.span
                  className="block font-light italic leading-[0.92] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3.5rem, 9.5vw, 10rem)", color: "var(--color-ink)" }}
                  initial={{ y: "108%" }}
                  animate={{ y: inView ? "0%" : "108%" }}
                  transition={{ duration: 1.05, delay: 0.22, ease: EASE_LAND }}
                >
                  Life At Its
                </motion.span>
              </div>

              {/* Line 3 */}
              <div className="overflow-hidden">
                <motion.span
                  className="block font-light leading-[0.92] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3.5rem, 9.5vw, 10rem)", color: "var(--color-ink)" }}
                  initial={{ y: "108%" }}
                  animate={{ y: inView ? "0%" : "108%" }}
                  transition={{ duration: 1.05, delay: 0.38, ease: EASE_LAND }}
                >
                  Most Cinematic.
                </motion.span>
              </div>
            </h2>

            {/* Subtext */}
            <motion.p
              className="mt-10 text-[15px] font-light leading-[1.75] max-w-sm"
              style={{ color: "var(--color-muted)" }}
              initial={{ opacity: 0, y: 22 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 }}
              transition={{ duration: 0.9, delay: 0.58, ease: "easeOut" }}
            >
              I work with individuals and brands who understand
              that great photography isn&apos;t documentation —
              it&apos;s storytelling at the highest level.
            </motion.p>
          </div>

          {/* ── Right — portrait ─────────────────────────────────────────── */}
          <motion.div
            className="relative w-full aspect-3/4 overflow-hidden"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 1.2, delay: 0.18, ease: EASE_LAND }}
          >
            <Image
              src="/private%20sessions/She%20bad1.jpg"
              fill
              className="object-cover"
              alt="Kamal — lifestyle photographer"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
