"use client";

import {
  MapPin,
  UtensilsCrossed,
  Droplets,
  Plus,
  Zap,
  Bath,
  Phone,
  Navigation,
  ArrowRight,
  Home,
} from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useShelters } from "@/lib/hooks/use-shelters";
import type { Shelter } from "@/lib/types/api";
import { useT } from "@/lib/i18n/use-t";

const facilityMeta = [
  { key: "hasFood" as const, icon: UtensilsCrossed, label: "Food", labelBn: "খাবার" },
  { key: "hasWater" as const, icon: Droplets, label: "Water", labelBn: "পানি" },
  { key: "hasMedical" as const, icon: Plus, label: "Medical", labelBn: "চিকিৎসা" },
  { key: "hasElectricity" as const, icon: Zap, label: "Power", labelBn: "বিদ্যুৎ" },
  { key: "hasToilet" as const, icon: Bath, label: "Toilet", labelBn: "শৌচাগার" },
];

const RING_RADIUS = 30;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.14 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

function statusThemeFor(occupancyRate: number) {
  if (occupancyRate >= 80) {
    return {
      label: "Near Capacity",
      labelBn: "প্রায় পূর্ণ",
      tint: "bg-linear-to-br from-[oklch(0.64_0.22_22)] to-[oklch(0.5_0.21_10)]",
      text: "text-destructive",
      ring: "stroke-destructive",
      solid: "bg-destructive",
      hoverBorder: "hover:border-destructive/40",
    };
  }
  if (occupancyRate >= 50) {
    return {
      label: "Filling Fast",
      labelBn: "দ্রুত পূর্ণ হচ্ছে",
      tint: "bg-linear-to-br from-[oklch(0.8_0.16_72)] to-[oklch(0.66_0.19_45)]",
      text: "text-amber-600 dark:text-amber-500",
      ring: "stroke-amber-500",
      solid: "bg-amber-500",
      hoverBorder: "hover:border-amber-500/40",
    };
  }
  return {
    label: "Open",
    labelBn: "খোলা",
    tint: "bg-linear-to-br from-[oklch(0.7_0.15_165)] to-[oklch(0.52_0.12_190)]",
    text: "text-emerald-600 dark:text-emerald-500",
    ring: "stroke-emerald-500",
    solid: "bg-emerald-500",
    hoverBorder: "hover:border-emerald-500/40",
  };
}

