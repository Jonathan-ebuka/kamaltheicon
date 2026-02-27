"use client"

import { useEffect } from "react"
import Lenis from "lenis"

/**
 * Wraps the app in Lenis smooth scroll.
 * Lenis smoothly interpolates window.scrollY so all scroll-driven
 * Framer Motion animations (useScroll, useTransform) keep working
 * exactly as normal — they just feel much more fluid.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration:        1.3,
      // Exponential ease-out — fast start, smooth settle
      easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel:     true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.5,
    })

    let frameId: number

    function raf(time: number) {
      lenis.raf(time)
      frameId = requestAnimationFrame(raf)
    }

    frameId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
