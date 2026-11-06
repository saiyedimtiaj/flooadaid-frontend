"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Info, type LucideIcon } from "lucide-react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StatTint = "primary" | "destructive" | "success" | "warning" | "info" | "teal";

const PILL: Record<StatTint, string> = {
  primary: "bg-muted text-foreground/75",
  destructive: "bg-destructive/10 text-destructive",
  success: "bg-emerald-500/10 text-emerald-700",
  warning: "bg-amber-500/12 text-amber-700",
  info: "bg-sky-500/10 text-sky-700",
  teal: "bg-teal-500/10 text-teal-700",
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
  href?: string;
  footerLabel?: string;
  highlight?: boolean;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  tint = "primary",
  sub,
  isLoading,
  href,
  footerLabel = "View details",
  highlight,
}: StatCardProps) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lift">
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {label}
            <Info className="h-3.5 w-3.5 opacity-60" />
          </span>
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
              highlight ? "border-primary bg-primary text-lime" : "border-border bg-card text-foreground/75",
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="h-9 w-24" />
        ) : (
          <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground leading-none">
            {typeof value === "number" ? <AnimatedNumber value={value} /> : (value ?? "—")}
          </span>
        )}
        {sub && (
          <span className={cn("w-fit rounded-full px-2.5 py-1 text-xs font-semibold", PILL[tint])}>{sub}</span>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "flex items-center justify-between px-5 py-3 text-sm font-semibold transition-colors",
            highlight
              ? "bg-primary text-primary-foreground hover:bg-[color-mix(in_oklch,var(--primary),white_10%)]"
              : "border-t border-border bg-muted/60 text-foreground hover:bg-muted",
          )}
        >
          {footerLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
