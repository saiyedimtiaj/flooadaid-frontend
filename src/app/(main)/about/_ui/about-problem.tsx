"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  type Variants,
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

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const problemContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const problems = [
  {
    icon: WifiOff,
    title: "No Centralized Information",
    description:
      "Flood data exists but it's scattered across government websites, social media, and word-of-mouth. Rural communities often don't know water levels until it's too late.",
    consequence: "Delayed evacuations cost lives",
  },
  {
    icon: MapPinOff,
    title: "Shelter Chaos",
    description:
      "When floods hit, people don't know where shelters are, whether they have capacity, or what facilities are available. Families wander in chest-deep water searching for safety.",
    consequence: "Overcrowded shelters, underserved areas",
  },
  {
    icon: PhoneOff,
    title: "No Rescue Coordination",
    description:
      "Stranded people rely on phone calls to relatives or social media posts. There's no structured system for sending GPS-located rescue requests or tracking response status.",
    consequence: "Duplicated efforts, missed rescues",
  },
];

export default function AboutProblem() {
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
            className="bg-background rounded-2xl p-5 border border-border text-center"
          >
            <StatCounter value={30} prefix="20-" suffix="%" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              of Bangladesh floods annually
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-2xl p-5 border border-border text-center"
          >
            <StatCounter value={700} suffix="+" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              rivers across the country
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-2xl p-5 border border-border text-center"
          >
            <StatCounter value={10} suffix="M+" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              people affected each monsoon
            </p>
          </motion.div>

          <motion.div
            variants={cardVariants}
            className="bg-background rounded-2xl p-5 border border-border text-center"
          >
            <StatCounter value={2} prefix="~$" suffix="B" />
            <p className="text-xs text-muted-foreground mt-1 leading-snug">
              economic damage per year
            </p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-14 items-stretch">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={problemContainerVariants}
            className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4"
          >
            {problems.map((problem) => {
              const Icon = problem.icon;
              return (
                <motion.div
                  key={problem.title}
                  variants={cardVariants}
                  className="group bg-background rounded-2xl p-6 border border-border flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:border-destructive/25"
                >
                  <div>
                    <div className="rounded-xl bg-destructive/8 size-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-6 text-destructive" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground">
                      {problem.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                  <p className="mt-3 text-xs font-medium text-destructive">
                    → {problem.consequence}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 relative rounded-2xl overflow-hidden ring-1 ring-border shadow-lg min-h-70"
          >
            <Image
              src="/images/about/problem-water.jpg"
              alt="A woman and boy collect drinking water from a raised tap surrounded by floodwater"
              fill
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, oklch(0.1 0.02 247 / 0.85) 0%, oklch(0.1 0.02 247 / 0.15) 55%, transparent 75%)",
              }}
            />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-sm text-white font-medium leading-relaxed">
                Clean water becomes the scarcest resource — even standing in it.
              </p>
              <span className="mt-1.5 block text-[10px] text-white/50">
                Md shameem ul islam / Wikimedia Commons, CC BY 4.0
              </span>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
