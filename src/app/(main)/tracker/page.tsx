import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackerContent } from "./_ui/tracker-content";

export const metadata: Metadata = {
  title: "Track SOS Request — FloodAid BD",
  description: "Check the live status of a submitted emergency SOS request.",
};

export default function TrackerPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <Suspense fallback={null}>
        <TrackerContent />
      </Suspense>
    </div>
  );
}
