"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { EASE_LAND, EASE_EXPO } from "@/lib/motion"

// ─── Data ─────────────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    id: "lifestyle" as const,
    tier: "01",
    name: "Creative Lifestyle Session",
    price: "₦100,000",
    suffix: "+",
    tagline: "Where your story begins.",
    features: [
      "Professional lifestyle shoot",
      "Creative direction & concept",
      "10 selectively edited photos",
      "Digital delivery",
    ],
    featured: false,
  },
  {
    id: "premium" as const,
    tier: "02",
    name: "Premium Icon Session",
    price: "₦150,000",
    suffix: "+",
    tagline: "Elevated beyond the ordinary.",
    features: [
      "Advanced creative concept planning",
      "Multiple outfit or scene changes",
      "20 selectively edited photos",
      "Enhanced editing style",
      "Priority scheduling",
    ],
    featured: true,
  },
  {
    id: "custom" as const,
    tier: "03",
    name: "Custom Creative Project",
    price: "By Discussion",
    suffix: "",
    tagline: "For visions without limits.",
    features: [
      "Full bespoke project planning",
      "Campaign or editorial level",
      "Brand & commercial options",
      "Dedicated creative consultation",
    ],
    featured: false,
  },
] as const

type PackageId = (typeof PACKAGES)[number]["id"]

const CONTACT_METHODS = ["WhatsApp", "Email", "Instagram DM"] as const
type ContactMethod = (typeof CONTACT_METHODS)[number]

const STEPS = ["Session", "Details", "Creative", "Vision"] as const

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]
const WEEK_DAYS = ["Mo","Tu","We","Th","Fr","Sa","Su"]

const TRUST_ITEMS = [
  { label: "Personalized Creative Planning", desc: "Every session is uniquely crafted around your vision and goals." },
  { label: "Professional Session Curation",  desc: "Thoughtfully planned from concept to final delivered image."   },
  { label: "12-Hour Response Guarantee",     desc: "Your request is reviewed and answered swiftly, always."       },
  { label: "Complete Privacy Assured",       desc: "Your details are handled with absolute discretion."           },
]

// ─── Types ─────────────────────────────────────────────────────────────────────

interface FormData {
  packageId:     PackageId | ""
  name:          string
  email:         string
  phone:         string
  instagram:     string
  date:          string
  contactMethod: ContactMethod | ""
  contactValue:  string
  description:   string
}

const EMPTY_FORM: FormData = {
  packageId:     "",
  name:          "",
  email:         "",
  phone:         "",
  instagram:     "",
  date:          "",
  contactMethod: "",
  contactValue:  "",
  description:   "",
}

// ─── Calendar ──────────────────────────────────────────────────────────────────

