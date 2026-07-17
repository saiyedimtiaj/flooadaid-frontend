import { Badge } from "@/components/ui/badge";
import type { AlertSeverity } from "@/lib/types/api";

const SEVERITY_VARIANT: Record<AlertSeverity, "danger" | "warning" | "info" | "success"> = {
  CRITICAL: "danger",
  DANGER: "danger",
  WARNING: "warning",
  WATCH: "info",
  NORMAL: "success",
};

export function AlertSeverityBadge({ severity }: { severity: AlertSeverity }) {
  return (
    <Badge variant={SEVERITY_VARIANT[severity]} dot>
      {severity}
    </Badge>
  );
}
