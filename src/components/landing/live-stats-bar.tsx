"use client";

import { useRef } from "react";
import { AlertTriangle, Home, LifeBuoy, MapPinned, ArrowUpRight, Clock } from "lucide-react";
import { motion, useInView, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
    },
    {
      icon: MapPinned,
      accentColor: "warning",
      label: "Active Alerts",
      number: activeAlerts ? String(activeAlerts.meta.total) : "—",
      trend: { icon: ArrowUpRight, text: "Updated in real time", type: "neutral" },
    },
    {
      icon: Home,
      accentColor: "success",
      label: "Shelters Open",
      number: shelters ? String(shelters.meta.total) : "—",
      trend: { icon: ArrowUpRight, text: "Across Bangladesh", type: "positive" },
    },
    {
      icon: LifeBuoy,
      accentColor: "primary",
      label: "SOS Resolved",
      number: sosStats ? `${sosStats.resolved} / ${sosStats.total}` : "—",
      progressValue: resolutionRate,
      progressText: `${resolutionRate}% resolution rate`,
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
    <div className="relative z-30 w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-10 md:-mt-14 mb-8">
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
            <StatCard {...stat} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  accentColor,
  label,
  number,
  trend,
  progressValue,
  progressText,
}: StatItem) {
  const themeClasses = {
    destructive: {
      border: "border-l-[var(--destructive)]",
      iconContainer: "bg-destructive/10 text-destructive",
      hoverTint: "hover:bg-destructive/[0.015]",
    },
    warning: {
      border: "border-l-amber-500",
      iconContainer: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
      hoverTint: "hover:bg-amber-500/[0.015]",
    },
    success: {
      border: "border-l-emerald-500",
      iconContainer: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
      hoverTint: "hover:bg-emerald-500/[0.015]",
    },
    primary: {
      border: "border-l-primary",
      iconContainer: "bg-primary/10 text-primary",
      hoverTint: "hover:bg-primary/[0.015]",
    },
  };

  const trendColorClasses = {
    positive: "text-emerald-600 dark:text-emerald-500 font-semibold",
    negative: "text-destructive font-semibold",
    neutral: "text-muted-foreground font-medium",
  };

  const currentTheme = themeClasses[accentColor];

  return (
    <Card
      className={`
        relative overflow-hidden h-full border-y border-r border-l-0 border-border
        ${currentTheme.border} border-l-[3px]
        ${currentTheme.hoverTint}
        bg-card hover:bg-card/90 text-card-foreground
        hover:-translate-y-0.5 transition-all duration-200 ease-out
        group flex flex-col justify-between
      `}
    >
      <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full gap-4">
        <div className="flex flex-col gap-3">
          <div
            className={`
              flex items-center justify-center h-10 w-10 rounded-lg shrink-0
              ${currentTheme.iconContainer}
              transition-transform duration-200 group-hover:scale-102
            `}
          >
            <Icon className="h-5 w-5" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-muted-foreground leading-none">
              {label}
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground tabular-nums leading-none">
              {number}
            </span>
          </div>
        </div>

        <div className="mt-auto">
          {trend && (
            <div className="flex items-center gap-1 leading-none mt-1">
              <trend.icon className={`h-3.5 w-3.5 shrink-0 ${trendColorClasses[trend.type]}`} />
              <span className={`text-[11px] sm:text-xs ${trendColorClasses[trend.type]}`}>
                {trend.text}
              </span>
            </div>
          )}

          {progressValue !== undefined && (
            <div className="flex flex-col gap-1.5 w-full mt-1">
              <Progress
                value={progressValue}
                className="h-1.5 w-full bg-slate-100 dark:bg-slate-800"
              />
              {progressText && (
                <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground leading-none">
                  {progressText}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
