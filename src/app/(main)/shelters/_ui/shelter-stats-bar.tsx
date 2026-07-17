"use client";

import { useEffect, useRef } from "react";
import { Home, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  Variants,
} from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useShelters } from "@/lib/hooks/use-shelters";
import type { Shelter } from "@/lib/types/api";

function occupancyRateOf(shelter: Shelter) {
  return shelter.currentOccupancy / shelter.capacity;
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

function AnimatedCount({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [isInView, count, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export default function ShelterStatsBar() {
  const { data, isLoading } = useShelters({ limit: 100 });
  const shelters = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  const totalShelters = shelters.length;
  const totalCapacity = shelters.reduce((sum, s) => sum + s.capacity, 0);
  const totalOccupancy = shelters.reduce((sum, s) => sum + s.currentOccupancy, 0);
  const availableCount = shelters.filter((s) => occupancyRateOf(s) < 0.5).length;
  const fillingFastCount = shelters.filter((s) => {
    const rate = occupancyRateOf(s);
    return rate >= 0.5 && rate < 0.8;
  }).length;
  const nearCapacityCount = shelters.filter((s) => occupancyRateOf(s) >= 0.8).length;

  const stats = [
    {
      icon: Home,
      label: "Total Shelters",
      value: totalShelters,
      sub: `${totalOccupancy.toLocaleString()} / ${totalCapacity.toLocaleString()} people`,
      text: "text-accent-teal",
      iconBg: "bg-accent-teal/12",
      wash: "from-accent-teal/12 via-accent-teal/4",
      ring: "group-hover:border-accent-teal/40",
    },
    {
      icon: CheckCircle2,
      label: "Available",
      value: availableCount,
      sub: "under 50% occupied",
      text: "text-emerald-600 dark:text-emerald-500",
      iconBg: "bg-emerald-500/12",
      wash: "from-emerald-500/12 via-emerald-500/4",
      ring: "group-hover:border-emerald-500/40",
    },
    {
      icon: TrendingUp,
      label: "Filling Fast",
      value: fillingFastCount,
      sub: "50–79% occupied",
      text: "text-amber-600 dark:text-amber-500",
      iconBg: "bg-amber-500/12",
      wash: "from-amber-500/12 via-amber-500/4",
      ring: "group-hover:border-amber-500/40",
    },
    {
      icon: AlertCircle,
      label: "Near Capacity",
      value: nearCapacityCount,
      sub: "80%+ occupied",
      text: "text-destructive",
      iconBg: "bg-destructive/12",
      wash: "from-destructive/12 via-destructive/4",
      ring: "group-hover:border-destructive/40",
    },
  ];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className={`group relative overflow-hidden flex flex-col gap-4 rounded-3xl border border-border bg-linear-to-br ${stat.wash} to-transparent px-5 py-5 md:px-6 md:py-6 transition-colors duration-300 ${stat.ring}`}
          >
            <Icon
              className={`absolute -right-4 -bottom-5 h-28 w-28 ${stat.text} opacity-7 -rotate-12 pointer-events-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110`}
              strokeWidth={1.5}
            />

            <div
              className={`relative flex items-center justify-center h-13 w-13 rounded-2xl shrink-0 ${stat.iconBg} ${stat.text}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="relative flex flex-col min-w-0">
              <span className="text-3xl md:text-4xl font-extrabold text-foreground tabular-nums leading-none">
                <AnimatedCount value={stat.value} />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground leading-none mt-2.5">
                {stat.label}
              </span>
              <span className="text-[11px] text-muted-foreground truncate mt-1.5">
                {stat.sub}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
