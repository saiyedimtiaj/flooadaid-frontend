import { Metadata } from "next"
import SheltersContent from "./_ui/shelters-content"

export const metadata: Metadata = {
  title: "Shelter Finder — FloodAid BD",
  description: "Find emergency flood shelters across Bangladesh with real-time capacity and facilities information.",
}

export default function SheltersPage() {
  return <SheltersContent />
}