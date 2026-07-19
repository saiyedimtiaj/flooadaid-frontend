"use client";

import { useState } from "react";
import { Package, Boxes, Send, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReliefInventoryView } from "./_ui/relief-inventory-view";
import { ReliefAssignmentsView } from "./_ui/relief-assignments-view";
import { ReliefLogView } from "./_ui/relief-log-view";

const TABS = [
  { value: "inventory", label: "Inventory", icon: Boxes },
  { value: "assignments", label: "Assignments", icon: Send },
  { value: "log", label: "Distribution Log", icon: ClipboardList },
] as const;

type TabValue = (typeof TABS)[number]["value"];

export default function AdminReliefPage() {
  const [tab, setTab] = useState<TabValue>("inventory");

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Package}
        title="Relief Management"
        description="Track store inventory, assign relief to volunteers, and log distributions."
      />

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = tab === t.value;
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 h-10 text-sm font-bold transition-all",
                active
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {tab === "inventory" && <ReliefInventoryView />}
      {tab === "assignments" && <ReliefAssignmentsView />}
      {tab === "log" && <ReliefLogView />}
    </div>
  );
}
