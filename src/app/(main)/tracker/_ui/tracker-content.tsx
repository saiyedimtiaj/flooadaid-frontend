"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Clock,
  Copy,
  ExternalLink,
  EyeOff,
  HeartPulse,
  LifeBuoy,
  MapPin,
  Phone,
  Radio,
  SearchX,
  Search,
  ShieldCheck,
  Siren,
  Truck,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MySosRequests } from "@/components/sos/my-sos-requests";
import { EmergencyNumbers } from "@/app/(main)/sos/_ui/sos-summary";
import { useCancelOwnSos, useSosTracking } from "@/lib/hooks/use-sos";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { readMySosIds } from "@/lib/my-sos-store";
import { timeAgo } from "@/lib/format-time-ago";
import { useT } from "@/lib/i18n/use-t";
import type { SosStatus } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const STEPS: { status: SosStatus; icon: typeof Siren }[] = [
  { status: "PENDING", icon: Radio },
  { status: "ASSIGNED", icon: UserCheck },
  { status: "IN_PROGRESS", icon: Truck },
  { status: "RESOLVED", icon: ShieldCheck },
];

const STATUS_STYLE: Record<SosStatus, { chip: string; ring: string }> = {
  PENDING: { chip: "bg-amber-500/15 text-amber-300", ring: "bg-amber-400" },
  ASSIGNED: { chip: "bg-sky-500/15 text-sky-300", ring: "bg-sky-400" },
  IN_PROGRESS: { chip: "bg-violet-500/20 text-violet-200", ring: "bg-violet-400" },
  RESOLVED: { chip: "bg-lime/20 text-lime", ring: "bg-lime" },
  CANCELLED: { chip: "bg-white/10 text-white/70", ring: "bg-white/50" },
};

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("floodaid:sos-saved", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("floodaid:sos-saved", cb);
  };
};
const snapshot = () => readMySosIds().join(",");

