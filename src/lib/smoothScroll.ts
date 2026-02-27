/**
 * Premium smooth scroll — easeInOutQuart curve, ~900ms duration.
 * Feels intentional and weighted, not a browser default jump.
 *
 * @param targetId  — the id of the element to scroll to (without #)
 * @param navOffset — pixels to subtract for fixed nav height (default 76)
 */

const DURATION = 900; // ms

function easeInOutQuart(t: number): number {
  return t < 0.5
    ? 8 * t * t * t * t
    : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

export function smoothScrollTo(targetId: string, navOffset = 76): void {
  const el = document.getElementById(targetId);
  if (!el) return;

  const targetY =
    el.getBoundingClientRect().top + window.scrollY - navOffset;
  const startY   = window.scrollY;
  const distance = targetY - startY;

  let startTime: number | null = null;

  function tick(now: number) {
    if (startTime === null) startTime = now;
    const elapsed  = now - startTime;
    const t        = Math.min(elapsed / DURATION, 1);
    const eased    = easeInOutQuart(t);

    window.scrollTo(0, startY + distance * eased);

    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}
