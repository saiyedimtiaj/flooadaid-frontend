"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  RadioTower,
  ShieldCheck,
  Siren,
} from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useTransform,
  type Variants,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePublicSummary } from "@/lib/hooks/use-stats";
import { useT } from "@/lib/i18n/use-t";

interface MetricItem {
  id: string;
  target: number;
  label: string;
}

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format: (value: number | string) => string;
}) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => format(Math.floor(latest)));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!isInView) return;

    const controls = animate(count, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [count, isInView, value]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function HeroSection() {
  const { data: summary } = usePublicSummary();
  const { t, tr, num } = useT();

  const metrics: MetricItem[] = [
    {
      id: "sheltered",
      target: summary?.peopleSheltered ?? 0,
      label: t("hero.sheltered"),
    },
    {
      id: "shelters",
      target: summary?.sheltersOpen ?? 0,
      label: t("hero.shelters"),
    },
    {
      id: "districts",
      target: summary?.districtsOnAlert ?? 0,
      label: t("hero.districts"),
    },
    {
      id: "rescues",
      target: summary?.sosResolved ?? 0,
      label: t("hero.rescues"),
    },
  ];

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 18 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay,
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#f3f9f6] pt-28 sm:pt-32 lg:pt-36">
      <div
        className="pointer-events-none absolute -left-28 top-20 size-96 rounded-full bg-emerald-200/45 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-36 top-8 size-[34rem] rounded-full bg-sky-200/45 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(to_right,rgba(15,67,54,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,67,54,0.045)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 pb-24 sm:px-6 sm:pb-28 lg:px-8 lg:pb-32">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(480px,1.08fr)] lg:gap-16">
          <div className="relative z-10 text-center lg:text-left">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.1}
              className="inline-flex items-center gap-2.5 rounded-full border border-emerald-800/10 bg-white/80 px-3.5 py-2 shadow-sm shadow-emerald-950/5 backdrop-blur-xl"
            >
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-900">
                {t("hero.live")}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.2}
              className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.045em] text-[#123b31] sm:text-5xl md:text-6xl lg:mx-0 lg:text-[4.5rem]"
            >
              {t("hero.title")}
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.3}
              className="mt-6 text-lg font-bold text-emerald-700 sm:text-xl"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.p
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.4}
              className="mx-auto mt-4 max-w-xl text-pretty text-base leading-7 text-slate-600 sm:text-lg sm:leading-8 lg:mx-0"
            >
              {t("hero.body")}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row lg:justify-start"
            >
              <Button
                size="lg"
                className="h-13 w-full rounded-xl bg-[#164f40] px-6 font-semibold text-white shadow-lg shadow-emerald-950/15 transition-all hover:-translate-y-0.5 hover:bg-[#103e33] hover:shadow-xl sm:w-auto"
                nativeButton={false}
                render={<Link href="/shelters" className="inline-flex items-center gap-2" />}
              >
                <MapPin className="size-4.5 shrink-0" />
                <span>{t("hero.findShelter")}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="group h-13 w-full rounded-xl border-emerald-900/15 bg-white/80 px-6 font-semibold text-[#164f40] shadow-sm backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-emerald-800/25 hover:bg-white sm:w-auto"
                nativeButton={false}
                render={<Link href="/alerts" className="inline-flex items-center gap-2" />}
              >
                <span>{t("hero.liveMap")}</span>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={0.6}
              className="mt-7 flex items-center justify-center gap-3 text-sm text-slate-500 lg:justify-start"
            >
              <ShieldCheck className="size-4.5 text-emerald-600" />
              <span>
                {tr(
                  "Verified alerts and coordinated emergency response",
                  "যাচাইকৃত সতর্কতা ও সমন্বিত জরুরি সাড়া",
                )}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-2xl lg:mx-0"
          >
            <div
              className="absolute -inset-3 rounded-[2.4rem] border border-emerald-900/8 bg-white/35"
              aria-hidden="true"
            />
            <div className="relative h-[470px] overflow-hidden rounded-[2rem] bg-emerald-900 shadow-[0_32px_80px_-34px_rgba(15,67,54,0.48)] sm:h-[560px] lg:h-[620px]">
              <Image
                src="/images/hero-bg.jpg"
                alt={tr(
                  "Aerial view of a flood-affected community in Bangladesh",
                  "বাংলাদেশের একটি বন্যাকবলিত জনপদের আকাশ থেকে দেখা দৃশ্য",
                )}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 54vw"
                className="object-cover object-center brightness-110 saturate-[0.9]"
              />
              <div
                className="absolute inset-0 bg-linear-to-t from-[#082b24]/75 via-transparent to-sky-100/10"
                aria-hidden="true"
              />
              <div
                className="absolute inset-0 ring-1 ring-inset ring-white/20"
                aria-hidden="true"
              />

              <div className="absolute left-4 top-4 rounded-2xl border border-white/60 bg-white/88 p-3.5 shadow-lg shadow-emerald-950/10 backdrop-blur-xl sm:left-6 sm:top-6 sm:p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <RadioTower className="size-5" />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                      {tr("Response network", "সাড়া প্রদান নেটওয়ার্ক")}
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-slate-800">
                      {tr("Monitoring across Bangladesh", "সারা বাংলাদেশ পর্যবেক্ষণে")}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/sos"
                className="group absolute right-4 top-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-950/25 transition-all hover:-translate-y-0.5 hover:bg-red-700 sm:right-6 sm:top-6"
              >
                <Siren className="size-4 animate-pulse" />
                <span className="hidden sm:inline">{t("hero.sos")}</span>
                <span className="sm:hidden">SOS</span>
              </Link>

              <div className="absolute inset-x-4 bottom-4 overflow-hidden rounded-2xl border border-white/50 bg-white/90 shadow-xl shadow-emerald-950/15 backdrop-blur-xl sm:inset-x-6 sm:bottom-6">
                <div className="grid grid-cols-2 sm:grid-cols-4">
                  {metrics.map((item, index) => (
                    <div
                      key={item.id}
                      className={`px-3 py-3.5 text-center sm:px-2 sm:py-4 ${
                        index % 2 === 0 ? "border-r border-emerald-900/10" : ""
                      } ${index < 2 ? "border-b border-emerald-900/10 sm:border-b-0" : ""} ${
                        index === 1 || index === 2 ? "sm:border-r sm:border-emerald-900/10" : ""
                      }`}
                    >
                      <div className="text-xl font-extrabold tracking-tight text-[#123b31] sm:text-2xl">
                        <AnimatedNumber value={item.target} format={num} />
                      </div>
                      <div className="mt-1 text-[9px] font-bold uppercase leading-3 tracking-[0.1em] text-slate-500 sm:text-[10px]">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-7 -right-7 -z-10 hidden size-36 rounded-full border-[22px] border-lime/35 lg:block"
              aria-hidden="true"
            />
          </motion.div>
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-b from-transparent to-background"
        aria-hidden="true"
      />
    </section>
  );
}
