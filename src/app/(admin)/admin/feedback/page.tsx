"use client";

import { useState } from "react";
import { Inbox, Bug, ShieldAlert, AlertOctagon, HelpCircle, Mail, Clock } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
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
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { cn } from "@/lib/utils";
import {
  useFeedbackReports,
  useFeedbackSummary,
  useUpdateFeedbackStatus,
  type ReportCategory,
  type ReportStatus,
} from "@/lib/hooks/use-feedback";

const CATEGORY_META: Record<ReportCategory, { label: string; icon: typeof Bug }> = {
  BUG: { label: "Bug", icon: Bug },
  DATA_ERROR: { label: "Data error", icon: AlertOctagon },
  SAFETY: { label: "Safety", icon: ShieldAlert },
  ABUSE: { label: "Abuse", icon: ShieldAlert },
  OTHER: { label: "Other", icon: HelpCircle },
};

const STATUS_META: Record<ReportStatus, { label: string; variant: "warning" | "info" | "success" }> = {
  NEW: { label: "New", variant: "warning" },
  REVIEWING: { label: "Reviewing", variant: "info" },
  RESOLVED: { label: "Resolved", variant: "success" },
};

const STATUS_FILTERS: { value: ReportStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "RESOLVED", label: "Resolved" },
];

const fade: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function AdminFeedbackPage() {
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const { data: reports, isLoading } = useFeedbackReports(filter === "ALL" ? undefined : filter);
  const { data: summary } = useFeedbackSummary();
  const updateStatus = useUpdateFeedbackStatus();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Inbox}
        title="Feedback & Reports"
        description="Reports submitted by citizens from the public site."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total" value={summary?.total} icon={Inbox} tint="primary" />
        <StatCard label="New" value={summary?.byStatus.NEW ?? 0} icon={Mail} tint="warning" />
        <StatCard label="Reviewing" value={summary?.byStatus.REVIEWING ?? 0} icon={Clock} tint="info" />
        <StatCard label="Resolved" value={summary?.byStatus.RESOLVED ?? 0} icon={HelpCircle} tint="success" />
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((f) => {
          const active = filter === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                "rounded-full border px-4 h-9 text-xs font-bold transition-all",
                active
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : reports && reports.length > 0 ? (
        <div className="flex flex-col gap-3">
          {reports.map((r, i) => {
            const cat = CATEGORY_META[r.category];
            const CatIcon = cat.icon;
            return (
              <motion.div key={r.id} variants={fade} custom={i} initial="hidden" animate="visible">
                <Card className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="neutral">
                          <CatIcon className="size-3" /> {cat.label}
                        </Badge>
                        <Badge variant={STATUS_META[r.status].variant} dot>
                          {STATUS_META[r.status].label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(r.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-foreground">{r.name}</p>
                      {r.email && (
                        <a
                          href={`mailto:${r.email}`}
                          className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                        >
                          <Mail className="size-3" /> {r.email}
                        </a>
                      )}
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{r.message}</p>
                    </div>

                    <div className="shrink-0 w-full lg:w-44">
                      <Select
                        value={r.status}
                        onValueChange={(status) =>
                          status && updateStatus.mutate({ id: r.id, status: status as ReportStatus })
                        }
                      >
                        <SelectTrigger className="w-full data-[size=default]:h-9 rounded-lg">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="REVIEWING">Reviewing</SelectItem>
                          <SelectItem value="RESOLVED">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card">
          <EmptyState
            icon={Inbox}
            title="No reports yet"
            description="Reports submitted from the public 'Report an Issue' page will appear here."
          />
        </Card>
      )}
    </div>
  );
}
