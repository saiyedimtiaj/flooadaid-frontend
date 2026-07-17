"use client";

import { useEffect, useRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StatTint =
  | "primary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "teal";

const TINT_STYLES: Record<StatTint, { chip: string; wash: string; ring: string }> = {
  primary: {
    chip: "bg-primary/10 text-primary",
    wash: "from-primary/8",
    ring: "group-hover:border-primary/30",
  },
  destructive: {
    chip: "bg-destructive/10 text-destructive",
    wash: "from-destructive/8",
    ring: "group-hover:border-destructive/30",
  },
  success: {
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500",
    wash: "from-emerald-500/8",
    ring: "group-hover:border-emerald-500/30",
  },
  warning: {
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-500",
    wash: "from-amber-500/8",
    ring: "group-hover:border-amber-500/30",
  },
  info: {
    chip: "bg-info/10 text-info",
    wash: "from-info/8",
    ring: "group-hover:border-info/30",
  },
  teal: {
    chip: "bg-accent-teal/12 text-accent-teal",
    wash: "from-accent-teal/8",
    ring: "group-hover:border-accent-teal/30",
  },
};

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1, ease: [0.16, 1, 0.3, 1] });
      return () => controls.stop();
    }
  }, [isInView, count, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

interface StatCardProps {
  label: string;
  value: number | string | undefined;
  icon: LucideIcon;
  tint?: StatTint;
  sub?: string;
  isLoading?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "primary",
  sub,
  isLoading,
}: StatCardProps) {
  const style = TINT_STYLES[tint];

  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-linear-to-br to-transparent p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm",
        style.wash,
        style.ring,
      )}
    >
      <Icon
        className={cn(
          "absolute -right-3 -bottom-3 h-24 w-24 opacity-[0.06] -rotate-12 pointer-events-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-110",
          style.chip.split(" ").find((c) => c.startsWith("text-")),
        )}
        strokeWidth={1.5}
      />
      <div
        className={cn(
          "relative flex items-center justify-center h-9 w-9 rounded-xl mb-3",
          style.chip,
        )}
      >
        <Icon className="h-4.5 w-4.5" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-16" />
      ) : (
        <span className="relative text-2xl font-extrabold text-foreground tabular-nums leading-none">
          {typeof value === "number" ? <AnimatedNumber value={value} /> : (value ?? "—")}
        </span>
      )}
      <p className="relative text-xs font-semibold text-muted-foreground mt-1.5">{label}</p>
      {sub && <p className="relative text-[11px] text-muted-foreground/80 mt-1">{sub}</p>}
    </Card>
  );
}
