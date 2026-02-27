/**
 * Shared animation presets — use across all components for a
 * cohesive, premium feel. Every easing curve is intentional.
 */

// ─── Easing curves ────────────────────────────────────────────────────────────

/** Heavy deceleration. Best for text reveals and panel slides. Feels weighty. */
export const EASE_LAND = [0.22, 1, 0.36, 1] as const

/** Expo deceleration. General entrance animations — confident, not bouncy. */
export const EASE_EXPO = [0.16, 1, 0.3, 1] as const

/** Standard material easing. UI interactions, hover transitions. */
export const EASE_STD = [0.4, 0, 0.2, 1] as const

// ─── Viewport-triggered presets ───────────────────────────────────────────────

/**
 * Fade + lift on scroll into view.
 * Spread directly onto a motion element:
 *   <motion.div {...fadeInUp(0.15)}>
 */
export function fadeInUp(delay = 0) {
  return {
    initial:     { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport:    { once: true, margin: "-8% 0px" } as const,
    transition:  { duration: 0.72, delay, ease: EASE_EXPO },
  }
}

/**
 * Line reveal from below — use inside an overflow-hidden wrapper.
 * Spread onto a motion element:
 *   <div className="overflow-hidden">
 *     <motion.span {...lineReveal(0.2)}>…</motion.span>
 *   </div>
 */
export function lineReveal(delay = 0) {
  return {
    initial:     { y: "108%" },
    whileInView: { y: "0%" },
    viewport:    { once: true, margin: "-8% 0px" } as const,
    transition:  { duration: 1.0, delay, ease: EASE_LAND },
  }
}

/**
 * Fade in only — no vertical motion. For images, containers, etc.
 */
export function fadeIn(delay = 0) {
  return {
    initial:     { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport:    { once: true, margin: "-8% 0px" } as const,
    transition:  { duration: 0.9, delay, ease: EASE_EXPO },
  }
}
