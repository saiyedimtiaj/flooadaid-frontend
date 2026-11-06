"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ClipboardList, Clock, MapPin, Search, UserCheck, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useMySosRequests, useTrackMany } from "@/lib/hooks/use-sos";
import { forgetSosId, readMySosIds } from "@/lib/my-sos-store";
import { ApiError } from "@/lib/api-client";
import { timeAgo } from "@/lib/format-time-ago";
import { useT } from "@/lib/i18n/use-t";
import type { SosStatus } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const STEP: Record<SosStatus, number> = { PENDING: 1, ASSIGNED: 2, IN_PROGRESS: 3, RESOLVED: 4, CANCELLED: 0 };

const CHIP: Record<SosStatus, string> = {
  PENDING: "bg-amber-500/12 text-amber-700",
  ASSIGNED: "bg-sky-500/12 text-sky-700",
  IN_PROGRESS: "bg-violet-500/12 text-violet-700",
  RESOLVED: "bg-emerald-500/12 text-emerald-700",
  CANCELLED: "bg-muted text-muted-foreground",
};

interface Row {
  id: string;
  status: SosStatus;
  district?: string;
  people: string;
  createdAt: string;
  volunteer?: string | null;
}

const subscribe = (cb: () => void) => {
  window.addEventListener("storage", cb);
  window.addEventListener("floodaid:sos-saved", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("floodaid:sos-saved", cb);
  };
};
const snapshot = () => readMySosIds().join(",");

export function MySosRequests({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { t, lang } = useT();
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: mine, isLoading: mineLoading } = useMySosRequests(!!user);
  const stored = useSyncExternalStore(subscribe, snapshot, () => "");
  const localIds = useMemo(() => (stored ? stored.split(",") : []), [stored]);
  const extraIds = useMemo(() => localIds.filter((id) => !(mine ?? []).some((m) => m.id === id)), [localIds, mine]);
  const tracked = useTrackMany(extraIds);
  const [lookup, setLookup] = useState("");

  useEffect(() => {
    tracked.forEach((q, i) => {
      if (q.error instanceof ApiError && q.error.status === 404) {
        forgetSosId(extraIds[i]);
        window.dispatchEvent(new Event("floodaid:sos-saved"));
      }
    });
  }, [tracked, extraIds]);

  const rows: Row[] = useMemo(() => {
    const fromServer: Row[] = (mine ?? []).map((s) => ({
      id: s.id,
      status: s.status,
      district: s.district?.nameEn,
      people: s.peopleCount,
      createdAt: s.createdAt,
      volunteer: s.assignedTo?.name,
    }));
    const fromLocal: Row[] = tracked
      .map((q) => q.data)
      .filter((d): d is NonNullable<typeof d> => !!d)
      .map((d) => ({
        id: d.id,
        status: d.status,
        district: d.district?.nameEn,
        people: d.peopleCount,
        createdAt: d.createdAt,
        volunteer: d.assignedTo?.name,
      }));
    return [...fromServer, ...fromLocal].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [mine, tracked]);

  const pending = ((!!user && mineLoading) ? 1 : 0) + tracked.filter((q) => q.isLoading).length;
  const active = rows.filter((r) => r.status !== "RESOLVED" && r.status !== "CANCELLED").length;

  return (
    <section id="my-requests" className={cn("scroll-mt-28 overflow-hidden rounded-3xl border border-border bg-card", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lime">
            <ClipboardList className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-bold text-foreground">{t("sos.my.title")}</h2>
            <p className="text-xs text-muted-foreground">
              {rows.length > 0 ? t("sos.my.activeCount").replace("{n}", String(active)) : t("sos.my.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-4">
        {rows.length === 0 && pending > 0 ? (
          Array.from({ length: Math.min(pending, 3) }).map((_, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl border border-border p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-28 rounded-full bg-muted-foreground/15" />
                <Skeleton className="h-3.5 w-14 bg-muted-foreground/15" />
              </div>
              <Skeleton className="h-4 w-40 bg-muted-foreground/15" />
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 4 }).map((__, j) => (
                  <Skeleton key={j} className="h-1.5 rounded-full bg-muted-foreground/15" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{t("sos.my.loading")}</p>
            </div>
          ))
        ) : rows.length > 0 ? (
          rows.slice(0, compact ? 3 : 10).map((r) => {
            const step = STEP[r.status];
            return (
              <Link
                key={r.id}
                href={`/tracker?id=${r.id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", CHIP[r.status])}>
                    {t(`tracker.status.${r.status}`)}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {timeAgo(r.createdAt, lang)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {r.district ?? "—"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    {r.people}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">#{r.id.slice(-6).toUpperCase()}</span>
                </div>
                {r.status !== "CANCELLED" && (
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className={cn("h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-muted")} />
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    {r.volunteer ? (
                      <>
                        <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                        {r.volunteer.split(" ")[0]} {t("sos.my.onIt")}
                      </>
                    ) : (
                      t("sos.my.waiting")
                    )}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary">
                    {t("tracker.track")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-border px-4 py-6 text-center">
            <p className="text-sm font-semibold text-foreground">{t("sos.my.empty")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{t("sos.my.emptyHint")}</p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (lookup.trim()) router.push(`/tracker?id=${encodeURIComponent(lookup.trim())}`);
          }}
          className="flex items-center gap-2 rounded-2xl bg-muted/60 p-1.5"
        >
          <Search className="ml-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={lookup}
            onChange={(e) => setLookup(e.target.value)}
            placeholder={t("sos.my.lookup")}
            className="h-9 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="h-9 shrink-0 rounded-xl bg-primary px-3.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("tracker.track")}
          </button>
        </form>
      </div>
    </section>
  );
}
