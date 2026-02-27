"use client"

import { useRef } from "react"
import Image from "next/image"
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion"

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    num: "01",
    title: "Private Sessions",
    desc: "Bespoke photography for individuals, couples and families who want imagery that authentically captures who they are.",
    tags: ["Portrait", "Lifestyle", "Editorial"],
    accent: "#161616",
    image: "/private%20sessions/Extra%20touch%20of%20finesse1.jpg",
  },
  {
    num: "02",
    title: "Events",
    desc: "Authentic documentary coverage of weddings, cultural celebrations, brand launches and every gathering worth remembering.",
    tags: ["Events", "Documentary", "Coverage"],
    accent: "#111111",
    image: "/event%20and%20milestone/celebrate%20me1.jpg",
  },
  {
    num: "03",
    title: "Milestones",
    desc: "Capturing life's defining chapters — graduations, proposals, new beginnings and every moment that marks who you are becoming.",
    tags: ["Milestones", "Lifestyle", "Moments"],
    accent: "#0D0D0D",
    image: "/event%20and%20milestone/birthday1.jpg",
  },
] as const

// ─── Single card ──────────────────────────────────────────────────────────────

/**
 * Each card sits in the same absolute container.
 * - Cards 1–3 slide up from y:"102%" over their scroll segment
 * - Cards 0–2 compress slightly (scale 1→0.94) as the next card covers them
 * - z-index increases so higher-indexed cards always render on top
 */
function ServiceCard({
  service,
  index,
  total,
  scrollYProgress,
}: {
  service: (typeof SERVICES)[number]
  index: number
  total: number
  scrollYProgress: MotionValue<number>
}) {
  const count = total - 1 // number of swipe transitions

  // ── Entrance: slide up from below ────────────────────────────────────────
  // Card 0 is the base — always at y:0.
  // Each subsequent card enters during its dedicated scroll segment.
  const yIn = index === 0 ? [0, 1] : [(index - 1) / count, index / count]
  const yOut = index === 0 ? ["0%", "0%"] : ["102%", "0%"]
  const y = useTransform(scrollYProgress, yIn, yOut)

  // ── Compression: scale down as next card covers this one ─────────────────
  // Last card never compresses (nothing comes after it).
  const scIn =
    index >= total - 1 ? [0, 1] : [index / count, (index + 1) / count]
  const scOut = index >= total - 1 ? [1, 1] : [1, 0.94]
  const scale = useTransform(scrollYProgress, scIn, scOut)

  return (
    <motion.div
      className='absolute inset-0 flex flex-col md:flex-row will-change-transform'
      style={{
        y,
        scale,
        zIndex: index + 1,
        backgroundColor: service.accent,
      }}
    >
      {/* ── Left panel — service info ────────────────────────────────── */}
      <div
        className='
        relative z-10 flex flex-col justify-end
        w-full md:w-[42%]
        px-6 md:px-12
        pt-24 pb-10 md:pb-16
        bg-[#0A0A0A]
      '
      >
        {/* Top label — visible on desktop, anchors the panel visually */}
        <span
          className='
          absolute top-6 left-6 md:left-12
          text-[10px] tracking-[0.22em] uppercase text-white/20
        '
        >
          Services &nbsp;/&nbsp; {service.num}
        </span>

        {/* Hairline */}
        <div className='w-8 h-px bg-white/20 mb-6 md:mb-8' />

        {/* Number */}
        <span className='text-[11px] tracking-[0.2em] uppercase text-white/30 mb-3 md:mb-4'>
          {service.num}
        </span>

        {/* Title */}
        <h3
          className='font-light text-white leading-[0.92] tracking-[-0.03em] mb-5 md:mb-6'
          style={{ fontSize: "clamp(2rem, 3.8vw, 4.8rem)" }}
        >
          {service.title}
        </h3>

        {/* Description */}
        <p className='text-white/45 text-[13px] md:text-[14px] font-light leading-[1.8] mb-7 md:mb-8 max-w-xs'>
          {service.desc}
        </p>

        {/* Tags */}
        <div className='flex flex-wrap gap-2 md:gap-3'>
          {service.tags.map((tag) => (
            <span
              key={tag}
              className='text-[9px] md:text-[10px] tracking-[0.18em] uppercase text-white/30 border border-white/[0.08] px-2.5 py-1'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel — image placeholder ──────────────────────────── */}
      <div className='flex-1 relative overflow-hidden min-h-[40vh] md:min-h-0'>
        <Image
          src={service.image}
          fill
          className="object-cover"
          alt={service.title}
          priority={index === 0}
        />
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function Services() {
  // Ref on the card-stack container (not the section header).
  // height = N × 100vh → with offset ["start start","end end"]
  // → scrollYProgress [0,1] covers (N-1) × 100vh of scroll.
  // With 4 cards that's 3 × 100vh = 300vh of scroll, 100vh per transition.
  const stackRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ["start start", "end end"],
  })

  return (
    <section id='services'>
      {/* ── Section header — normal flow, scrolls away before stack pins ── */}
      <div
        className='w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-28 md:pt-36 pb-20 md:pb-28'
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          className='text-[11px] tracking-[0.2em] uppercase mb-6'
          style={{ color: "var(--color-muted)" }}
        >
          What We Offer
        </p>

        <h2
          className='font-light leading-[0.92] tracking-[-0.03em]'
          style={{
            fontSize: "clamp(2.5rem, 6vw, 7rem)",
            color: "var(--color-ink)",
          }}
        >
          Designed for those who value
          <br />
          <span className='italic'>exceptional imagery..</span>
        </h2>
      </div>

      {/* ── Card stack ────────────────────────────────────────────────────── */}
      {/*
       * Outer: SERVICES.length × 100vh — gives scroll room.
       * Inner: sticky 100vh — pins the visual while progress runs.
       * Each of the (N-1) transitions consumes exactly 100vh of scroll.
       */}
      <div ref={stackRef} style={{ height: `${SERVICES.length * 100}vh` }}>
        <div className='sticky top-0 h-screen w-full overflow-hidden'>
          {SERVICES.map((service, i) => (
            <ServiceCard
              key={service.num}
              service={service}
              index={i}
              total={SERVICES.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
