"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Siren, ArrowRight, ChevronDown } from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePublicSummary } from "@/lib/hooks/use-stats";
import { useT } from "@/lib/i18n/use-t";

interface MetricItem {
  id: string;
  target: number;
  suffix: string;
  label: string;
}

function AnimatedNumber({ value, format }: { value: number; format: (value: number | string) => string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    format(Math.floor(latest).toLocaleString()),
  );
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
      });
      return () => controls.stop();
    }
  }, [isInView, count, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Exact server-side totals (the old version summed a 100-row page client-side).
  const { data: summary } = usePublicSummary();
  const { t, tr, num } = useT();

  const metricsData: MetricItem[] = [
    { id: "sheltered", target: summary?.peopleSheltered ?? 0, suffix: "", label: t("hero.sheltered") },
    { id: "shelters", target: summary?.sheltersOpen ?? 0, suffix: "", label: t("hero.shelters") },
    { id: "districts", target: summary?.districtsOnAlert ?? 0, suffix: "", label: t("hero.districts") },
    { id: "rescues", target: summary?.sosResolved ?? 0, suffix: "", label: t("hero.rescues") },
  ];

  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: delay,
      },
    }),
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-end overflow-hidden bg-slate-950"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-bg.jpg"
          alt={tr("Monsoon flood landscape overview in Bangladesh", "বাংলাদেশের বর্ষাকালের বন্যাকবলিত প্রাকৃতিক দৃশ্য")}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-opacity duration-1000"
          onError={(e) => {
            const target = e.target as HTMLElement;
            target.style.opacity = "0";
          }}
        />
        <div
          className="absolute inset-0 bg-linear-to-tr from-slate-950 via-slate-900 to-slate-950 -z-10"
          aria-hidden="true"
        />
      </div>
      <div
        className="absolute inset-0 z-10 bg-linear-to-tr from-black/90 via-black/70 to-black/35"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[20px_20px] pointer-events-none"
        aria-hidden="true"
      />

      <div
        className="absolute bottom-0 inset-x-0 h-96 z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,color-mix(in_oklch,var(--color-destructive)_12%,transparent),transparent)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-20 w-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 md:pb-24 lg:pb-28">
        <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-4xl">
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white">
              {t("hero.live")}
            </span>
          </motion.div>
          <motion.h1
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="mt-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1] text-balance"
          >
            {t("hero.title")}
          </motion.h1>

          <motion.p
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.5}
            className="mt-4 text-lg md:text-xl font-medium text-destructive drop-shadow-md"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.p
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.6}
            className="mt-4 text-base md:text-lg text-white/70 max-w-2xl leading-relaxed"
          >{t("hero.body")}</motion.p>
          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.7}
            className="mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
          >
            <Button
              className="w-full sm:w-auto h-12 md:h-13 px-6 rounded-xl bg-white text-slate-950 font-semibold transition-all duration-200 group inline-flex items-center justify-center gap-2"
              variant={"ghost"} nativeButton={false} render={<Link href="/shelters" className="inline-flex items-center gap-2" />}>
                <MapPin className="size-4 shrink-0 text-slate-950" />
                <span>{t("hero.findShelter")}</span>
              </Button>

            <Button
              variant="destructive"
              size="lg"
              className="w-full sm:w-auto h-12 md:h-13 px-6 rounded-xl bg-destructive hover:bg-destructive/90 text-destructive-foreground font-semibold transition-all duration-200 shadow-lg shadow-destructive/25 inline-flex items-center justify-center gap-2" nativeButton={false} render={<Link href="/sos" className="inline-flex items-center gap-2" />}>
                <Siren className="size-4 shrink-0 animate-pulse" />
                <span>{t("hero.sos")}</span>
              </Button>

            <Button
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto h-12 md:h-13 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-white border border-white/10 backdrop-blur-xs font-semibold transition-all duration-200 group inline-flex items-center justify-center gap-1.5" nativeButton={false} render={<Link href="/alerts" className="inline-flex items-center gap-2" />}>
                <span>{t("hero.liveMap")}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Button>
          </motion.div>

          <motion.div
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            custom={0.8}
            className="mt-12 md:mt-16 w-full pt-8 border-t border-white/10"
          >
            <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-between gap-6 md:gap-4">
              {metricsData.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center w-full md:w-auto"
                >
                  <div className="flex flex-col items-center md:items-center w-full">
                    <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-white tracking-tight">
                      <AnimatedNumber value={item.target} format={num} />
                      <span className="text-destructive ml-0.5">
                        {item.suffix}
                      </span>
                    </span>
                    <span className="mt-1 text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/50 text-center md:text-left">
                      {item.label}
                    </span>
                  </div>
                  {index < metricsData.length - 1 && (
                    <div
                      className="hidden md:block h-8 w-px bg-white/15 ml-8 lg:ml-12"
                      aria-hidden="true"
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 hidden md:flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        aria-hidden="true"
      >
        <span className="text-[9px] uppercase font-bold tracking-widest text-white/80">
          {t("hero.scroll")}
        </span>
        <ChevronDown className="size-4 text-white animate-bounce" />
      </div>
    </section>
  );
}
