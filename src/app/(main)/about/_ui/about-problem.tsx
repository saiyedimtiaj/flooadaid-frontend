"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { WifiOff, MapPinOff, PhoneOff } from "lucide-react";

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
}

function StatCounter({ value, suffix = "", prefix = "" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 1.2,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, motionValue, value]);

  return (
    <span
      ref={ref}
      className="text-3xl md:text-4xl font-bold text-foreground tabular-nums"
    >
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function AboutProblem() {
  const headerVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const problemContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12 },
    },
  };

  return (
    <section className="bg-muted/30 py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="flex flex-col items-center text-center"
        >
          <div className="flex items-center justify-center mx-auto">
            <span className="w-10 h-0.5 bg-primary rounded-full" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary ml-3">
              The Challenge
            </span>
          </div>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground text-balance">
            Bangladesh Faces Devastating Floods Every Year
          </h2>
          <p className="mt-3 text-base text-muted-foreground max-w-lg mx-auto">
            And the systems meant to help are failing the people who need them
            most
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
        >
          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-5 border border-border text-center"
          >
            <StatCounter value={30} prefix="20-" suffix="%" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              of Bangladesh floods annually
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-5 border border-border text-center"
          >
            <StatCounter value={700} suffix="+" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              rivers across the country
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-5 border border-border text-center"
          >
            <StatCounter value={10} suffix="M+" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              people affected each monsoon
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-5 border border-border text-center"
          >
            <StatCounter value={2} prefix="~$" suffix="B" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              economic damage per year
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={problemContainerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-14"
        >
          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-6 border border-border flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl bg-destructive/8 size-12 flex items-center justify-center">
                <WifiOff className="size-6 text-destructive" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                No Centralized Information
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Flood data exists but it&apos;s scattered across government
                websites, social media, and word-of-mouth. Rural communities
                often don&apos;t know water levels until it&apos;s too late.
              </p>
            </div>
            <p className="mt-3 text-xs font-medium text-destructive">
              → Delayed evacuations cost lives
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-6 border border-border flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl bg-destructive/8 size-12 flex items-center justify-center">
                <MapPinOff className="size-6 text-destructive" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                Shelter Chaos
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                When floods hit, people don&apos;t know where shelters are,
                whether they have capacity, or what facilities are available.
                Families wander in chest-deep water searching for safety.
              </p>
            </div>
            <p className="mt-3 text-xs font-medium text-destructive">
              → Overcrowded shelters, underserved areas
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-xl p-6 border border-border flex flex-col justify-between"
          >
            <div>
              <div className="rounded-xl bg-destructive/8 size-12 flex items-center justify-center">
                <PhoneOff className="size-6 text-destructive" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                No Rescue Coordination
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Stranded people rely on phone calls to relatives or social media
                posts. There&apos;s no structured system for sending GPS-located
                rescue requests or tracking response status.
              </p>
            </div>
            <p className="mt-3 text-xs font-medium text-destructive">
              → Duplicated efforts, missed rescues
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 text-center flex flex-col items-center"
        >
          <span className="text-4xl text-primary/15 font-serif block leading-none">
            &ldquo;
          </span>
          <p className="text-lg text-foreground italic max-w-2xl mx-auto leading-relaxed -mt-2">
            In the 2024 Feni floods, many people told us they didn&apos;t
            receive any warning. They woke up to water inside their homes.
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            — Field research, Noakhali District, 2024
          </p>
        </motion.div>
      </div>
    </section>
  );
}
