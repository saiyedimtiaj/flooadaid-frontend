"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BatteryCharging,
  Check,
  Copy,
  Megaphone,
  Mountain,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  UserCheck,
  Waves,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { NearbyHelpPanel } from "@/components/sos/nearby-help-panel";
import { MySosRequests } from "@/components/sos/my-sos-requests";
import { timeAgo } from "@/lib/format-time-ago";
import { useT } from "@/lib/i18n/use-t";
import type { SosStatus, SosTracking } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { EmergencyNumbers } from "./sos-summary";

const STEPS: SosStatus[] = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];

const TIPS = [
  { icon: Mountain, key: "sos.tip1" },
  { icon: BatteryCharging, key: "sos.tip2" },
  { icon: Megaphone, key: "sos.tip3" },
  { icon: Waves, key: "sos.tip4" },
] as const;

export function SOSSuccess({
  sosId,
  sos,
  isLoading,
  summary,
  location,
  onNew,
}: {
  sosId: string;
  sos: SosTracking | undefined;
  isLoading: boolean;
  summary: { people: string | null; help: string[]; address: string };
  location: { lat: number; lng: number } | null;
  onNew: () => void;
}) {
  const { t, lang } = useT();
  const [copied, setCopied] = useState(false);
  const status = sos?.status ?? "PENDING";
  const current = status === "CANCELLED" ? -1 : STEPS.indexOf(status);
  const historyAt = (s: SosStatus) => sos?.history?.find((h) => h.status === s)?.createdAt;
  const trackerUrl = typeof window !== "undefined" ? `${window.location.origin}/tracker?id=${sosId}` : `/tracker?id=${sosId}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(sosId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: "FloodAid SOS", text: t("sos.shareText"), url: trackerUrl }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(trackerUrl).catch(() => undefined);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-12">
      <div className="flex flex-col gap-6 xl:col-span-8">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-hidden rounded-3xl border border-border bg-card"
        >
          <div className="relative overflow-hidden bg-primary px-6 py-8 text-primary-foreground md:px-10 md:py-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" aria-hidden />
            <div className="pointer-events-none absolute -right-4 -top-4 h-40 w-40 rounded-full border border-white/10" aria-hidden />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative h-20 w-20 shrink-0">
                <motion.span
                  className="absolute inset-0 rounded-full bg-lime/30"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
                  className="relative flex h-20 w-20 items-center justify-center rounded-full bg-lime text-lime-foreground"
                >
                  <Check className="h-10 w-10" strokeWidth={3} />
                </motion.span>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{t("sos.success.title")}</h1>
                <p className="mt-2 max-w-xl text-white/75 md:text-lg">{t("sos.success.body")}</p>
              </div>
            </div>

            <div className="relative mt-8 flex flex-col gap-3 rounded-2xl bg-white/8 p-4 ring-1 ring-white/12 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{t("sos.saveId")}</p>
                <p className="mt-1 truncate font-mono text-lg font-bold tracking-wide text-lime">{sosId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-primary transition hover:bg-white/90"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? t("sos.copied") : t("sos.copy")}
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4" />
                  {t("sos.share")}
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-foreground">{t("sos.liveStatus")}</h2>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                {t("sos.autoUpdate")}
              </span>
            </div>

            {isLoading && !sos ? (
              <div className="mt-6 grid grid-cols-4 gap-3">
                {STEPS.map((s) => (
                  <Skeleton key={s} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : status === "CANCELLED" ? (
              <p className="mt-5 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">{t("tracker.status.CANCELLED")}</p>
            ) : (
              <ol className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
                {STEPS.map((s, i) => {
                  const reached = i <= current;
                  const isNow = i === current;
                  const at = historyAt(s);
                  return (
                    <li
                      key={s}
                      className={cn(
                        "relative flex items-center gap-3 rounded-2xl border p-4 sm:flex-col sm:items-start",
                        isNow ? "border-primary bg-accent/50" : reached ? "border-border bg-muted/40" : "border-dashed border-border",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                          reached ? "bg-primary text-lime" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {reached && !isNow ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                      </span>
                      <div>
                        <p className={cn("text-sm font-semibold", reached ? "text-foreground" : "text-muted-foreground")}>
                          {t(`tracker.status.${s}`)}
                        </p>
                        <p className="text-xs text-muted-foreground">{at ? timeAgo(at, lang) : isNow ? t("sos.inProgressNow") : "—"}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            {sos?.assignedTo && (
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4">
                <UserCheck className="h-6 w-6 text-emerald-600" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{sos.assignedTo.name}</span> {t("sos.my.onIt")}
                </p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">{t("sos.summaryPeople")}</p>
                <p className="mt-1 font-semibold text-foreground">{summary.people ?? "—"}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">{t("sos.summaryHelp")}</p>
                <p className="mt-1 font-semibold capitalize text-foreground">{summary.help.join(", ") || "—"}</p>
              </div>
              <div className="rounded-2xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">{t("sos.summaryLocation")}</p>
                <p className="mt-1 truncate font-semibold text-foreground">
                  {summary.address || (location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "—")}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link
                href={`/tracker?id=${sosId}`}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                {t("sos.openTracker")}
                <ArrowRight className="h-4 w-4 text-lime" />
              </Link>
              <a
                href="tel:999"
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-destructive px-5 text-sm font-semibold text-white transition hover:brightness-110"
              >
                <Phone className="h-4 w-4" />
                {t("sos.call999")}
              </a>
              <button
                type="button"
                onClick={onNew}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-border px-5 text-sm font-semibold text-foreground transition hover:bg-muted"
              >
                <Plus className="h-4 w-4" />
                {t("sos.another")}
              </button>
            </div>
          </div>
        </motion.section>

        <section className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{t("sos.waitTips")}</h2>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TIPS.map((tip) => (
              <div key={tip.key} className="flex items-start gap-3 rounded-2xl border border-border p-4">
                <tip.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm text-foreground/85">{t(tip.key)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <aside className="flex flex-col gap-6 xl:sticky xl:top-28 xl:col-span-4">
        <NearbyHelpPanel location={location} />
        <MySosRequests compact />
        <EmergencyNumbers />
      </aside>
    </div>
  );
}
