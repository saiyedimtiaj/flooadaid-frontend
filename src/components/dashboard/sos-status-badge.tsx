import { Badge } from "@/components/ui/badge";
import type { SosPriority, SosStatus } from "@/lib/types/api";

const STATUS_VARIANT: Record<SosStatus, "danger" | "warning" | "info" | "success" | "neutral"> = {
  PENDING: "danger",
  ASSIGNED: "warning",
  IN_PROGRESS: "info",
  RESOLVED: "success",
  CANCELLED: "neutral",
};

const STATUS_LABEL: Record<SosStatus, string> = {
  PENDING: "Pending",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CANCELLED: "Cancelled",
};

export function SosStatusBadge({ status }: { status: SosStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} dot>
      {STATUS_LABEL[status]}
    </Badge>
  );
}

const PRIORITY_VARIANT: Record<SosPriority, "danger" | "warning" | "info" | "neutral"> = {
  CRITICAL: "danger",
  HIGH: "warning",
  MEDIUM: "info",
  LOW: "neutral",
};

export function SosPriorityBadge({ priority }: { priority: SosPriority }) {
  return <Badge variant={PRIORITY_VARIANT[priority]}>{priority}</Badge>;
}
