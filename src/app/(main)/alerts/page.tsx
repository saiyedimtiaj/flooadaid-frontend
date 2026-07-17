import { Metadata } from "next";
import { AlertsContent } from "./_ui/alerts-content";

export const metadata: Metadata = {
  title: "Real-time Flood Alerts | FloodAid BD",
  description:
    "Monitor real-time water-levels, regional alerts, and active flood emergency warnings across Bangladesh.",
};

export default function AlertsPage() {
  return (
    <main className="w-full min-h-screen bg-background relative py-8 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AlertsContent />
      </div>
    </main>
  );
}
