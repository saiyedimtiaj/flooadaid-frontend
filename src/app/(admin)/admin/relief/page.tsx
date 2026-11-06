"use client";

import { useState } from "react";
import { Package, Boxes, Send, ClipboardList, PackagePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReliefInventoryView } from "./_ui/relief-inventory-view";
import { ReliefAssignmentsView } from "./_ui/relief-assignments-view";
import { ReliefLogView } from "./_ui/relief-log-view";
import { SupplyRequestsView } from "./_ui/supply-requests-view";
import { useSupplyRequestSummary } from "@/lib/hooks/use-supply-requests";

const TABS = [
  { value: "requests", label: "Supply Requests", icon: PackagePlus },
  { value: "inventory", label: "Inventory", icon: Boxes },
  { value: "assignments", label: "Assignments", icon: Send },
  { value: "log", label: "Distribution Log", icon: ClipboardList },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function AdminReliefPage() {
  const [tab, setTab] = useState<TabValue>("requests");
  const { data: requestCounts } = useSupplyRequestSummary();
  const pendingRequests = requestCounts?.PENDING ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Package}
        title="Relief Management"
        description="Review shelter supply requests, track store inventory, assign relief to volunteers, and log distributions."
      />

      <div className="inline-flex flex-wrap gap-1 self-start rounded-3xl sm:rounded-full border border-border bg-card p-1.5">
        {TABS.map((t) => {
          const active = tab === t.value;
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 h-11 text-sm font-semibold transition-colors",
                active
                  ? "bg-primary text-primary-foreground [&_svg]:text-lime"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t.label}
              {t.value === "requests" && pendingRequests > 0 && (
                <span className="rounded-full bg-destructive px-1.5 text-[11px] text-destructive-foreground tabular-nums">
                  {pendingRequests}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {tab === "requests" && <SupplyRequestsView />}
      {tab === "inventory" && <ReliefInventoryView />}
      {tab === "assignments" && <ReliefAssignmentsView />}
      {tab === "log" && <ReliefLogView />}
    </div>
  );
}
