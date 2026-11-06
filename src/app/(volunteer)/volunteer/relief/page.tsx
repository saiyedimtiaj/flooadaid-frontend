"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  PackageCheck,
  PackagePlus,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/dashboard/pagination";
import { usePaged } from "@/components/dashboard/list-toolbar";
import { useReliefAssignments, useDeliverAssignment, type ReliefAssignment } from "@/lib/hooks/use-relief";
import { useShelters } from "@/lib/hooks/use-shelters";
import { timeAgo } from "@/lib/format-time-ago";
import { cn } from "@/lib/utils";

const URGENCY_CHIP: Record<string, string> = {
  CRITICAL: "bg-destructive/10 text-destructive",
  HIGH: "bg-amber-500/12 text-amber-700",
  MEDIUM: "bg-sky-500/10 text-sky-700",
  LOW: "bg-muted text-muted-foreground",
};

function HoldingCard({
  a,
  shelters,
}: {
  a: ReliefAssignment;
  shelters: { id: string; name: string; district: { nameEn: string } }[];
}) {
  const deliver = useDeliverAssignment();
  const [target, setTarget] = useState(a.supplyRequest?.shelter.id ?? a.shelterId ?? "");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex items-start gap-4 p-5">
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-lime">
          <Package className="h-7 w-7" />
          <span className="absolute -right-1.5 -top-1.5 h-4 w-4 rounded-full bg-lime ring-4 ring-card" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-muted-foreground">Holding since {timeAgo(a.createdAt)}</p>
          <p className="mt-0.5 truncate text-lg font-bold text-foreground">{a.item}</p>
          <p className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
            {a.quantity.toLocaleString()}
            <span className="ml-1 text-base font-medium text-muted-foreground">{a.unit}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-5 pb-4">
        {a.supplyRequest && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm">
            <span className="inline-flex min-w-0 items-center gap-1.5 truncate text-foreground">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <span className="truncate">Requested by {a.supplyRequest.shelter.name}</span>
            </span>
            <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold", URGENCY_CHIP[a.supplyRequest.urgency])}>
              {a.supplyRequest.urgency.toLowerCase()}
            </span>
          </div>
        )}
        {a.note && <p className="text-sm italic text-muted-foreground">&ldquo;{a.note}&rdquo;</p>}
      </div>

      <div className="mt-auto flex flex-col gap-2 border-t border-border bg-muted/40 p-3 sm:flex-row">
        <SearchableSelect
          value={target}
          onValueChange={setTarget}
          options={shelters.map((s) => ({ value: s.id, label: s.name, description: s.district.nameEn, keywords: s.district.nameEn }))}
          placeholder="Choose a shelter…"
          searchPlaceholder="Search shelter or district…"
        />
        <Button
          className="h-11 shrink-0"
          disabled={!target || deliver.isPending}
          onClick={() => deliver.mutate({ id: a.id, shelterId: target })}
        >
          <Truck className="h-4 w-4 text-lime" />
          Mark delivered
        </Button>
      </div>
    </div>
  );
}

