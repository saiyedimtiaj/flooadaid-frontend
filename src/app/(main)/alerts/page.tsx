import { Metadata } from "next";
import { Suspense } from "react";
import { AlertsContent } from "./_ui/alerts-content";

// Metadata for the Flood Alerts page
export const metadata: Metadata = {
  title: "Real-time Flood Alerts | FloodAid BD",
  description:
    "Monitor real-time water-levels, regional alerts, and active flood emergency warnings across Bangladesh.",
};

// Main page component for displaying flood alerts
export default function AlertsPage() {
  return (
    <main className="w-full min-h-screen bg-background relative py-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Suspense handles the loading state of the alerts content */}
        <Suspense fallback={null}>
          <AlertsContent />
        </Suspense>
      </div>
    </main>
  );
}
