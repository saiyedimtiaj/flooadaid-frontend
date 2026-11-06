"use client";

import dynamic from "next/dynamic";

const HomeFloodMap = dynamic(() => import("./home-flood-map"), {
  ssr: false,
  loading: () => (
    <section className="relative my-6 md:my-20 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-95 md:h-130 w-full rounded-2xl border border-border bg-muted/40 animate-pulse" />
      </div>
    </section>
  ),
});

export default HomeFloodMap;
