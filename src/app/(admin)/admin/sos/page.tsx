"use client";

import { useState } from "react";
import { Clock, MapPin, Phone, Settings2, Siren, UserCheck, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/dashboard/pagination";
import { SosPriorityBadge, SosStatusBadge } from "@/components/dashboard/sos-status-badge";
import { DistrictFilter, FilterSelect, SearchInput, useDebounced } from "@/components/dashboard/list-toolbar";
import { useAssignSos, useSosRequests, useSosStatsSummary, useUpdateSosStatus } from "@/lib/hooks/use-sos";
import { useAssignableVolunteers } from "@/lib/hooks/use-volunteers";
import { timeAgo } from "@/lib/format-time-ago";
import type { SosPriority, SosRequest, SosStatus } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const STATUS_TABS: { value: SosStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "ASSIGNED", label: "Assigned" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_OPTIONS: SosStatus[] = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

const PRIORITY_OPTIONS = [
  { value: "CRITICAL", label: "Critical" },
  { value: "HIGH", label: "High" },
  { value: "MEDIUM", label: "Medium" },
  { value: "LOW", label: "Low" },
];

const AVATAR_TINT: Record<SosPriority, string> = {
  CRITICAL: "bg-destructive/12 text-destructive",
  HIGH: "bg-amber-500/15 text-amber-700",
  MEDIUM: "bg-sky-500/12 text-sky-700",
  LOW: "bg-muted text-muted-foreground",
};

const PAGE_SIZE = 10;

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminSosPage() {
  const [status, setStatus] = useState<SosStatus | "">("");
  const [priority, setPriority] = useState("");
  const [district, setDistrict] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const q = useDebounced(search);

  const { data, isLoading, isFetching } = useSosRequests({
    status: status || undefined,
    priority: (priority || undefined) as SosPriority | undefined,
    districtId: district ? Number(district) : undefined,
    q,
    page,
    limit: PAGE_SIZE,
  });
  const { data: stats } = useSosStatsSummary();
  const { options: volunteers } = useAssignableVolunteers();
  const updateStatus = useUpdateSosStatus();
  const assignSos = useAssignSos();
  const [managing, setManaging] = useState<SosRequest | null>(null);

  const rows = data?.data ?? [];
  const meta = data?.meta;
  const reset = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };
  const countFor = (s: SosStatus | "") => (s === "" ? stats?.total : stats?.byStatus?.[s]) ?? 0;
  const hasFilters = !!(priority || district || search);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Siren}
        title="SOS Requests"
        description="Live rescue queue, most urgent first. Refreshes every 15 seconds."
      />

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-4 border-b border-border p-4">
          <div className="flex flex-wrap gap-1 self-start rounded-3xl border border-border bg-background p-1 sm:rounded-full">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => reset(setStatus)(tab.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  status === tab.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] tabular-nums",
                    status === tab.value ? "bg-lime text-lime-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {countFor(tab.value)}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            <SearchInput
              value={search}
              onChange={reset(setSearch)}
              placeholder="Search name, phone, address or district…"
              className="lg:max-w-md"
            />
            <FilterSelect value={priority} onChange={reset(setPriority)} options={PRIORITY_OPTIONS} allLabel="All priorities" />
            <DistrictFilter value={district} onChange={reset(setDistrict)} />
            {hasFilters && (
              <Button
                variant="ghost"
                onClick={() => {
                  setPriority("");
                  setDistrict("");
                  setSearch("");
                  setPage(1);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        </div>

        <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_auto] gap-4 border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground xl:grid">
          <span>Requester</span>
          <span>Location</span>
          <span>Need</span>
          <span>Status</span>
          <span>Volunteer</span>
          <span className="w-24 text-right">Action</span>
        </div>

        <div className={cn("transition-opacity", isFetching && !isLoading && "opacity-60")}>
          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4">
                  <Skeleton className="h-11 w-11 rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                  <Skeleton className="hidden h-6 w-24 rounded-full md:block" />
                  <Skeleton className="hidden h-6 w-20 rounded-full md:block" />
                  <Skeleton className="h-10 w-24 rounded-xl" />
                </div>
              ))}
            </div>
          ) : rows.length > 0 ? (
            <ul className="divide-y divide-border">
              {rows.map((sos) => (
                <li
                  key={sos.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/40 xl:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)_minmax(0,1.2fr)_minmax(0,1.3fr)_minmax(0,1.2fr)_auto] xl:items-center xl:gap-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold", AVATAR_TINT[sos.priority])}>
                      {initials(sos.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{sos.name}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <a href={`tel:${sos.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
                          <Phone className="h-3 w-3" />
                          {sos.phone}
                        </a>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(sos.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0 text-sm">
                    <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {sos.district?.nameEn}
                    </p>
                    {sos.addressText && <p className="truncate text-xs text-muted-foreground">{sos.addressText}</p>}
                  </div>
                  <div className="text-sm">
                    <p className="inline-flex items-center gap-1.5 font-medium text-foreground">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      {sos.peopleCount} people
                    </p>
                    <p className="truncate text-xs capitalize text-muted-foreground">{sos.helpType.join(", ")}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <SosPriorityBadge priority={sos.priority} />
                    <SosStatusBadge status={sos.status} />
                  </div>
                  <div className="min-w-0 text-sm">
                    {sos.assignedTo ? (
                      <p className="inline-flex max-w-full items-center gap-1.5 truncate font-medium text-foreground">
                        <UserCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                        <span className="truncate">{sos.assignedTo.name}</span>
                      </p>
                    ) : (
                      <span className="text-xs font-medium text-muted-foreground">Unassigned</span>
                    )}
                  </div>
                  <div className="xl:w-24 xl:text-right">
                    <Button variant="outline" size="sm" className="w-full xl:w-auto" onClick={() => setManaging(sos)}>
                      <Settings2 className="h-4 w-4" />
                      Manage
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Siren}
              title={hasFilters || status ? "No matching requests" : "No SOS requests yet"}
              description={hasFilters || status ? "Try a different filter or search term." : "New requests will appear here as they come in."}
            />
          )}
        </div>

        {meta && meta.total > 0 && (
          <div className="border-t border-border p-4">
            <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} pageSize={PAGE_SIZE} onChange={setPage} />
          </div>
        )}
      </section>

      {managing && (
        <ManageDialog
          sos={rows.find((r) => r.id === managing.id) ?? managing}
          volunteers={volunteers}
          onClose={() => setManaging(null)}
          onStatus={(s) => updateStatus.mutate({ id: managing.id, status: s })}
          onAssign={(v) => assignSos.mutate({ id: managing.id, volunteerId: v })}
        />
      )}
    </div>
  );
}

function ManageDialog({
  sos,
  volunteers,
  onClose,
  onStatus,
  onAssign,
}: {
  sos: SosRequest;
  volunteers: { id: string; name: string }[];
  onClose: () => void;
  onStatus: (s: SosStatus) => void;
  onAssign: (id: string) => void;
}) {
  const photos = sos.photoUrls?.length ? sos.photoUrls : sos.photoUrl ? [sos.photoUrl] : [];
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage SOS request</DialogTitle>
          <DialogDescription>
            {sos.name} · {sos.district?.nameEn} · {timeAgo(sos.createdAt)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <a href={`tel:${sos.phone}`} className="font-semibold text-foreground hover:text-primary">
                {sos.phone}
              </a>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">People</p>
              <p className="font-semibold text-foreground">{sos.peopleCount}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-muted-foreground">Needs</p>
              <p className="font-semibold capitalize text-foreground">{sos.helpType.join(", ")}</p>
            </div>
            {sos.addressText && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Landmark</p>
                <p className="text-foreground">{sos.addressText}</p>
              </div>
            )}
            {sos.description && (
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Message</p>
                <p className="italic text-foreground">&ldquo;{sos.description}&rdquo;</p>
              </div>
            )}
          </div>

          {photos.length > 0 && (
            <div className="flex gap-2">
              {photos.slice(0, 4).map((url, idx) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`SOS photo ${idx + 1}`} className="h-16 w-16 rounded-xl border border-border object-cover" />
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <SearchableSelect
              value={sos.status}
              onValueChange={(v) => v && onStatus(v as SosStatus)}
              options={STATUS_OPTIONS.map((st) => ({ value: st, label: st.replace("_", " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }))}
              searchPlaceholder="Search status…"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Assigned volunteer</Label>
            <SearchableSelect
              value={sos.assignedToId ?? ""}
              onValueChange={(id) => id && onAssign(id)}
              options={[
                ...(sos.assignedTo && !volunteers.some((v) => v.id === sos.assignedToId)
                  ? [{ value: sos.assignedTo.id, label: sos.assignedTo.name, description: "Currently assigned" }]
                  : []),
                ...volunteers.map((v) => ({ value: v.id, label: v.name })),
              ]}
              placeholder="Choose a volunteer…"
              searchPlaceholder="Search volunteers…"
              emptyText="No verified volunteers are available right now."
            />
          </div>
        </div>
        <DialogFooter className="sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">Changes save automatically.</p>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