function ShelterCard({ shelter }: { shelter: Shelter }) {
  const { pick, tr, num } = useT();
  const occupancyRate = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
  const status = statusThemeFor(occupancyRate);
  const dashOffset = RING_CIRCUMFERENCE * (1 - occupancyRate / 100);
  const location = `${shelter.address}, ${pick(shelter.district.nameEn, shelter.district.nameBn)}`;

  return (
    <motion.div
      variants={cardVariants}
      className="group relative overflow-hidden h-full rounded-[1.75rem] flex flex-col bg-card shadow-soft ring-1 ring-border/70 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-lift"
    >
      <div className={`relative overflow-hidden px-6 pt-6 pb-10 text-white ${status.tint}`}>
        <div className="absolute inset-0 bg-dots opacity-35" aria-hidden />
        <Home
          className="absolute -right-3 -top-3 h-28 w-28 text-white/15 rotate-[-8deg] pointer-events-none transition-transform duration-500 group-hover:rotate-0 group-hover:scale-105"
          strokeWidth={1.5}
        />
        <span
          className="relative inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-white bg-white/20 ring-1 ring-white/30 backdrop-blur-xs"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          {tr(status.label, status.labelBn)}
        </span>

        <h3 className="relative text-lg font-extrabold text-white leading-snug mt-3 pr-14">
          {pick(shelter.name, shelter.nameBn)}
        </h3>
        <div className="relative flex items-center gap-1 text-white/80 mt-1">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="text-xs font-medium truncate">{location}</span>
        </div>
      </div>

      <div className="relative flex flex-col justify-between h-full flex-1 gap-5 p-5 -mt-6">
        <div className="flex items-center gap-4 rounded-2xl bg-card p-3.5 shadow-soft ring-1 ring-border/70">
          <div className="relative h-16 w-16 shrink-0">
            <svg viewBox="0 0 72 72" className="h-16 w-16 -rotate-90">
              <circle cx="36" cy="36" r={RING_RADIUS} fill="none" strokeWidth="6" className="stroke-muted" />
              <motion.circle
                cx="36"
                cy="36"
                r={RING_RADIUS}
                fill="none"
                strokeWidth="6"
                strokeLinecap="round"
                className={status.ring}
                style={{ strokeDasharray: RING_CIRCUMFERENCE }}
                initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                whileInView={{ strokeDashoffset: dashOffset }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-foreground tabular-nums">
              {num(occupancyRate)}%
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {tr("Capacity", "ধারণক্ষমতা")}
            </span>
            <span className="text-lg font-extrabold text-foreground tabular-nums leading-none">
              {num(shelter.currentOccupancy)}
              <span className="text-sm font-semibold text-muted-foreground"> / {num(shelter.capacity)}</span>
            </span>
            <span className="text-[11px] text-muted-foreground mt-0.5">
              {tr("people currently sheltered", "জন বর্তমানে আশ্রয়ে আছেন")}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {facilityMeta.map(({ key, icon: Icon, label, labelBn }) => {
            const available = shelter[key];
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                  available
                    ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground/50 line-through"
                }`}
              >
                <Icon className="h-3 w-3 shrink-0" />
                {tr(label, labelBn)}
              </span>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <Button className="flex-1" nativeButton={false} render={<a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shelter.name + ", " + location)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5" />}>
              <Navigation className="h-3.5 w-3.5 shrink-0" />
              {tr("Directions", "দিকনির্দেশনা")}
            </Button>

          {shelter.contactPhone && (
            <Button variant="outline" className="flex-1" nativeButton={false} render={<a href={`tel:${shelter.contactPhone}`} className="flex items-center justify-center gap-1.5" />}>
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {tr("Call", "কল করুন")}
              </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedShelters() {
  const { tr } = useT();
  const { data, isLoading } = useShelters({ limit: 3 });
  const shelters = data?.data ?? [];

  return (
    <section className="relative my-6 md:my-20 w-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
        <div className="flex flex-row items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              {tr("Safe places", "নিরাপদ স্থান")}
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {tr("Open", "খোলা")} <span className="text-brand">{tr("Shelters", "আশ্রয়কেন্দ্র")}</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-2">
              {tr(
                "Emergency shelters currently accepting people — live capacity",
                "বর্তমানে মানুষ গ্রহণ করছে এমন জরুরি আশ্রয়কেন্দ্র — সরাসরি ধারণক্ষমতার তথ্য",
              )}
            </p>
          </div>

          <div className="hidden md:block shrink-0">
            <Button nativeButton={false} className="rounded-full px-5" render={<Link href="/shelters" className="flex items-center gap-1.5" />}>
                {tr("View All Shelters", "সব আশ্রয়কেন্দ্র দেখুন")}
                <ArrowRight className="h-4 w-4" />
              </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        ) : shelters.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch"
          >
            {shelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/10">
            <Home className="h-10 w-10 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mt-3">
              {tr("No shelters open right now.", "এই মুহূর্তে কোনো আশ্রয়কেন্দ্র খোলা নেই।")}
            </p>
          </div>
        )}

        <div className="block md:hidden w-full">
          <Button variant="outline" size="lg" className="w-full font-bold" nativeButton={false} render={<Link href="/shelters" className="flex items-center justify-center gap-1.5" />}>
              {tr("View All Shelters", "সব আশ্রয়কেন্দ্র দেখুন")}
              <ArrowRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    </section>
  );
}
