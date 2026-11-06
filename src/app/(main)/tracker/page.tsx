import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackerContent } from "./_ui/tracker-content";

export const metadata: Metadata = {
  title: "Track SOS Request — FloodAid BD",
  description: "Check the live status of a submitted emergency SOS request.",
};

export default function TrackerPage() {
  return (
    <div>
      <Suspense fallback={null}>
        <TrackerContent />
      </Suspense>
    </div>
  );
}
