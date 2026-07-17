import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "FloodAid BD — Flood Relief Platform",
  description:
    "Real-time flood alerts, shelter finder, and emergency SOS system for Bangladesh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full", "antialiased", plusJakartaSans.className)}>
      <body className="min-h-full flex flex-col font-sans">
        <Toaster />
        <QueryProvider>
          <TooltipProvider delay={200}>{children}</TooltipProvider>
        </QueryProvider>
      </body>
    </html>
  );
}