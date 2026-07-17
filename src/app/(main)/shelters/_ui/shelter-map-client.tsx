"use client";

import dynamic from "next/dynamic";

const ShelterMap = dynamic(() => import("./shelter-map"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-87.5 md:h-[calc(100vh-220px)] md:min-h-100 md:max-h-175 rounded-xl overflow-hidden border border-border bg-muted/40 animate-pulse" />
  ),
});

export default ShelterMap;
