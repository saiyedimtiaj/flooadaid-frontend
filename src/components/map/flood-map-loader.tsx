"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const FloodMap = dynamic(() => import("./flood-map"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function FloodMapLoader() {
  return <FloodMap />;
}
