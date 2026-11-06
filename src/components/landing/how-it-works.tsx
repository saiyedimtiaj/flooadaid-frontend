"use client";

import { AlertTriangle, MapPin, LifeBuoy, ArrowRight, Check, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface StepItem {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: "amber" | "green" | "red";
  title: string;
  description: string;
  detail: string;
  href: string;
  cta: string;
}

const steps: StepItem[] = [
  {
    number: "01",
    icon: AlertTriangle,
    tone: "amber",
    title: "Check Flood Alerts",
    description: "View real-time water levels and severity alerts for your district on an interactive map.",
    detail: "5 severity levels, updated live",
    href: "/alerts",
    cta: "Open alerts",
  },
  {
    number: "02",
    icon: MapPin,
    tone: "green",
    title: "Find Nearest Shelter",
    description: "Locate nearby emergency shelters with capacity info, facilities, and GPS directions.",
    detail: "Live capacity & facility data",
    href: "/shelters",
    cta: "Find shelters",
  },
  {
    number: "03",
    icon: LifeBuoy,
    tone: "red",
    title: "Request Emergency Help",
    description: "Send an SOS with your location. Volunteers and rescue teams will be dispatched to you.",
    detail: "No account needed",
    href: "/sos",
    cta: "Send SOS",
  },
];

const TONES = {
  amber: {
    band: "from-[oklch(0.82_0.15_75)] to-[oklch(0.68_0.19_45)]",
    text: "text-[oklch(0.6_0.17_55)]",
    chip: "bg-[oklch(0.8_0.15_70/0.14)]",
    shadow: "hover:shadow-[0_30px_60px_-28px_oklch(0.72_0.17_55/0.7)]",
  },
  green: {
    band: "from-[oklch(0.72_0.15_165)] to-[oklch(0.52_0.12_190)]",
    text: "text-[oklch(0.55_0.13_170)]",
    chip: "bg-[oklch(0.7_0.15_165/0.14)]",
    shadow: "hover:shadow-[0_30px_60px_-28px_oklch(0.62_0.15_170/0.7)]",
  },
  red: {
    band: "from-[oklch(0.66_0.22_25)] to-[oklch(0.5_0.21_10)]",
    text: "text-[oklch(0.58_0.22_22)]",
    chip: "bg-[oklch(0.64_0.22_22/0.12)]",
    shadow: "hover:shadow-[0_30px_60px_-28px_oklch(0.6_0.22_20/0.7)]",
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export default function HowItWorks() {
  return (
    <section className="relative my-6 md:my-20 w-full overflow-hidden">
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-12">
        <div className="text-center flex flex-col items-center">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-primary">
            Simple &amp; Fast
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-foreground text-balance">
            Three steps from <span className="text-brand">panic to safety</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground mt-4 max-w-xl text-balance">
            Whether water is rising outside or you are already stranded — FloodAid gets you the
            right help, fast.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={containerVariants}
          className="relative grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          <svg
            className="pointer-events-none absolute left-0 right-0 top-24 hidden h-16 w-full md:block"
            viewBox="0 0 1200 60"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id="hiw-line" x1="0" x2="1">
                <stop offset="0%" stopColor="oklch(0.75 0.16 65)" />
                <stop offset="50%" stopColor="oklch(0.65 0.14 170)" />
                <stop offset="100%" stopColor="oklch(0.62 0.22 22)" />
              </linearGradient>
            </defs>
            <path
              d="M80 30 C 280 -10, 420 70, 600 30 S 920 -10, 1120 30"
              fill="none"
              stroke="url(#hiw-line)"
              strokeWidth="3"
              strokeDasharray="8 10"
              strokeLinecap="round"
            />
          </svg>

          {steps.map((step) => {
            const t = TONES[step.tone];
            const StepIcon = step.icon;
            return (
              <motion.div key={step.number} variants={cardVariants} className="relative">
                <Link
                  href={step.href}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] bg-card shadow-soft ring-1 ring-border/70 transition-all duration-500 hover:-translate-y-2 ${t.shadow}`}
                >
                  <div className={`relative h-40 overflow-hidden bg-linear-to-br ${t.band}`}>
                    <div className="absolute inset-0 bg-dots opacity-40" aria-hidden />
                    <span className="absolute -bottom-8 right-3 text-[9rem] font-black leading-none text-white/15 select-none">
                      {step.number}
                    </span>
                    <svg
                      className="absolute inset-x-0 bottom-0 h-8 w-full text-card"
                      viewBox="0 0 400 40"
                      preserveAspectRatio="none"
                      aria-hidden
                    >
                      <path fill="currentColor" d="M0 24c60-18 130-22 200-6s140 18 200 2v20H0z" />
                    </svg>
                    <div className="absolute left-6 top-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 ring-1 ring-white/30 backdrop-blur-md text-white shadow-[inset_0_1px_0_oklch(1_0_0/0.3)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      <StepIcon className="h-8 w-8" />
                    </div>
                    <span className="absolute right-6 top-6 rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-wider text-white ring-1 ring-white/30">
                      STEP {step.number}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-6 pt-3">
                    <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${t.chip} ${t.text}`}>
                      <Check className="h-3 w-3" />
                      {step.detail}
                    </span>
                    <h3 className="text-xl font-extrabold text-foreground leading-tight">{step.title}</h3>
                    <p className="text-sm md:text-[15px] text-muted-foreground leading-relaxed">{step.description}</p>
                    <span className={`mt-auto pt-3 inline-flex items-center gap-1.5 text-sm font-bold ${t.text}`}>
                      {step.cta}
                      <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex items-center justify-center gap-1.5">
          <span className="text-sm text-muted-foreground font-medium">Want to see the full platform?</span>
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/15 group"
          >
            Learn More
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
