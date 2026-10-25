"use client";

import { useMemo, useState } from "react";
import { Siren, Phone, MapPin, Search, Users, Clock, Settings2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SosStatusBadge, SosPriorityBadge } from "@/components/dashboard/sos-status-badge";
import { useAssignSos, useSosRequests, useUpdateSosStatus } from "@/lib/hooks/use-sos";
import { useAssignableVolunteers } from "@/lib/hooks/use-volunteers";
import type { SosStatus, SosRequest } from "@/lib/types/api";
import { cn } from "@/lib/utils";

const STATUS_TABS: { value: SosStatus | "ALL"; label: string; dot: string }[] = [
  { value: "ALL", label: "All", dot: "bg-primary" },
  { value: "PENDING", label: "Pending", dot: "bg-amber-500" },
  { value: "ASSIGNED", label: "Assigned", dot: "bg-sky-500" },
  { value: "IN_PROGRESS", label: "In Progress", dot: "bg-violet-500" },
  { value: "RESOLVED", label: "Resolved", dot: "bg-emerald-500" },
  { value: "CANCELLED", label: "Cancelled", dot: "bg-muted-foreground" },
];

const STATUS_OPTIONS: SosStatus[] = ["PENDING", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CANCELLED"];

const PRIORITY_BAR: Record<string, string> = {
  CRITICAL: "bg-destructive",
  HIGH: "bg-amber-500",
  MEDIUM: "bg-sky-500",
  LOW: "bg-muted-foreground",
};

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] },
  }),
};

const MotionCard = motion.create(Card);

export default function AdminSosPage() {
  const [statusFilter, setStatusFilter] = useState<SosStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");

  // Fetch the full queue once; filter/count client-side so tabs can show counts.
  const { data, isLoading } = useSosRequests({ limit: 100 });
  // Only verified, available volunteers can be assigned (the API enforces this too).
  const { options: volunteers } = useAssignableVolunteers();
  const updateStatus = useUpdateSosStatus();
  const assignSos = useAssignSos();

  const all = useMemo(() => data?.data ?? [], [data]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: all.length };
    for (const s of all) c[s.status] = (c[s.status] ?? 0) + 1;
    return c;
  }, [all]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all.filter((sos) => {
      if (statusFilter !== "ALL" && sos.status !== statusFilter) return false;
      if (!q) return true;
      return (
        sos.name.toLowerCase().includes(q) ||
        sos.phone.includes(q) ||
        (sos.district?.nameEn ?? "").toLowerCase().includes(q) ||
        sos.helpType.join(" ").toLowerCase().includes(q)
      );
    });
  }, [all, statusFilter, search]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Siren}
        title="SOS Requests"
        description="Live rescue queue — sorted by priority. Auto-refreshes every 15s."
      />

      {/* Segmented status tabs with counts */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 h-9 text-xs font-bold transition-all",
                active
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <span className={cn("size-2 rounded-full", tab.dot)} />
              {tab.label}
              <span
                className={cn(
                  "min-w-5 rounded-full px-1.5 text-[10px] font-black tabular-nums",
                  active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
                )}
              >
                {counts[tab.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, district, or help type..."
          className="pl-10 h-11 rounded-xl"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="flex flex-col gap-3">
          {filtered.map((sos, i) => (
            <SosRow
              key={sos.id}
              sos={sos}
              index={i}
              volunteers={volunteers}
              onStatus={(status) => updateStatus.mutate({ id: sos.id, status })}
              onAssign={(volunteerId) => assignSos.mutate({ id: sos.id, volunteerId })}
            />
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card">
          <EmptyState
            icon={Siren}
            title={search ? "No matching requests" : "No SOS requests here"}
            description={
              search
                ? "Try a different search term."
                : "Requests in this category will appear as they come in."
            }
          />
        </Card>
      )}
    </div>
  );
}

function SosRow({
  sos,
  index,
  volunteers,
  onStatus,
  onAssign,
}: {
  sos: SosRequest;
  index: number;
  volunteers: { id: string; name: string }[];
  onStatus: (status: SosStatus) => void;
  onAssign: (volunteerId: string) => void;
}) {
  const [manageOpen, setManageOpen] = useState(false);
  const photos = sos.photoUrls?.length ? sos.photoUrls : sos.photoUrl ? [sos.photoUrl] : [];

  return (
    <MotionCard
      variants={fade}
      custom={index}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 pl-6"
    >
      <span
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5",
          PRIORITY_BAR[sos.priority] ?? "bg-muted-foreground",
        )}
        aria-hidden
      />
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <SosPriorityBadge priority={sos.priority} />
            <SosStatusBadge status={sos.status} />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              {new Date(sos.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm font-bold text-foreground">{sos.name}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
            <a href={`tel:${sos.phone}`} className="inline-flex items-center gap-1 hover:text-primary">
              <Phone className="h-3 w-3" /> {sos.phone}
            </a>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {sos.district?.nameEn}
              {sos.addressText ? ` — ${sos.addressText}` : ""}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="h-3 w-3" /> {sos.peopleCount} people
            </span>
            <span className="capitalize">{sos.helpType.join(", ")}</span>
          </div>
          {sos.description && (
            <p className="text-xs text-muted-foreground mt-2 italic">&ldquo;{sos.description}&rdquo;</p>
          )}
          {photos.length > 0 && (
            <div className="flex gap-2 mt-3">
              {photos.slice(0, 4).map((url, idx) => (
                <a key={url} href={url} target="_blank" rel="noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`SOS photo ${idx + 1}`}
                    className="size-14 rounded-lg object-cover border border-border hover:scale-105 transition-transform"
                  />
                </a>
              ))}
            </div>
          )}
          {sos.assignedTo && (
            <p className="text-xs font-semibold text-primary mt-2">
              Assigned to: {sos.assignedTo.name}
              {sos.assignedTo.phone ? ` (${sos.assignedTo.phone})` : ""}
            </p>
          )}
        </div>

        <div className="shrink-0 w-full lg:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="w-full lg:w-auto gap-1.5 font-semibold"
            onClick={() => setManageOpen(true)}
          >
            <Settings2 className="size-4" />
            Manage
          </Button>
        </div>
      </div>

      <Dialog open={manageOpen} onOpenChange={setManageOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage SOS Request</DialogTitle>
            <DialogDescription>
              {sos.name} · {sos.district?.nameEn}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Status</Label>
              <Select value={sos.status} onValueChange={(status) => onStatus(status as SosStatus)}>
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Assign volunteer</Label>
              <Select
                value={sos.assignedToId ?? ""}
                onValueChange={(id) => id && onAssign(id as string)}
              >
                <SelectTrigger className="w-full rounded-lg">
                  <SelectValue placeholder="Assign volunteer...">
                    {(value: string) =>
                      volunteers.find((v) => v.id === value)?.name ||
                      sos.assignedTo?.name ||
                      "Assign volunteer..."
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {volunteers.length === 0 && (
                    <p className="px-3 py-2 text-xs text-muted-foreground">
                      No verified volunteers are available right now.
                    </p>
                  )}
                  {volunteers.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <p className="text-xs text-muted-foreground">
              Changes are saved automatically.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </MotionCard>
  );
}