function DatePicker({
  value,
  onChange,
  minDate,
}: {
  value:    string
  onChange: (v: string) => void
  minDate?: string
}) {
  const today   = new Date()
  const minD    = minDate ? new Date(minDate + "T00:00:00") : today
  const initial = value   ? new Date(value   + "T00:00:00") : today

  const [open,      setOpen]      = useState(false)
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [viewYear,  setViewYear]  = useState(initial.getFullYear())
  const wrapRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [open])

  const selected = value ? new Date(value + "T00:00:00") : null

  // Build day cells (Monday-first grid)
  const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate()
  const rawFirstDay  = new Date(viewYear, viewMonth, 1).getDay()     // 0=Sun
  const startOffset  = (rawFirstDay + 6) % 7                         // Mon=0 … Sun=6
  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day)
    d.setHours(0,0,0,0)
    const m = new Date(minD); m.setHours(0,0,0,0)
    return d < m
  }
  function isSelected(day: number) {
    return !!selected &&
      selected.getFullYear() === viewYear &&
      selected.getMonth()    === viewMonth &&
      selected.getDate()     === day
  }
  function isToday(day: number) {
    return (
      today.getFullYear() === viewYear &&
      today.getMonth()    === viewMonth &&
      today.getDate()     === day
    )
  }

  function pick(day: number) {
    if (isDisabled(day)) return
    const d   = new Date(viewYear, viewMonth, day)
    const iso = d.toISOString().split("T")[0]
    onChange(iso)
    setOpen(false)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const display = selected
    ? selected.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : ""

  return (
    <div ref={wrapRef} className="relative">

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={cn(
          "w-full py-3.5 px-0 bg-transparent",
          "border-0 border-b text-[15px] font-light text-left",
          "flex items-center justify-between gap-2",
          "transition-colors duration-300 focus:outline-none",
          open
            ? "border-[var(--color-ink)]"
            : "border-[var(--color-hairline)] hover:border-[var(--color-muted)]"
        )}
      >
        <span className={display ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]/50"}>
          {display || "Select a date"}
        </span>
        {/* Mini calendar icon */}
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"
          className="shrink-0 text-[var(--color-muted)]"
        >
          <rect x="1" y="2.5" width="14" height="12.5" rx="1.5" />
          <line x1="1" y1="6.5" x2="15" y2="6.5" />
          <line x1="5"  y1="1" x2="5"  y2="4.5" />
          <line x1="11" y1="1" x2="11" y2="4.5" />
        </svg>
      </button>

      {/* Dropdown calendar */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y:  0  }}
            exit={{    opacity: 0, y: -4  }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute z-50 top-full left-0 mt-1 bg-[var(--color-bg)] border border-[var(--color-hairline)] p-5 w-[290px]"
            style={{ boxShadow: "0 12px 40px rgba(0,0,0,0.14)" }}
          >

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-5">
              <button
                type="button"
                onClick={prevMonth}
                className="w-7 h-7 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                ←
              </button>
              <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-[var(--color-ink)]">
                {MONTHS[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="w-7 h-7 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
              >
                →
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 mb-2">
              {WEEK_DAYS.map((d) => (
                <span
                  key={d}
                  className="text-center text-[9px] tracking-[0.12em] uppercase text-[var(--color-muted)] py-1"
                >
                  {d}
                </span>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {cells.map((day, i) =>
                day === null ? (
                  <span key={`e-${i}`} />
                ) : (
                  <button
                    key={day}
                    type="button"
                    disabled={isDisabled(day)}
                    onClick={() => pick(day)}
                    className={cn(
                      "aspect-square flex items-center justify-center text-[12px] rounded-sm",
                      "transition-all duration-100",
                      isSelected(day)
                        ? "bg-[var(--color-ink)] text-[var(--color-bg)] font-medium"
                        : isDisabled(day)
                          ? "text-[var(--color-muted)]/25 cursor-not-allowed"
                          : isToday(day)
                            ? "font-semibold text-[var(--color-ink)] ring-1 ring-[var(--color-hairline)]"
                            : "text-[var(--color-ink)] hover:bg-[var(--color-hairline)] cursor-pointer"
                    )}
                  >
                    {day}
                  </button>
                )
              )}
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start mb-16">
      {STEPS.map((label, i) => {
        const idx  = i + 1
        const done = idx < current
        const act  = idx === current
        const last = i === STEPS.length - 1

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <motion.div
                animate={{
                  backgroundColor: done ? "var(--color-ink)" : "transparent",
                  borderColor: done || act ? "var(--color-ink)" : "var(--color-hairline)",
                  color: done ? "var(--color-bg)" : act ? "var(--color-ink)" : "var(--color-muted)",
                }}
                transition={{ duration: 0.4 }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-medium tracking-wider border"
              >
                {done ? "✓" : String(idx).padStart(2, "0")}
              </motion.div>
              <span className={cn(
                "text-[9px] tracking-[0.15em] uppercase hidden sm:block transition-colors duration-300",
                act ? "text-[var(--color-ink)]" : "text-[var(--color-muted)]"
              )}>
                {label}
              </span>
            </div>
            {!last && (
              <div className="flex-1 h-px mx-3 mt-[-14px] bg-[var(--color-hairline)] relative overflow-hidden hidden sm:block">
                <motion.div
                  className="absolute inset-0 bg-[var(--color-ink)]"
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: EASE_EXPO }}
                  style={{ originX: 0 }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Package Card ──────────────────────────────────────────────────────────────

function PackageCard({
  pkg, selected, onSelect,
}: {
  pkg: (typeof PACKAGES)[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: selected ? 0 : -5 }}
      transition={{ duration: 0.28, ease: EASE_EXPO }}
      className={cn(
        "relative w-full text-left p-8 border outline-none transition-colors duration-300",
        selected
          ? "border-[var(--color-ink)]"
          : pkg.featured
            ? "border-[var(--color-ink)]/25 hover:border-[var(--color-ink)]/55"
            : "border-[var(--color-hairline)] hover:border-[var(--color-muted)]"
      )}
    >
      {pkg.featured && !selected && (
        <span className="absolute top-5 right-5 text-[8px] tracking-[0.18em] uppercase border border-[var(--color-muted)]/35 px-2 py-0.5 text-[var(--color-muted)]">
          Most Chosen
        </span>
      )}
      {selected && (
        <span className="absolute top-5 right-5 text-[8px] tracking-[0.18em] uppercase border border-[var(--color-ink)] px-2 py-0.5 text-[var(--color-ink)]">
          Selected ✓
        </span>
      )}
      <span className="block text-[10px] tracking-[0.2em] uppercase text-[var(--color-muted)] mb-6">{pkg.tier}</span>
      <h3 className="font-normal leading-[1.15] tracking-[-0.02em] text-[var(--color-ink)] mb-2" style={{ fontSize: "clamp(1.05rem, 1.8vw, 1.3rem)" }}>
        {pkg.name}
      </h3>
      <p className="text-[12px] italic text-[var(--color-muted)] mb-7">{pkg.tagline}</p>
      <div className="mb-8">
        <span className="font-light tracking-[-0.03em] text-[var(--color-ink)]" style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)" }}>
          {pkg.price}
        </span>
        {pkg.suffix && <span className="text-[var(--color-muted)] text-sm ml-1">{pkg.suffix}</span>}
      </div>
      <div className="w-full h-px bg-[var(--color-hairline)] mb-7" />
      <ul className="space-y-3">
        {pkg.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[12px] font-light leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ink) 65%, transparent)" }}>
            <span className="text-[7px] mt-1.5 shrink-0 opacity-40">✦</span>
            {f}
          </li>
        ))}
      </ul>
    </motion.button>
  )
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <label
        className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase font-medium"
        style={{ color: "color-mix(in srgb, var(--color-ink) 70%, transparent)" }}
      >
        {label}
        {optional && <span className="text-[9px] normal-case tracking-normal font-normal opacity-50">(optional)</span>}
      </label>
      {children}
    </div>
  )
}

const baseInput = cn(
  "w-full py-3.5 px-0 bg-transparent",
  "border-0 border-b border-[var(--color-hairline)]",
  "text-[var(--color-ink)] text-[15px] font-light",
  "placeholder:text-[var(--color-muted)]/50",
  "focus:outline-none focus:border-[var(--color-ink)]",
  "transition-colors duration-300"
)

// ─── Buttons ───────────────────────────────────────────────────────────────────

function PrimaryButton({ label, onClick, disabled = false, type = "button", wide = false }: {
  label: string; onClick?: () => void; disabled?: boolean; type?: "button" | "submit"; wide?: boolean
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden border text-[11px] font-medium tracking-[0.14em] uppercase transition-colors duration-300",
        wide ? "px-12 py-5 w-full sm:w-auto" : "px-10 py-4",
        disabled
          ? "border-[var(--color-hairline)] text-[var(--color-muted)] cursor-not-allowed opacity-40"
          : "border-[var(--color-ink)] text-[var(--color-ink)] cursor-pointer"
      )}
    >
      {!disabled && (
        <span aria-hidden className="absolute inset-0 bg-[var(--color-ink)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      )}
      <span className={cn("relative z-10 transition-colors duration-300", !disabled && "group-hover:text-[var(--color-bg)]")}>
        {label}
      </span>
    </button>
  )
}

// ─── Contact method label helpers ──────────────────────────────────────────────

const CONTACT_META: Record<ContactMethod, { label: string; placeholder: string; type: string }> = {
  WhatsApp:       { label: "WhatsApp Number",   placeholder: "+234 000 000 0000", type: "tel"   },
  Email:          { label: "Email Address",     placeholder: "your@email.com",   type: "email" },
  "Instagram DM": { label: "Instagram Handle",  placeholder: "@yourhandle",      type: "text"  },
}

// ─── Success Modal ─────────────────────────────────────────────────────────────

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
        style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
      />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-lg bg-[var(--color-bg)] border border-[var(--color-hairline)] p-10 md:p-14 flex flex-col items-center text-center"
        initial={{ scale: 0.93, opacity: 0, y: 24 }}
        animate={{ scale: 1,    opacity: 1, y: 0  }}
        exit={{    scale: 0.95, opacity: 0, y: 12 }}
        transition={{ duration: 0.5, ease: EASE_LAND }}
      >
        {/* Pulsing ring */}
        <div className="relative w-16 h-16 mb-10">
          <motion.div
            className="absolute inset-0 rounded-full border border-[var(--color-hairline)]"
            animate={{ scale: 1.6, opacity: 0 }}
            initial={{ scale: 1,   opacity: 0.6 }}
            transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1,   opacity: 1   }}
            transition={{ duration: 0.55, delay: 0.15, ease: EASE_LAND }}
            className="w-full h-full rounded-full border border-[var(--color-hairline)] flex items-center justify-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1   }}
              transition={{ duration: 0.4, delay: 0.55, ease: EASE_LAND }}
              className="text-[var(--color-ink)] text-base"
            >
              ✦
            </motion.span>
          </motion.div>
        </div>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35, ease: EASE_EXPO }}
          className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-5">
          Request Received
        </motion.p>

        <motion.h2 initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.45, ease: EASE_LAND }}
          className="font-light leading-[1.2] tracking-[-0.02em] text-[var(--color-ink)] mb-5"
          style={{ fontSize: "clamp(1.4rem, 3.5vw, 2rem)" }}>
          Thank you for reaching out to KamalTheIcon.
        </motion.h2>

        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.58, ease: EASE_EXPO }}
          className="text-[13px] font-light leading-[1.9] mb-4"
          style={{ color: "color-mix(in srgb, var(--color-ink) 65%, transparent)" }}>
          Your creative session request has been received. Our team will review your concept
          and contact you shortly to discuss your vision.
        </motion.p>

        <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.68, ease: EASE_EXPO }}
          className="text-[12px] font-medium tracking-[0.08em] text-[var(--color-muted)] mb-10">
          We typically respond within 12 hours.
        </motion.p>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.9, delay: 0.75, ease: EASE_EXPO }}
          className="w-10 h-px bg-[var(--color-hairline)] mb-10" style={{ originX: 0.5 }} />

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.85 }}>
          <button
            onClick={onClose}
            className="group relative overflow-hidden border border-[var(--color-ink)] text-[var(--color-ink)] text-[10px] font-medium tracking-[0.16em] uppercase px-10 py-3.5"
          >
            <span aria-hidden className="absolute inset-0 bg-[var(--color-ink)] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 group-hover:text-[var(--color-bg)] transition-colors duration-300">Close</span>
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Booking() {
  const [step,      setStep]      = useState(1)
  const [direction, setDirection] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [form,      setForm]      = useState<FormData>(EMPTY_FORM)
  const formTopRef                = useRef<HTMLDivElement>(null)

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // When contact method changes, reset the contact value
  function setContactMethod(method: ContactMethod) {
    setForm((prev) => ({ ...prev, contactMethod: method, contactValue: "" }))
  }

  function goTo(next: number, pushHistory = true) {
    setDirection(next > step ? 1 : -1)
    setStep(next)
    if (pushHistory && next > 1) {
      window.history.pushState({ bookingStep: next }, "")
    }
    setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
  }

  // Handle browser back button / swipe-back — navigate between form steps
  useEffect(() => {
    function onPopState(e: PopStateEvent) {
      const prevStep = e.state?.bookingStep as number | undefined
      if (prevStep && prevStep >= 1 && prevStep <= 4) {
        setDirection(-1)
        setStep(prevStep)
        setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
      } else if (step > 1) {
        // No saved state — go back one step and push a replacement so we
        // don't leave the page on the next back press from step 1
        setDirection(-1)
        setStep((s) => {
          const target = Math.max(1, s - 1)
          if (target > 1) {
            window.history.pushState({ bookingStep: target }, "")
          }
          return target
        })
        setTimeout(() => formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)
      }
    }
    window.addEventListener("popstate", onPopState)
    return () => window.removeEventListener("popstate", onPopState)
  }, [step])

  const advance = () => goTo(step + 1)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setShowModal(true)
  }

  function handleModalClose() {
    setShowModal(false)
    setForm(EMPTY_FORM)
    setStep(1)
  }

  const slide = {
    enter:  (d: number) => ({ x: d * 52, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:   (d: number) => ({ x: d * -52, opacity: 0 }),
  }

  const selectedPackage   = PACKAGES.find((p) => p.id === form.packageId)
  const today             = new Date().toISOString().split("T")[0]
  const contactMeta       = form.contactMethod ? CONTACT_META[form.contactMethod as ContactMethod] : null
  const step3CanContinue  = !!form.date && !!form.contactMethod && !!form.contactValue.trim()

  return (
    <>
      {/* ── Success modal ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && <SuccessModal onClose={handleModalClose} />}
      </AnimatePresence>

      {/* ── Page hero ─────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#0A0A0A" }}>
        <div className="w-full max-w-[1440px] mx-auto px-6 md:px-12 pt-44 pb-28 md:pt-52 md:pb-36">
          <motion.p className="text-[11px] tracking-[0.22em] uppercase text-white/30 mb-8"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_EXPO }}>
            Begin Your Creative Session
          </motion.p>
          <h1>
            <div className="overflow-hidden">
              <motion.span className="block font-light text-white leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize: "clamp(3rem, 8vw, 9rem)" }}
                initial={{ y: "108%" }} animate={{ y: "0%" }}
                transition={{ duration: 1.0, delay: 0.15, ease: EASE_LAND }}>
                Reserve Your
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.span className="block font-light italic text-white leading-[0.92] tracking-[-0.03em]"
                style={{ fontSize: "clamp(3rem, 8vw, 9rem)" }}
                initial={{ y: "108%" }} animate={{ y: "0%" }}
                transition={{ duration: 1.0, delay: 0.28, ease: EASE_LAND }}>
                Creative Space.
              </motion.span>
            </div>
          </h1>
          <motion.p className="mt-10 text-white/40 text-[14px] font-light leading-[1.85] max-w-md"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.5, ease: EASE_EXPO }}>
            KamalTheIcon works with a select group of clients each month.
            Each session is approached as a bespoke creative collaboration,
            not a standard photoshoot.
          </motion.p>
        </div>
      </div>

      {/* ── Form section ──────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "var(--color-bg)" }}>
        <div ref={formTopRef} className="w-full max-w-[1440px] mx-auto px-6 md:px-12 py-24 md:py-32 scroll-mt-20">
          <form onSubmit={handleSubmit} noValidate>
            <StepIndicator current={step} />

            <AnimatePresence mode="wait" custom={direction}>

              {/* ── Step 1: click a card to select and immediately advance ── */}
              {step === 1 && (
                <motion.div key="s1" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE_EXPO }}>
                  <div className="mb-10">
                    <h2 className="font-light leading-tight tracking-[-0.02em] text-[var(--color-ink)] mb-3" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>
                      Select Your Session
                    </h2>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}>
                      Choose the experience that best reflects your creative vision.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                    {PACKAGES.map((pkg) => (
                      <PackageCard
                        key={pkg.id}
                        pkg={pkg}
                        selected={form.packageId === pkg.id}
                        onSelect={() => {
                          update("packageId", pkg.id)
                          // Small delay so the selected state renders before transition
                          setTimeout(advance, 160)
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <motion.div key="s2" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE_EXPO }}>
                  <div className="mb-10">
                    <h2 className="font-light leading-tight tracking-[-0.02em] text-[var(--color-ink)] mb-3" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>
                      Your Information
                    </h2>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}>
                      All information is kept strictly private and used only to plan your session.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-10 mb-12 max-w-2xl">
                    <Field label="Full Name">
                      <input type="text" required autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" className={baseInput} />
                    </Field>
                    <Field label="Email Address">
                      <input type="email" required autoComplete="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="your@email.com" className={baseInput} />
                    </Field>
                    <Field label="Phone Number" optional>
                      <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+234 000 000 0000" className={baseInput} />
                    </Field>
                    <Field label="Instagram Handle" optional>
                      <input type="text" value={form.instagram} onChange={(e) => update("instagram", e.target.value)} placeholder="@yourhandle" className={baseInput} />
                    </Field>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <PrimaryButton label="← Back" onClick={() => goTo(step - 1)} />
                    <PrimaryButton label="Continue →" onClick={advance} disabled={!form.name.trim() || !form.email.trim()} />
                  </div>
                </motion.div>
              )}

              {/* ── Step 3 ── */}
              {step === 3 && (
                <motion.div key="s3" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE_EXPO }}>
                  <div className="mb-10">
                    <h2 className="font-light leading-tight tracking-[-0.02em] text-[var(--color-ink)] mb-3" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>
                      Creative Details
                    </h2>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}>
                      Help us understand your schedule and how best to reach you.
                    </p>
                  </div>

                  <div className="max-w-2xl space-y-10 mb-12">

                    {/* Date picker */}
                    <Field label="Preferred Shoot Date">
                      <DatePicker value={form.date} onChange={(v) => update("date", v)} minDate={today} />
                    </Field>

                    {/* Contact method + conditional value input */}
                    <div className="space-y-6">
                      <Field label="Preferred Contact Method">
                        <div className="flex flex-col gap-4 pt-2">
                          {CONTACT_METHODS.map((method) => {
                            const checked = form.contactMethod === method
                            return (
                              <label key={method} className="flex items-center gap-3 cursor-pointer group">
                                <input type="radio" name="contactMethod" value={method} checked={checked}
                                  onChange={() => setContactMethod(method)} className="sr-only" />
                                <span className={cn(
                                  "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200",
                                  checked ? "border-[var(--color-ink)] bg-[var(--color-ink)]" : "border-[var(--color-hairline)] group-hover:border-[var(--color-muted)]"
                                )}>
                                  {checked && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg)]" />}
                                </span>
                                <span className="text-[14px] font-light text-[var(--color-ink)]">{method}</span>
                              </label>
                            )
                          })}
                        </div>
                      </Field>

                      {/* Conditional contact detail input — slides in when method is selected */}
                      <AnimatePresence>
                        {contactMeta && (
                          <motion.div
                            key={form.contactMethod}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1,  y:  0  }}
                            exit={{    opacity: 0,  y: -4  }}
                            transition={{ duration: 0.3, ease: EASE_EXPO }}
                          >
                            <Field label={contactMeta.label}>
                              <input
                                type={contactMeta.type}
                                required
                                value={form.contactValue}
                                onChange={(e) => update("contactValue", e.target.value)}
                                placeholder={contactMeta.placeholder}
                                className={baseInput}
                                autoFocus
                              />
                            </Field>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <PrimaryButton label="← Back" onClick={() => goTo(step - 1)} />
                    <PrimaryButton label="Continue →" onClick={advance} disabled={!step3CanContinue} />
                  </div>
                </motion.div>
              )}

              {/* ── Step 4 ── */}
              {step === 4 && (
                <motion.div key="s4" custom={direction} variants={slide} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4, ease: EASE_EXPO }}>
                  <div className="mb-10">
                    <h2 className="font-light leading-tight tracking-[-0.02em] text-[var(--color-ink)] mb-3" style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)" }}>
                      Your Vision
                    </h2>
                    <p className="text-[14px] font-light leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}>
                      Tell us what you have in mind — the more you share, the better we can prepare.
                    </p>
                  </div>

                  <div className="max-w-2xl">
                    <Field label="Describe Your Project">
                      <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={(e) => update("description", e.target.value)}
                        placeholder="Share your concept, mood references, preferred locations, or anything that helps describe your vision..."
                        className={cn(baseInput, "resize-none")}
                      />
                    </Field>

                    {/* Summary */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.15, ease: EASE_EXPO }}
                      className="mt-10 p-6 border border-[var(--color-hairline)]"
                    >
                      <p className="text-[9px] tracking-[0.2em] uppercase text-[var(--color-muted)] mb-5">Session Summary</p>
                      <div className="flex flex-col divide-y divide-[var(--color-hairline)]">
                        {[
                          { label: "Session",    value: selectedPackage?.name },
                          { label: "Name",       value: form.name             },
                          { label: "Date",       value: form.date             },
                          { label: "Contact",    value: `${form.contactMethod} — ${form.contactValue}` },
                        ].map(({ label, value }) => (
                          <div key={label} className="flex items-baseline justify-between py-3">
                            <span className="text-[10px] tracking-[0.12em] uppercase" style={{ color: "color-mix(in srgb, var(--color-ink) 50%, transparent)" }}>{label}</span>
                            <span className="text-[13px] font-normal text-[var(--color-ink)] text-right max-w-[60%] truncate">{value || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <div className="mt-10 flex flex-col items-center gap-4">
                      <PrimaryButton type="submit" label="Submit Creative Request" disabled={!form.description.trim()} wide />
                      <PrimaryButton label="← Back" onClick={() => goTo(step - 1)} />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>

          {/* ── Trust signals ─────────────────────────────────────────────────── */}
          <div className="mt-28 pt-16 border-t border-[var(--color-hairline)]">
            <motion.p className="text-[10px] tracking-[0.22em] uppercase text-[var(--color-muted)] mb-10"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-8% 0px" }}
              transition={{ duration: 0.6, ease: EASE_EXPO }}>
              Why KamalTheIcon
            </motion.p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
              {TRUST_ITEMS.map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.65, delay: i * 0.09, ease: EASE_EXPO }}
                  className="flex flex-col gap-3"
                >
                  <span className="text-[var(--color-muted)] text-[8px]">✦</span>
                  <p className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">{item.label}</p>
                  <p className="text-[12px] font-light leading-[1.75]" style={{ color: "color-mix(in srgb, var(--color-ink) 60%, transparent)" }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
