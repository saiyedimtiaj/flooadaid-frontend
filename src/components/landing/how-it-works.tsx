"use client";

import { AlertTriangle, MapPin, LifeBuoy, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface StepItem {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "warning" | "success" | "destructive";
  title: string;
  description: string;
  detail: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    icon: AlertTriangle,
    accentColor: "warning",
    title: "Check Flood Alerts",
    description:
      "View real-time water levels and severity alerts for your district on an interactive map.",
    detail: "5 severity levels, updated live",
  },
  {
    number: "02",
    icon: MapPin,
    accentColor: "success",
    title: "Find Nearest Shelter",
    description:
      "Locate nearby emergency shelters with capacity info, facilities, and GPS directions.",
    detail: "Live capacity & facility data",
  },
  {
    number: "03",
    icon: LifeBuoy,
    accentColor: "destructive",
    title: "Request Emergency Help",
    description:
      "Send an SOS with your location. Volunteers and rescue teams will be dispatched to you.",
    detail: "No account needed to send SOS",
  },
];

const themeStyles = {
  warning: {
    solid: "bg-amber-500",
    ring: "ring-amber-500/20",
    glow: "bg-amber-500/15",
    text: "text-amber-600 dark:text-amber-500",
    tint: "bg-amber-500/10",
  },
  success: {
    solid: "bg-emerald-500",
    ring: "ring-emerald-500/20",
    glow: "bg-emerald-500/15",
    text: "text-emerald-600 dark:text-emerald-500",
    tint: "bg-emerald-500/10",
  },
  destructive: {
    solid: "bg-destructive",
    ring: "ring-destructive/20",
    glow: "bg-destructive/15",
    text: "text-destructive",
    tint: "bg-destructive/10",
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

const nodeVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 18, delay: 0.1 },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative my-16 md:my-20 py-16 md:py-20 w-full bg-muted/20 overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_7%,transparent),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">
        <div className="text-center flex flex-col items-center">
          <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-primary leading-none mb-3">
            Simple &amp; Fast
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground text-balance">
            How It Works
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-md text-balance">
            Three steps stand between panic and safety
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="relative flex flex-col"
        >
          {/* Vertical progress spine */}
          <div className="absolute left-7.5 md:left-9 top-4 bottom-4 w-px bg-border" aria-hidden="true">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="absolute inset-0 origin-top bg-linear-to-b from-amber-500 via-emerald-500 to-destructive"
            />
          </div>

          {steps.map((step, index) => {
            const theme = themeStyles[step.accentColor];
            const StepIcon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <motion.div
                key={step.number}
                variants={rowVariants}
                className={`group relative flex gap-5 md:gap-7 ${isLast ? "" : "pb-12 md:pb-14"}`}
              >
                <motion.div variants={nodeVariants} className="relative shrink-0">
                  <div
                    className={`absolute inset-0 rounded-2xl ${theme.glow} blur-lg scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    aria-hidden="true"
                  />
                  <div
                    className={`relative flex items-center justify-center h-15 w-15 md:h-18 md:w-18 rounded-2xl ${theme.tint} ring-1 ${theme.ring} transition-transform duration-300 group-hover:-translate-y-0.5`}
                  >
                    <StepIcon className={`h-6 w-6 md:h-7 md:w-7 ${theme.text}`} />
                  </div>
                  <span
                    className={`absolute -bottom-1.5 -right-1.5 flex items-center justify-center h-6 w-6 rounded-full ${theme.solid} text-white text-[10px] font-black ring-4 ring-muted/20`}
                  >
                    {step.number}
                  </span>
                </motion.div>

                <div className="flex-1 flex flex-col gap-2 pt-1 md:pt-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="text-lg md:text-xl font-bold text-foreground leading-tight">
                      {step.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider ${theme.text}`}
                    >
                      <Check className="h-3 w-3" />
                      {step.detail}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex items-center justify-center gap-1.5">
          <span className="text-xs md:text-sm text-muted-foreground font-medium">
            Want to see the full platform?
          </span>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-0.5 text-xs md:text-sm font-semibold text-primary hover:underline group"
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
