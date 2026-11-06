"use client";

import { useRef } from "react";
import { AlertTriangle, Home, LifeBuoy, MapPinned, ArrowUpRight, Clock } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { useShelters } from "@/lib/hooks/use-shelters";
import { usePublicSosStats } from "@/lib/hooks/use-sos";

interface StatItem {
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "destructive" | "warning" | "success" | "primary";
  label: string;
  number: string;
  trend?: {
    icon: React.ComponentType<{ className?: string }>;
    text: string;
    type: "positive" | "negative" | "neutral";
  };
  progressValue?: number;
  progressText?: string;
  href: string;
  footer: string;
}

export default function LiveStatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const { data: activeAlerts } = useAlerts({ limit: 100, isActive: true });
  const { data: shelters } = useShelters({ limit: 1 });
  const { data: sosStats } = usePublicSosStats();

  const districtsAffected = new Set(activeAlerts?.data.map((a) => a.districtId)).size;
  const resolutionRate =
    sosStats && sosStats.total > 0 ? Math.round((sosStats.resolved / sosStats.total) * 100) : 0;

  const stats: StatItem[] = [
    {
      icon: AlertTriangle,
      accentColor: "destructive",
      label: "Districts Affected",
      number: districtsAffected ? String(districtsAffected) : "0",
      trend: { icon: Clock, text: "Live count", type: "neutral" },
      href: "/alerts",
      footer: "See districts",
    },
    {
      icon: MapPinned,
      accentColor: "warning",
      label: "Active Alerts",
      number: activeAlerts ? String(activeAlerts.meta.total) : "—",
      trend: { icon: ArrowUpRight, text: "Updated in real time", type: "neutral" },
      href: "/alerts",
      footer: "View alerts",
    },
    {
      icon: Home,
      accentColor: "success",
      label: "Shelters Open",
      number: shelters ? String(shelters.meta.total) : "—",
      trend: { icon: ArrowUpRight, text: "Across Bangladesh", type: "positive" },
      href: "/shelters",
      footer: "Find a shelter",
    },
    {
      icon: LifeBuoy,
      accentColor: "primary",
      label: "SOS Resolved",
      number: sosStats ? `${sosStats.resolved} / ${sosStats.total}` : "—",
      progressValue: resolutionRate,
      progressText: `${resolutionRate}% resolution rate`,
      href: "/tracker",
      footer: "Track an SOS",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <div className="relative z-30 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-14 mb-6 md:mb-20">
      <motion.div
        ref={containerRef}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 items-stretch motion-reduce:transform-none motion-reduce:transition-none"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={cardVariants}
            className="h-full motion-reduce:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
          >
            <StatCard
              label={stat.label}
              value={stat.number}
              icon={stat.icon as LucideIcon}
              sub={stat.trend?.text ?? stat.progressText}
              tint={stat.accentColor === "primary" ? "primary" : stat.accentColor}
              href={stat.href}
              footerLabel={stat.footer}
              highlight={stat.accentColor === "primary"}
              isLoading={!activeAlerts || !shelters || !sosStats}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

