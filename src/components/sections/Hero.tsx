"use client"

import { useRef, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion"

const EASE_LAND = [0.22, 1, 0.36, 1] as const

// ─── Gallery configuration ────────────────────────────────────────────────────
// Each tile: absolute position (% relative to section), fixed px size,
// depth factor (higher = stronger mouse parallax), slight tilt

interface Tile {
  src:    string
  left:   string
  top:    string
  width:  number
  height: number
  depth:  number
  rotate: number
}

const GALLERY: Tile[] = [
  {
    src:    "/private%20sessions/His%20Favorite%20Debit1.jpg",
    left:   "2%",   top:  "-4%",
    width:  220,    height: 305,
    depth:  0.10,   rotate: -1.5,
  },
  {
    src:    "/event%20and%20milestone/navv1.jpg",
    left:   "37%",  top:  "-9%",
    width:  200,    height: 265,
    depth:  0.14,   rotate:  1.2,
  },
  {
    src:    "/private%20sessions/She%20bad2.jpg",
    left:   "75%",  top:   "3%",
    width:  185,    height: 250,
    depth:  0.08,   rotate: -0.8,
  },
  {
    src:    "/event%20and%20milestone/celebrate%20me2.jpg",
    left:   "-3%",  top:  "56%",
    width:  175,    height: 225,
    depth:  0.12,   rotate:  1.8,
  },
  {
    src:    "/private%20sessions/Extra%20touch%20of%20finesse2.jpg",
    left:   "24%",  top:  "68%",
    width:  215,    height: 150,
    depth:  0.10,   rotate: -1.0,
  },
  {
    src:    "/event%20and%20milestone/birthday2.jpg",
    left:   "61%",  top:  "58%",
    width:  235,    height: 295,
    depth:  0.16,   rotate:  0.5,
  },
  {
    src:    "/private%20sessions/His%20Favorite%20Debit2.jpg",
    left:   "88%",  top:  "20%",
    width:  200,    height: 360,
    depth:  0.08,   rotate: -1.2,
  },
  {
    src:    "/event%20and%20milestone/navv2.jpg",
    left:   "14%",  top:  "-5%",
    width:  165,    height: 210,
    depth:  0.12,   rotate:  0.8,
  },
]

// ─── Image tile ───────────────────────────────────────────────────────────────

function ImageTile({
  tile,
  mouseX,
  mouseY,
}: {
  tile:   Tile
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
}) {
  const tx = useTransform(mouseX, (v) => v * tile.depth)
  const ty = useTransform(mouseY, (v) => v * tile.depth)

  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{
        left:   tile.left,
        top:    tile.top,
        width:  tile.width,
        height: tile.height,
        rotate: tile.rotate,
        x: tx,
        y: ty,
      }}
    >
      <Image
        src={tile.src}
        fill
        className="object-cover"
        alt=""
        sizes="300px"
      />
    </motion.div>
  )
}

// ─── Animation helpers ────────────────────────────────────────────────────────

function LineReveal({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay:    number
  className?: string
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.0, delay, ease: EASE_LAND }}
      >
        {children}
      </motion.div>
    </div>
  )
}

