"use client";

import { AlertTriangle, MapPin, LifeBuoy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface StepItem {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "warning" | "success" | "destructive";
  title: string;
  description: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    icon: AlertTriangle,
    accentColor: "warning",
    title: "Check Flood Alerts",
    description:
      "View real-time water levels and severity alerts for your district on an interactive map.",
  },
  {
    number: "02",
    icon: MapPin,
    accentColor: "success",
    title: "Find Nearest Shelter",
    description:
      "Locate nearby emergency shelters with capacity info, facilities, and GPS directions.",
  },
  {
    number: "03",
    icon: LifeBuoy,
    accentColor: "destructive",
    title: "Request Emergency Help",
    description:
      "Send an SOS with your location. Volunteers and rescue teams will be dispatched to you.",
  },
];

const themeStyles = {
  warning: {
    ring: "from-amber-400 to-amber-600",
    glow: "bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-500",
  },
  success: {
    ring: "from-emerald-400 to-emerald-600",
    glow: "bg-emerald-500/20",
    text: "text-emerald-600 dark:text-emerald-500",
  },
  destructive: {
    ring: "from-red-400 to-red-600",
    glow: "bg-destructive/20",
    text: "text-destructive",
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18 } },
};

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

const nodeVariants: Variants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 16, delay: 0.15 },
  },
};

export default function HowItWorks() {
  return (
    <section className="relative my-16 md:my-20 pt-16 md:pt-20 w-full bg-background overflow-hidden">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_0%,color-mix(in_oklch,var(--color-primary)_6%,transparent),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
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
          viewport={{ once: true, amount: 0.25 }}
          variants={containerVariants}
          className="relative"
        >
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px">
            <div className="absolute inset-0 bg-border" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="absolute inset-0 origin-left bg-linear-to-r from-amber-500 via-emerald-500 to-destructive"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-14 md:gap-8 relative z-10">
            {steps.map((step, index) => {
              const theme = themeStyles[step.accentColor];
              const StepIcon = step.icon;
              const offset = index === 1 ? "md:mt-10" : "";

              return (
                <motion.div
                  key={step.number}
                  variants={stepVariants}
                  className={`group relative flex flex-col items-center text-center ${offset}`}
                >
                  <span
                    className="absolute -top-10 md:-top-8 text-7xl md:text-8xl font-black text-foreground/4 select-none leading-none pointer-events-none"
                    aria-hidden="true"
                  >
                    {step.number}
                  </span>

                  <motion.div variants={nodeVariants} className="relative">
                    <div
                      className={`absolute inset-0 rounded-full ${theme.glow} blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      aria-hidden="true"
                    />
                    <div
                      className={`relative flex items-center justify-center h-20 w-20 rounded-full bg-linear-to-br ${theme.ring} ring-4 ring-background transition-transform duration-300 group-hover:scale-110`}
                    >
                      <StepIcon className="h-8 w-8 text-white" />
                    </div>
                  </motion.div>

                  <h3 className="text-lg md:text-xl font-bold text-foreground mt-6 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed max-w-64">
                    {step.description}
                  </p>

                  <span
                    className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${theme.text} transition-opacity duration-300`}
                  >
                    Step {step.number}
                  </span>
                </motion.div>
              );
            })}
          </div>
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
