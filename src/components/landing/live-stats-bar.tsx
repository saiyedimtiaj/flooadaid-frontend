"use client";

import { useRef } from "react";
import { AlertTriangle, Home, LifeBuoy, MapPinned, ArrowUpRight, Clock } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { useAlerts } from "@/lib/hooks/use-alerts";
import { useShelters } from "@/lib/hooks/use-shelters";
import { usePublicSosStats } from "@/lib/hooks/use-sos";
import { useT } from "@/lib/i18n/use-t";

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
  const { tr, num } = useT();
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
      label: tr("Districts Affected", "ক্ষতিগ্রস্ত জেলা"),
      number: num(districtsAffected),
      trend: { icon: Clock, text: tr("Live count", "সরাসরি হিসাব"), type: "neutral" },
      href: "/alerts",
      footer: tr("See districts", "জেলাগুলো দেখুন"),
    },
    {
      icon: MapPinned,
      accentColor: "warning",
      label: tr("Active Alerts", "সক্রিয় সতর্কতা"),
      number: activeAlerts ? num(activeAlerts.meta.total) : "—",
      trend: { icon: ArrowUpRight, text: tr("Updated in real time", "সরাসরি হালনাগাদ"), type: "neutral" },
      href: "/alerts",
      footer: tr("View alerts", "সতর্কতা দেখুন"),
    },
    {
      icon: Home,
      accentColor: "success",
      label: tr("Shelters Open", "খোলা আশ্রয়কেন্দ্র"),
      number: shelters ? num(shelters.meta.total) : "—",
      trend: { icon: ArrowUpRight, text: tr("Across Bangladesh", "সারা বাংলাদেশে"), type: "positive" },
      href: "/shelters",
      footer: tr("Find a shelter", "আশ্রয়কেন্দ্র খুঁজুন"),
    },
    {
      icon: LifeBuoy,
      accentColor: "primary",
      label: tr("SOS Resolved", "সমাধান হওয়া SOS"),
      number: sosStats ? `${num(sosStats.resolved)} / ${num(sosStats.total)}` : "—",
      progressValue: resolutionRate,
      progressText: tr(`${resolutionRate}% resolution rate`, `${num(resolutionRate)}% সমাধানের হার`),
      href: "/tracker",
      footer: tr("Track an SOS", "SOS ট্র্যাক করুন"),
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

