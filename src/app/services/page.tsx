import type { Metadata } from "next"
import Nav      from "@/components/layout/Nav"
import Services from "@/components/sections/Services"
import Footer   from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Services — KamalTheIcon",
  description:
    "Bespoke lifestyle, brand, editorial and events photography by KamalTheIcon. Available in Lagos, London and worldwide.",
}

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <Services />
      <Footer />
    </>
  )
}
