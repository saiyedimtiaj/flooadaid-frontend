"use client"

import dynamic from "next/dynamic"

const ShelterMiniMap = dynamic(() => import("./shelter-mini-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-45 rounded-lg overflow-hidden border border-border bg-muted/40 animate-pulse" />
  ),
})

export default ShelterMiniMap
