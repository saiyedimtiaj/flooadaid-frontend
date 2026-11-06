"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, ClipboardList, Home, LifeBuoy, Siren, Users } from "lucide-react";
import { usePublicSummary } from "@/lib/hooks/use-stats";
import { useT } from "@/lib/i18n/use-t";

export default function SOSHeader() {
  const { t, tr, num } = useT();
  const { data } = usePublicSummary();
  const stats = [
    { icon: Users, value: data?.verifiedVolunteers, label: t("sos.hdr.volunteers") },
    { icon: LifeBuoy, value: data?.sosResolvedToday, label: t("sos.hdr.rescuedToday") },
    { icon: Home, value: data?.sheltersOpen, label: t("sos.hdr.shelters") },
  ];

  return (
    <div className="dark relative overflow-hidden bg-[linear-gradient(160deg,oklch(0.2_0.04_165)_0%,oklch(0.26_0.09_20)_60%,oklch(0.36_0.16_22)_100%)] px-4 pb-20 pt-28 text-foreground sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-dots opacity-20" aria-hidden="true" />
      <div className="absolute -top-24 right-[8%] h-96 w-96 rounded-full bg-[oklch(0.62_0.23_25/0.35)] blur-3xl" aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="container relative mx-auto flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between"
      >
        <div className="max-w-2xl">
          <nav className="flex items-center gap-1 text-xs font-semibold text-white/60" aria-label={tr("Breadcrumb", "পৃষ্ঠা নির্দেশনা")}>
            <Link href="/" className="hover:text-white">
              {t("nav.home")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{t("nav.sos")}</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <span className="absolute inset-0 animate-ping rounded-2xl bg-destructive/40" aria-hidden />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive text-white">
                <Siren className="h-7 w-7" />
              </div>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">{t("sos.badge")}</h1>
          </div>
          <p className="mt-4 text-base leading-relaxed text-white/70 md:text-lg">{t("sos.headerBody")}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-white/6 p-2 ring-1 ring-white/10">
            {stats.map((s) => (
              <div key={s.label} className="min-w-24 rounded-xl px-3 py-2.5">
                <s.icon className="h-4 w-4 text-lime" />
                <p className="mt-1.5 text-xl font-bold tabular-nums text-white">{s.value === undefined ? "—" : num(s.value)}</p>
                <p className="text-[11px] leading-tight text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
          <a
            href="#my-requests"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[oklch(0.3_0.06_165)] transition hover:bg-white/90"
          >
            <ClipboardList className="h-4 w-4" />
            {t("sos.my.title")}
          </a>
        </div>
      </motion.div>
    </div>
  );
}