function FadeUp({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay:    number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Hero() {
  const router       = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-driven parallax on text + blur on gallery
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const contentY  = useTransform(scrollYProgress, [0, 1], ["8vh", "-9vh"])
  // Blur doesn't start until halfway through the scroll — stays crisp at the top
  const bgFilter  = useTransform(scrollYProgress, [0, 0.50, 0.90], ["blur(0px)", "blur(0px)", "blur(14px)"])
  // Fade to black starts at 70 % and is fully done by 95 % — clean, unhurried exit
  const bgOpacity = useTransform(scrollYProgress, [0, 0.70, 0.95], [1, 1, 0])

  // Mouse tracking → spring-smoothed parallax per tile
  const rawX   = useMotionValue(0)
  const rawY   = useMotionValue(0)
  const mouseX = useSpring(rawX, { stiffness: 80, damping: 22 })
  const mouseY = useSpring(rawY, { stiffness: 80, damping: 22 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Normalize cursor to [-1, 1] based on viewport size
      const x = (e.clientX / window.innerWidth  - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      rawX.set(x * 140) // max ±140 px
      rawY.set(y * 100) // max ±100 px
    },
    [rawX, rawY],
  )

  function handleServicesClick(e: React.MouseEvent) {
    e.preventDefault()
    router.push("/services")
  }

  return (
    // Outer 200vh container drives the scroll progress
    <div
      ref={containerRef}
      style={{ height: "200vh" }}
      onMouseMove={handleMouseMove}
    >
      {/* Sticky inner — pins the hero to the viewport while scroll progresses */}
      <section className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* ── Solid black base — always present beneath gallery ─────────── */}
        <div aria-hidden className="absolute inset-0 z-0 bg-[#0A0A0A]" />

        {/* ── Scattered gallery — blurs then fades to black at 70 % ───────── */}
        <motion.div
          aria-hidden
          className="absolute inset-0 z-[1]"
          style={{ filter: bgFilter, opacity: bgOpacity, willChange: "opacity, filter" }}
        >
          {/* All tiles drift sideways together in a slow pendulum */}
          <motion.div
            className="absolute inset-0"
            animate={{ x: ["0px", "-35px", "0px"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          >
            {GALLERY.map((tile, i) => (
              <ImageTile key={i} tile={tile} mouseX={mouseX} mouseY={mouseY} />
            ))}
          </motion.div>

          {/* Dark centre overlay so text reads clearly over scattered photos */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 55% at 50% 50%, rgba(0,0,0,0.55) 0%, transparent 100%)",
            }}
          />
        </motion.div>

        {/* ── Gradient vignette — edges fade to black ───────────────────── */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.20) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.60) 100%)",
          }}
        />

        {/* ── Hero content — floats up slower than scroll ────────────────── */}
        <motion.div
          className="relative z-20 w-full max-w-360 mx-auto px-6 md:px-12 flex flex-col items-center text-center"
          style={{ y: contentY }}
        >
          {/* Eyebrow */}
          <FadeUp delay={0.1}>
            <p className="text-[11px] tracking-[0.22em] uppercase text-white/40 mb-8">
              Lifestyle Photographer
            </p>
          </FadeUp>

          {/* Main heading */}
          <h1 className="mb-6 md:mb-8">
            <LineReveal delay={0.25}>
              <span
                className="block font-light text-white leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize: "clamp(3.5rem, 9.5vw, 10rem)" }}
              >
                KamalTheIcon
              </span>
            </LineReveal>
          </h1>

          {/* One-liner */}
          <FadeUp delay={0.55} className="mb-12">
            <p className="text-white/40 text-[12px] tracking-[0.22em] uppercase font-light">
              Lifestyle &nbsp;·&nbsp; Brand &nbsp;·&nbsp; Editorial
            </p>
          </FadeUp>

          {/* CTA */}
          <FadeUp delay={0.75}>
            <motion.button
              onClick={handleServicesClick}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.1, ease: "easeOut" }}
              className="
                group relative
                text-[11px] font-medium tracking-[0.14em] uppercase
                text-white border border-white/40
                px-9 py-4
                overflow-hidden
                transition-colors duration-300
                hover:border-white
              "
            >
              <span
                aria-hidden
                className="
                  absolute inset-0 bg-white
                  translate-y-full group-hover:translate-y-0
                  transition-transform duration-300 ease-out
                "
              />
              <span className="relative z-10 group-hover:text-[#0a0a0a] transition-colors duration-300">
                See Our Services
              </span>
            </motion.button>
          </FadeUp>
        </motion.div>

        {/* ── Scroll indicator — bottom right ───────────────────────────── */}
        <FadeUp
          delay={1.2}
          className="absolute bottom-8 right-6 md:right-12 z-20 flex items-center gap-3"
        >
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/25">
            Scroll
          </span>
          <div className="relative w-10 h-px bg-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-white/50"
              animate={{ x: ["-100%", "100%"] }}
              transition={{
                duration:    1.8,
                repeat:      Infinity,
                ease:        "easeInOut",
                repeatDelay: 0.4,
              }}
            />
          </div>
        </FadeUp>

      </section>
    </div>
  )
}
