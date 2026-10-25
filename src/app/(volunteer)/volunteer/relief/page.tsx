"use client";

import { useState } from "react";
import { Package, Truck, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  useReliefAssignments,
  useDeliverAssignment,
} from "@/lib/hooks/use-relief";
import { useShelters } from "@/lib/hooks/use-shelters";

export default function VolunteerReliefPage() {
  const { data: assignments, isLoading } = useReliefAssignments({ mine: true });
  const { data: shelters } = useShelters({ limit: 100 });
  const deliver = useDeliverAssignment();
  const [shelterByAssignment, setShelterByAssignment] = useState<Record<string, string>>({});

  const holding = assignments?.filter((a) => a.status === "ASSIGNED") ?? [];
  // Relief sent for a shelter's supply request defaults to that shelter.
  const targetShelter = (a: (typeof holding)[number]) =>
    shelterByAssignment[a.id] ?? a.supplyRequest?.shelter.id ?? "";
  const delivered = assignments?.filter((a) => a.status === "DELIVERED") ?? [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Package}
        title="My Relief"
        description="Relief you are holding and where you have delivered it."
      />

      {/* Currently holding */}
      <Card className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center size-8 rounded-xl bg-warning/10 text-warning">
            <Package className="size-4" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Currently Holding</h3>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : holding.length > 0 ? (
          <div className="flex flex-col gap-3">
            {holding.map((a) => (
              <div
                key={a.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/70 bg-muted/20 p-4"
              >
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {a.item} · {a.quantity}
                    {a.unit}
                  </p>
                  {a.supplyRequest && (
                    <Badge variant={a.supplyRequest.urgency === "CRITICAL" || a.supplyRequest.urgency === "HIGH" ? "danger" : "info"} className="mt-1">
                      Requested by {a.supplyRequest.shelter.name}
                    </Badge>
                  )}
                  {a.note && <p className="text-xs text-muted-foreground mt-0.5">{a.note}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Select
                    value={targetShelter(a)}
                    onValueChange={(v) =>
                      setShelterByAssignment((prev) => ({ ...prev, [a.id]: v as string }))
                    }
                  >
                    <SelectTrigger className="w-full sm:w-52 data-[size=default]:h-9 rounded-lg">
                      <SelectValue placeholder="Deliver to shelter...">
                        {(v: string) =>
                          shelters?.data.find((s) => s.id === v)?.name ?? "Deliver to shelter..."
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {shelters?.data.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="gap-1.5 shrink-0"
                    disabled={!targetShelter(a) || deliver.isPending}
                    onClick={() => deliver.mutate({ id: a.id, shelterId: targetShelter(a) })}
                  >
                    <Truck className="size-3.5" /> Deliver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title="Nothing to deliver"
            description="Relief assigned to you by an admin will appear here."
          />
        )}
      </Card>

      {/* Delivered history */}
      {delivered.length > 0 && (
        <Card className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center justify-center size-8 rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="size-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Delivered</h3>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {delivered.map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {a.item} · {a.quantity}
                    {a.unit}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    to {a.shelter?.name ?? "shelter"}
                    {a.deliveredAt ? ` · ${new Date(a.deliveredAt).toLocaleDateString()}` : ""}
                  </p>
                </div>
                <Badge variant="success" dot>
                  Delivered
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
