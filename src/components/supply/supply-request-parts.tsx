"use client";

import { Badge } from "@/components/ui/badge";
import type { SupplyRequest, SupplyRequestStatus, SupplyUrgency } from "@/lib/types/api";

const STATUS_VARIANT: Record<SupplyRequestStatus, "warning" | "info" | "danger" | "success"> = {
  PENDING: "warning",
  APPROVED: "info",
  REJECTED: "danger",
  FULFILLED: "success",
};

const STATUS_LABEL: Record<SupplyRequestStatus, string> = {
  PENDING: "Pending review",
  APPROVED: "On the way",
  REJECTED: "Declined",
  FULFILLED: "Delivered",
};

const URGENCY_VARIANT: Record<SupplyUrgency, "neutral" | "info" | "warning" | "danger"> = {
  LOW: "neutral",
  MEDIUM: "info",
  HIGH: "warning",
  CRITICAL: "danger",
};

export const URGENCIES: SupplyUrgency[] = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

export function SupplyStatusBadge({ status }: { status: SupplyRequestStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function UrgencyBadge({ urgency }: { urgency: SupplyUrgency }) {
  return <Badge variant={URGENCY_VARIANT[urgency]}>{urgency.toLowerCase()}</Badge>;
}

/** "200 kg Rice (kg), 100 L Water" */
export function itemsSummary(items: SupplyRequest["items"]) {
  return items.map((i) => `${i.quantity} ${i.unit} ${i.item}`).join(", ");
}

/** Who is carrying what for an approved request. */
export function DispatchList({ request }: { request: SupplyRequest }) {
  if (request.assignments.length === 0) return null;
  return (
    <ul className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
      {request.assignments.map((a) => (
        <li key={a.id}>
          {a.quantity} {a.unit} {a.item} — {a.volunteer.name}
          {a.status === "DELIVERED" ? " · delivered" : a.status === "CANCELLED" ? " · cancelled" : " · in transit"}
        </li>
      ))}
    </ul>
  );
}
