import { Metadata } from "next"
import { Suspense } from "react"
import SheltersContent from "./_ui/shelters-content"

// Metadata for the emergency shelter page
export const metadata: Metadata = {
  title: "Shelter Finder — FloodAid BD",
  description: "Find emergency flood shelters across Bangladesh with real-time capacity and facilities information.",
}

// Main page component for displaying available shelters
export default function SheltersPage() {
   // Wraps shelter content in a Suspense boundary
  return (
    <Suspense fallback={null}>
      <SheltersContent />
    </Suspense>
  )
}