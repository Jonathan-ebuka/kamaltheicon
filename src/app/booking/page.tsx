import type { Metadata } from "next"
import Nav     from "@/components/layout/Nav"
import Booking from "@/components/sections/Booking"
import Footer  from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Book a Session — KamalTheIcon",
  description:
    "Reserve your bespoke creative photography session with KamalTheIcon. Premium lifestyle, brand, and editorial photography in Lagos.",
}

export default function BookingPage() {
  return (
    <>
      <Nav />
      <Booking />
      <Footer />
    </>
  )
}