export function TrackerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, tr, pick, num, lang } = useT();
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const stored = useSyncExternalStore(subscribe, snapshot, () => "");
  const recent = useMemo(() => (stored ? stored.split(",") : []), [stored]);
  const activeId = searchParams.get("id") ?? null;

  const { data: sos, isLoading, isError } = useSosTracking(activeId);
  const { data: user } = useCurrentUser();
  const cancel = useCancelOwnSos();

  const isOwner = !!sos && !sos.redacted && !!user && sos.userId === user.id;
  const canCancel = isOwner && sos.status !== "RESOLVED" && sos.status !== "CANCELLED";
  const current = sos ? (sos.status === "CANCELLED" ? -1 : STEPS.findIndex((s) => s.status === sos.status)) : -1;
  const historyAt = (s: SosStatus) => sos?.history?.find((h) => h.status === s)?.createdAt;

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const id = input.trim();
    if (id) router.push(`/tracker?id=${encodeURIComponent(id)}`);
  };

  const copy = async () => {
    if (!activeId) return;
    await navigator.clipboard.writeText(activeId).catch(() => undefined);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden bg-[linear-gradient(160deg,oklch(0.2_0.04_165)_0%,oklch(0.24_0.05_165)_60%,oklch(0.3_0.07_170)_100%)] px-4 pb-24 pt-28 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-dots opacity-20" aria-hidden />
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-white/10" aria-hidden />
        <div className="pointer-events-none absolute -right-8 -top-8 h-64 w-64 rounded-full border border-white/10" aria-hidden />
        <div className="container relative mx-auto max-w-5xl">
          <nav className="flex items-center gap-1 text-xs font-semibold text-white/60">
            <Link href="/" className="hover:text-white">
              {t("nav.home")}
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{t("tracker.title")}</span>
          </nav>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-lime text-lime-foreground">
              <Radio className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">{t("tracker.title")}</h1>
              <p className="mt-1.5 text-white/70 md:text-lg">{t("tracker.subtitle")}</p>
            </div>
          </div>

          <form onSubmit={lookup} className="mt-8 flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-xl sm:flex-row">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("tracker.placeholder")}
                className="h-12 w-full bg-transparent font-mono text-sm text-foreground outline-none placeholder:font-sans placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              <Search className="h-4 w-4 text-lime" />
              {t("tracker.track")}
            </button>
          </form>

          {recent.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-white/60">{t("tracker.recent")}</span>
              {recent.slice(0, 4).map((id) => (
                <Link
                  key={id}
                  href={`/tracker?id=${id}`}
                  className={cn(
                    "rounded-full px-3 py-1 font-mono text-xs ring-1 transition",
                    id === activeId ? "bg-lime text-lime-foreground ring-lime" : "bg-white/8 text-white ring-white/15 hover:bg-white/15",
                  )}
                >
                  #{id.slice(-6).toUpperCase()}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="container relative z-10 mx-auto -mt-12 max-w-5xl px-4 sm:px-6 lg:px-8">
        {!activeId ? (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
            <MySosRequests className="lg:col-span-3" />
            <section className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 lg:col-span-2">
              <h2 className="text-lg font-bold text-foreground">{t("tracker.how")}</h2>
              {STEPS.map((s, i) => (
                <div key={s.status} className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-lime">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {i + 1}. {t(`tracker.status.${s.status}`)}
                    </p>
                    <p className="text-xs text-muted-foreground">{t(`tracker.desc.${s.status}`)}</p>
                  </div>
                </div>
              ))}
              <Link
                href="/sos"
                className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-5 text-sm font-semibold text-white hover:brightness-110"
              >
                <Siren className="h-4 w-4" />
                {t("nav.getHelp")}
              </Link>
            </section>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 lg:col-span-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
              <div className="grid grid-cols-4 gap-3">
                {STEPS.map((s) => (
                  <Skeleton key={s.status} className="h-24 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-40 w-full rounded-2xl" />
            </div>
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        ) : isError || !sos ? (
          <div className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <SearchX className="h-8 w-8" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-foreground">{t("tracker.notFoundTitle")}</h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{t("tracker.notFound")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button variant="outline" nativeButton={false} render={<Link href="/tracker" />}>
                {t("sos.my.title")}
              </Button>
              <Button nativeButton={false} render={<Link href="/sos" />}>
                <Siren className="h-4 w-4 text-lime" />
                {t("nav.getHelp")}
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
            <div className="flex flex-col gap-6 lg:col-span-2">
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden rounded-3xl border border-border bg-card"
              >
                <div className="relative overflow-hidden bg-primary px-6 py-6 text-primary-foreground md:px-8">
                  <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full border border-white/10" aria-hidden />
                  <div className="relative flex flex-wrap items-center justify-between gap-3">
                    <span className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold", STATUS_STYLE[sos.status].chip)}>
                      <span className={cn("h-2 w-2 animate-pulse rounded-full", STATUS_STYLE[sos.status].ring)} />
                      {t("sos.liveStatus")}
                    </span>
                    <span className="text-xs text-white/60">
                      {t("tracker.updated")} {timeAgo(sos.updatedAt, lang)}
                    </span>
                  </div>
                  <h2 className="relative mt-4 text-3xl font-extrabold tracking-tight md:text-4xl">{t(`tracker.status.${sos.status}`)}</h2>
                  <p className="relative mt-2 max-w-xl text-white/75">{t(`tracker.desc.${sos.status}`)}</p>
                </div>

                <div className="p-6 md:p-8">
                  {sos.status === "CANCELLED" ? (
                    <p className="flex items-center gap-2 rounded-2xl bg-muted p-4 text-sm text-muted-foreground">
                      <XCircle className="h-5 w-5" />
                      {t("tracker.desc.CANCELLED")}
                    </p>
                  ) : (
                    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-4">
                      {STEPS.map((s, i) => {
                        const reached = i <= current;
                        const now = i === current;
                        const at = historyAt(s.status);
                        return (
                          <li
                            key={s.status}
                            className={cn(
                              "flex items-center gap-3 rounded-2xl border p-4 sm:flex-col sm:items-start",
                              now ? "border-primary bg-accent/50 ring-4 ring-primary/10" : reached ? "border-border bg-muted/40" : "border-dashed border-border",
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                reached ? "bg-primary text-lime" : "bg-muted text-muted-foreground",
                              )}
                            >
                              {reached && !now ? <Check className="h-5 w-5" strokeWidth={3} /> : <s.icon className="h-5 w-5" />}
                            </span>
                            <div>
                              <p className={cn("text-sm font-semibold", reached ? "text-foreground" : "text-muted-foreground")}>
                                {t(`tracker.status.${s.status}`)}
                              </p>
                              <p className="text-xs text-muted-foreground">{at ? timeAgo(at, lang) : now ? t("sos.inProgressNow") : t("tracker.next")}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ol>
                  )}

                  {sos.assignedTo && (
                    <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/8 p-4 sm:flex-row sm:items-center">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-base font-bold text-white">
                        {sos.assignedTo.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-emerald-700">{t("tracker.yourVolunteer")}</p>
                        <p className="font-semibold text-foreground">{sos.assignedTo.name}</p>
                      </div>
                      {!sos.redacted && "phone" in sos.assignedTo && sos.assignedTo.phone && (
                        <a
                          href={`tel:${sos.assignedTo.phone}`}
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                          <Phone className="h-4 w-4" />
                          {t("tracker.callVolunteer")}
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.section>

              <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
                <h2 className="text-lg font-bold text-foreground">{t("tracker.timeline")}</h2>
                <ol className="relative mt-5 flex flex-col gap-6 pl-10">
                  <span className="absolute bottom-3 left-[0.95rem] top-3 w-px bg-border" aria-hidden />
                  {[...(sos.history ?? [])].reverse().map((h, i) => (
                    <li key={h.id} className="relative">
                      <span
                        className={cn(
                          "absolute -left-10 top-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-card",
                          i === 0 ? "bg-primary text-lime" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {h.status === "RESOLVED" ? <ShieldCheck className="h-4 w-4" /> : h.status === "CANCELLED" ? <XCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                      </span>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <p className="font-semibold text-foreground">{t(`tracker.status.${h.status}`)}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(h.createdAt).toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {h.note && <p className="mt-0.5 text-sm text-muted-foreground">{h.note}</p>}
                      {h.changedBy && (
                        <p className="mt-0.5 text-xs text-muted-foreground/80">
                          {h.changedBy.name.split(" ")[0]} · {h.changedBy.role.toLowerCase()}
                        </p>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            <aside className="flex flex-col gap-6 lg:sticky lg:top-28">
              <section className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-lg font-bold text-foreground">{t("tracker.details")}</h2>
                <div className="mt-4 flex items-center gap-2 rounded-2xl bg-muted/60 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{t("tracker.reference")}</p>
                    <p className="truncate font-mono text-sm font-bold text-foreground">{sos.id}</p>
                  </div>
                  <button
                    type="button"
                    onClick={copy}
                    aria-label={tr("Copy reference ID", "রেফারেন্স আইডি কপি করুন")}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card hover:bg-muted"
                  >
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
                <dl className="mt-4 flex flex-col gap-3.5 text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <dd className="text-foreground">{sos.district && pick(sos.district.nameEn, sos.district.nameBn)}</dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <dd className="text-foreground">
                      {num(sos.peopleCount)} {t("tracker.people")}
                    </dd>
                  </div>
                  <div className="flex items-start gap-3">
                    <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <dd className="flex flex-wrap gap-1.5">
                      {sos.helpType.map((h) => (
                        <span key={h} className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground">
                          {t(`sos.help.${h}`)}
                        </span>
                      ))}
                    </dd>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <dd className="text-foreground">
                      {t("tracker.sent")} {timeAgo(sos.createdAt, lang)}
                    </dd>
                  </div>
                  {!sos.redacted && (
                    <>
                      <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <dd className="text-foreground">{sos.phone}</dd>
                      </div>
                      <a
                        href={`https://www.google.com/maps?q=${sos.latitude},${sos.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {t("tracker.openMap")}
                      </a>
                    </>
                  )}
                </dl>

                {sos.redacted && (
                  <p className="mt-5 flex items-start gap-2 rounded-2xl bg-muted/60 p-3 text-xs text-muted-foreground">
                    <EyeOff className="mt-px h-4 w-4 shrink-0" />
                    {t("tracker.privacy")}
                  </p>
                )}

                {canCancel && (
                  <Button
                    variant="destructive-outline"
                    className="mt-5 w-full"
                    isLoading={cancel.isPending}
                    onClick={() => {
                      if (window.confirm(t("tracker.cancelConfirm"))) cancel.mutate(sos.id);
                    }}
                  >
                    <XCircle className="h-4 w-4" />
                    {t("tracker.cancel")}
                  </Button>
                )}
              </section>

              <a
                href="tel:999"
                className="flex items-center gap-4 rounded-3xl bg-destructive p-5 text-white transition hover:brightness-110"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                  <HeartPulse className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-lg font-bold">{t("sos.call999")}</span>
                  <span className="block text-sm text-white/80">{t("tracker.urgent")}</span>
                </span>
              </a>
              <EmergencyNumbers />
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
