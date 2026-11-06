"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, PackagePlus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  DispatchList,
  SupplyStatusBadge,
  UrgencyBadge,
  itemsSummary,
} from "@/components/supply/supply-request-parts";
import { useReliefStock } from "@/lib/hooks/use-relief";
import { useAssignableVolunteers } from "@/lib/hooks/use-volunteers";
import {
  useApproveSupplyRequest,
  useRejectSupplyRequest,
  useSupplyRequests,
} from "@/lib/hooks/use-supply-requests";
import type { SupplyRequest, SupplyRequestStatus } from "@/lib/types/api";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/dashboard/pagination";
import { SearchInput, usePaged } from "@/components/dashboard/list-toolbar";

const FILTERS: { value: SupplyRequestStatus | undefined; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "On the way" },
  { value: "FULFILLED", label: "Delivered" },
  { value: "REJECTED", label: "Declined" },
  { value: undefined, label: "All" },
];

/**
 * Approve = pick a volunteer and (optionally) trim quantities. The backend
 * takes the items out of the store and creates the volunteer's assignments in
 * one transaction; if anything is short, nothing moves.
 */
function ApproveDialog({ request, onClose }: { request: SupplyRequest; onClose: () => void }) {
  const { options: volunteers } = useAssignableVolunteers();
  const { data: stock } = useReliefStock();
  const approve = useApproveSupplyRequest();
  const [volunteerId, setVolunteerId] = useState("");
  const [note, setNote] = useState("");
  const [qty, setQty] = useState<Record<string, string>>(
    Object.fromEntries(request.items.map((i) => [i.item, String(i.quantity)])),
  );

  const lines = request.items
    .map((i) => ({ item: i.item, quantity: Number(qty[i.item]) }))
    .filter((l) => l.quantity > 0);

  const submit = async () => {
    await approve.mutateAsync({
      id: request.id,
      volunteerId,
      items: lines,
      reviewNote: note.trim() || undefined,
    });
    onClose();
  };

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Approve & dispatch</DialogTitle>
          <DialogDescription>
            {request.shelter.name} · {request.shelter.currentOccupancy}/{request.shelter.capacity} people
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Quantities to send</Label>
            {request.items.map((i) => {
              const inStore = stock?.find((s) => s.item === i.item);
              const short = !inStore || inStore.quantity < Number(qty[i.item] || 0);
              return (
                <div key={i.item} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">
                    {i.item}
                    <span className={cn("block text-[11px]", short ? "text-destructive" : "text-muted-foreground")}>
                      asked {i.quantity} {i.unit} · store has {inStore ? `${inStore.quantity} ${inStore.unit}` : "none"}
                    </span>
                  </span>
                  <Input
                    type="number"
                    min={0}
                    className="w-24"
                    value={qty[i.item]}
                    onChange={(e) => setQty((q) => ({ ...q, [i.item]: e.target.value }))}
                    aria-label={`Quantity of ${i.item}`}
                  />
                </div>
              );
            })}
            <p className="text-[11px] text-muted-foreground">Set an item to 0 to leave it out.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Volunteer to carry it</Label>
            <SearchableSelect
              value={volunteerId}
              onValueChange={setVolunteerId}
              options={volunteers.map((v) => ({ value: v.id, label: v.name }))}
              placeholder="Select a verified volunteer..."
              searchPlaceholder="Search volunteers…"
              emptyText="No verified volunteers available"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Note to the requester (optional)</Label>
            <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Sending half now, rest tomorrow" />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={!volunteerId || lines.length === 0 || approve.isPending}
            className="gap-2 font-semibold"
          >
            {approve.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Approve & dispatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RejectDialog({ request, onClose }: { request: SupplyRequest; onClose: () => void }) {
  const reject = useRejectSupplyRequest();
  const [reason, setReason] = useState("");
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Decline request</DialogTitle>
          <DialogDescription>{request.shelter.name} — the requester sees your reason.</DialogDescription>
        </DialogHeader>
        <Textarea
          rows={3}
          maxLength={300}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Already covered by the Upazila relief office this week"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!reason.trim() || reject.isPending}
            onClick={async () => {
              await reject.mutateAsync({ id: request.id, reviewNote: reason.trim() });
              onClose();
            }}
          >
            Decline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function SupplyRequestsView() {
  const [status, setStatus] = useState<SupplyRequestStatus | undefined>("PENDING");
  const { data: requests, isLoading } = useSupplyRequests({ status });
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (requests ?? []).filter(
      (r) => !q || `${r.shelter.name} ${r.shelter.district.nameEn} ${r.requestedBy.name} ${r.items.map((i) => i.item).join(" ")}`.toLowerCase().includes(q),
    );
  }, [requests, search]);
  const paged = usePaged(filtered, 6, `${status}|${search}`);
  const [approving, setApproving] = useState<SupplyRequest | null>(null);
  const [rejecting, setRejecting] = useState<SupplyRequest | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Shelters asking for supplies, most urgent first. Approving takes the items from the store and hands them to a volunteer.
        </p>
        <SearchInput value={search} onChange={setSearch} placeholder="Shelter, district, item or requester…" className="sm:max-w-xs" />
        <div className="inline-flex rounded-full border border-border bg-card p-1">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => setStatus(f.value)}
              className={cn(
                "px-4 py-2 text-xs font-semibold rounded-full transition-colors",
                status === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-3xl" />
      ) : paged.pageItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paged.pageItems.map((r) => (
            <Card key={r.id} className="rounded-3xl border border-border bg-card p-5 flex flex-col gap-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{r.shelter.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.shelter.district.nameEn} · {r.shelter.currentOccupancy}/{r.shelter.capacity} people · by{" "}
                    {r.requestedBy.name}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <UrgencyBadge urgency={r.urgency} />
                  <SupplyStatusBadge status={r.status} />
                </div>
              </div>
              <p className="text-sm text-foreground">{itemsSummary(r.items)}</p>
              {r.note && <p className="text-xs text-muted-foreground italic">“{r.note}”</p>}
              {r.reviewNote && (
                <p className="text-xs bg-muted/40 rounded-lg px-2.5 py-1.5">
                  {r.reviewedBy?.name}: {r.reviewNote}
                </p>
              )}
              <DispatchList request={r} />
              <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                <span className="text-[11px] text-muted-foreground/70">{new Date(r.createdAt).toLocaleString()}</span>
                {r.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => setRejecting(r)}>
                      <X className="size-3.5" />
                      Decline
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => setApproving(r)}>
                      <Check className="size-3.5" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card">
          <EmptyState icon={PackagePlus} title="No supply requests here" />
        </Card>
      )}

      {paged.total > 0 && (
        <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} pageSize={6} onChange={paged.setPage} />
      )}

      {approving && <ApproveDialog request={approving} onClose={() => setApproving(null)} />}
      {rejecting && <RejectDialog request={rejecting} onClose={() => setRejecting(null)} />}
    </div>
  );
}