export default function VolunteerReliefPage() {
  const { data: assignments, isLoading } = useReliefAssignments({ mine: true });
  const { data: shelterData } = useShelters({ limit: 100 });
  const shelters = useMemo(() => shelterData?.data ?? [], [shelterData]);

  const holding = useMemo(() => (assignments ?? []).filter((a) => a.status === "ASSIGNED"), [assignments]);
  const delivered = useMemo(
    () =>
      (assignments ?? [])
        .filter((a) => a.status === "DELIVERED")
        .sort((x, y) => new Date(y.deliveredAt ?? y.createdAt).getTime() - new Date(x.deliveredAt ?? x.createdAt).getTime()),
    [assignments],
  );
  const history = usePaged(delivered, 6, delivered.length);
  const unitsHeld = holding.reduce((n, a) => n + a.quantity, 0);
  const sheltersReached = new Set(delivered.map((a) => a.shelterId).filter(Boolean)).size;
  const neediest = [...shelters]
    .filter((s) => s.capacity > 0)
    .sort((x, y) => y.currentOccupancy / y.capacity - x.currentOccupancy / x.capacity)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Package}
        title="My Relief"
        description="Supplies you are carrying, and the shelters you have delivered to."
        action={
          <Button variant="outline" nativeButton={false} render={<Link href="/volunteer/supply-requests" />}>
            <PackagePlus className="h-4 w-4" />
            Request supplies
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Items holding" value={holding.length} icon={Package} isLoading={isLoading} highlight />
        <StatCard label="Units on hand" value={unitsHeld} icon={Boxes} isLoading={isLoading} />
        <StatCard label="Deliveries done" value={delivered.length} icon={PackageCheck} isLoading={isLoading} />
        <StatCard label="Shelters reached" value={sheltersReached} icon={Building2} isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <section className="flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Ready to deliver</h2>
            <Badge variant="neutral">{holding.length} item{holding.length === 1 ? "" : "s"}</Badge>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5">
                  <div className="flex gap-4">
                    <Skeleton className="h-14 w-14 rounded-2xl" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : holding.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {holding.map((a) => (
                <HoldingCard key={a.id} a={a} shelters={shelters} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-card">
              <EmptyState
                icon={PackageCheck}
                title="All delivered"
                description="You are not carrying any relief right now. New assignments from the relief team will show up here."
                action={
                  <Button variant="outline" nativeButton={false} render={<Link href="/volunteer/supply-requests" />}>
                    Ask for supplies
                  </Button>
                }
              />
            </div>
          )}

          <section className="rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-3 border-b border-border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Delivery history</h2>
                <p className="text-xs text-muted-foreground">Every drop-off you have completed</p>
              </div>
            </div>
            {isLoading ? (
              <div className="flex flex-col gap-4 p-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : history.pageItems.length > 0 ? (
              <ol className="relative flex flex-col gap-5 p-5 pl-12">
                <span className="absolute bottom-8 left-[1.6rem] top-8 w-px bg-border" aria-hidden />
                {history.pageItems.map((a) => (
                  <li key={a.id} className="relative">
                    <span className="absolute -left-[1.85rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary ring-4 ring-card">
                      <CheckCircle2 className="h-3 w-3 text-lime" />
                    </span>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="font-semibold text-foreground">
                        {a.quantity.toLocaleString()} {a.unit} {a.item}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {timeAgo(a.deliveredAt ?? a.createdAt)}
                      </span>
                    </div>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {a.shelter?.name ?? "Shelter"}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">Your completed deliveries will be listed here.</p>
            )}
            {history.total > 6 && (
              <div className="border-t border-border p-4">
                <Pagination page={history.page} totalPages={history.totalPages} total={history.total} pageSize={6} onChange={history.setPage} />
              </div>
            )}
          </section>
        </section>

        <aside className="flex flex-col gap-6">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-bold text-foreground">Shelters that need help most</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">By how full they are right now</p>
            <div className="mt-4 flex flex-col gap-3">
              {shelters.length === 0
                ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)
                : neediest.map((s) => {
                    const rate = Math.round((s.currentOccupancy / s.capacity) * 100);
                    return (
                      <div key={s.id} className="rounded-xl border border-border p-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-foreground">{s.name}</p>
                          <span className={cn("text-sm font-bold tabular-nums", rate >= 80 ? "text-destructive" : rate >= 50 ? "text-amber-600" : "text-emerald-600")}>
                            {rate}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{s.district.nameEn}</p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                          <div
                            className={cn("h-full rounded-full", rate >= 80 ? "bg-destructive" : rate >= 50 ? "bg-amber-500" : "bg-emerald-500")}
                            style={{ width: `${Math.min(100, rate)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>
          </section>

          <section className="rounded-2xl bg-primary p-5 text-primary-foreground">
            <Truck className="h-7 w-7 text-lime" />
            <h2 className="mt-3 text-lg font-bold">Delivery checklist</h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-white/80">
              <li>Count items with the shelter manager</li>
              <li>Ask for the head count of families served</li>
              <li>Mark the delivery here before you leave</li>
            </ul>
            <Link href="/volunteer/supply-requests" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-lime hover:underline">
              Shelter short on something? Request it
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
