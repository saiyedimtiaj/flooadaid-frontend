"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
import { useState } from "react";
import { Loader2, PackagePlus, Plus, Send, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  DispatchList,
  SupplyStatusBadge,
  URGENCIES,
  UrgencyBadge,
  itemsSummary,
} from "@/components/supply/supply-request-parts";
import { useShelters } from "@/lib/hooks/use-shelters";
import { useReliefStock } from "@/lib/hooks/use-relief";
import { useCreateSupplyRequest, useSupplyRequests } from "@/lib/hooks/use-supply-requests";
import type { SupplyUrgency } from "@/lib/types/api";

interface Line {
  item: string;
  quantity: string;
}

function RequestForm({ onDone }: { onDone: () => void }) {
  const { data: shelters } = useShelters({ limit: 100 });
  const { data: stock } = useReliefStock();
  const create = useCreateSupplyRequest();
  const [shelterId, setShelterId] = useState("");
  const [urgency, setUrgency] = useState<SupplyUrgency>("MEDIUM");
  const [note, setNote] = useState("");
  const [lines, setLines] = useState<Line[]>([{ item: "", quantity: "" }]);

  const unitOf = (item: string) => stock?.find((s) => s.item === item)?.unit ?? "";
  const validLines = lines.filter((l) => l.item && Number(l.quantity) > 0);
  const canSubmit = !!shelterId && validLines.length > 0 && !create.isPending;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await create.mutateAsync({
      shelterId,
      urgency,
      note: note.trim() || undefined,
      items: validLines.map((l) => ({ item: l.item, quantity: Number(l.quantity), unit: unitOf(l.item) })),
    });
    onDone();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Shelter</Label>
          <SearchableSelect
            value={shelterId}
            onValueChange={setShelterId}
            options={(shelters?.data ?? []).map((s) => ({ value: s.id, label: s.name, description: `${s.district.nameEn} · ${s.currentOccupancy}/${s.capacity} people`, keywords: s.district.nameEn }))}
            placeholder="Which shelter needs supplies?"
            searchPlaceholder="Search shelter or district…"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Urgency</Label>
          <SearchableSelect
            value={urgency}
            onValueChange={(v) => v && setUrgency(v as SupplyUrgency)}
            options={URGENCIES.map((u) => ({ value: u, label: u.charAt(0) + u.slice(1).toLowerCase() }))}
            searchPlaceholder="Search urgency…"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Items needed</Label>
        {lines.map((line, i) => (
          <div key={i} className="flex gap-2">
            <SearchableSelect
              className="flex-1"
              value={line.item}
              onValueChange={(v) => setLines((ls) => ls.map((l, j) => (j === i ? { ...l, item: v } : l)))}
              options={(stock ?? []).map((s) => ({ value: s.item, label: s.item, description: `${s.quantity} ${s.unit} in store` }))}
              placeholder="Item from the relief store"
              searchPlaceholder="Search items…"
            />
            <Input
              type="number"
              min={1}
              className="w-28"
              placeholder={unitOf(line.item) || "Qty"}
              value={line.quantity}
              onChange={(e) =>
                setLines((ls) => ls.map((l, j) => (j === i ? { ...l, quantity: e.target.value } : l)))
              }
              aria-label="Quantity"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Remove item"
              disabled={lines.length === 1}
              onClick={() => setLines((ls) => ls.filter((_, j) => j !== i))}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start gap-1.5"
          onClick={() => setLines((ls) => [...ls, { item: "", quantity: "" }])}
        >
          <Plus className="size-3.5" />
          Add item
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Note for the relief team (optional)</Label>
        <Textarea
          rows={2}
          maxLength={500}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="320 people tonight, rice runs out tomorrow morning"
        />
      </div>

      <Button type="submit" disabled={!canSubmit} className="gap-2 font-semibold self-start">
        {create.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        Send Request
      </Button>
    </form>
  );
}

export default function VolunteerSupplyRequestsPage() {
  const { data: requests, isLoading } = useSupplyRequests({ mine: true });
  const [formKey, setFormKey] = useState(0);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={PackagePlus}
        title="Supply Requests"
        description="Ask the relief team for supplies a shelter is running out of. Approved requests come back to you as relief to deliver."
      />

      <Card className="rounded-3xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold text-foreground mb-4">New request</h3>
        <RequestForm key={formKey} onDone={() => setFormKey((k) => k + 1)} />
      </Card>

      <Card className="rounded-3xl border border-border bg-card p-6">
        <h3 className="text-sm font-bold text-foreground mb-4">My requests</h3>
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : requests && requests.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {requests.map((r) => (
              <div key={r.id} className="py-3.5 flex flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{r.shelter.name}</p>
                  <div className="flex items-center gap-1.5">
                    <UrgencyBadge urgency={r.urgency} />
                    <SupplyStatusBadge status={r.status} />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{itemsSummary(r.items)}</p>
                {r.reviewNote && (
                  <p className="text-xs text-foreground bg-muted/40 rounded-lg px-2.5 py-1.5 mt-1">
                    {r.reviewedBy?.name ?? "Admin"}: {r.reviewNote}
                  </p>
                )}
                <DispatchList request={r} />
                <p className="text-[11px] text-muted-foreground/70">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon={PackagePlus} title="No requests yet" description="Requests you send will show up here." />
        )}
      </Card>
    </div>
  );
}
