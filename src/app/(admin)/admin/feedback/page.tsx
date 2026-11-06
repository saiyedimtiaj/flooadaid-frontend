"use client";

import { useMemo, useState } from "react";
import { Inbox, Bug, ShieldAlert, AlertOctagon, HelpCircle, Mail, Clock, CheckCircle2 } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Pagination } from "@/components/dashboard/pagination";
import { FilterSelect, SearchInput, usePaged } from "@/components/dashboard/list-toolbar";
import { timeAgo } from "@/lib/format-time-ago";
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

const PAGE_SIZE = 8;

export default function AdminFeedbackPage() {
  const [filter, setFilter] = useState<ReportStatus | "ALL">("ALL");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { data: reports, isLoading } = useFeedbackReports(filter === "ALL" ? undefined : filter);
  const { data: summary } = useFeedbackSummary();
  const updateStatus = useUpdateFeedbackStatus();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (reports ?? []).filter((r) => {
      if (category && r.category !== category) return false;
      return !q || `${r.name} ${r.email ?? ""} ${r.message}`.toLowerCase().includes(q);
    });
  }, [reports, search, category]);
  const paged = usePaged(filtered, PAGE_SIZE, `${filter}|${search}|${category}`);
  const countFor = (f: ReportStatus | "ALL") => (f === "ALL" ? summary?.total : summary?.byStatus[f]) ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={Inbox} title="Feedback & Reports" description="Reports submitted by citizens from the public site." />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total" value={summary?.total} icon={Inbox} isLoading={!summary} highlight />
        <StatCard label="New" value={summary?.byStatus.NEW ?? 0} icon={Mail} tint="warning" isLoading={!summary} />
        <StatCard label="Reviewing" value={summary?.byStatus.REVIEWING ?? 0} icon={Clock} tint="info" isLoading={!summary} />
        <StatCard label="Resolved" value={summary?.byStatus.RESOLVED ?? 0} icon={CheckCircle2} tint="success" isLoading={!summary} />
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center">
          <div className="inline-flex shrink-0 flex-wrap gap-1 self-start rounded-3xl border border-border bg-background p-1 sm:rounded-full">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  filter === f.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px] tabular-nums",
                    filter === f.value ? "bg-lime text-lime-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {countFor(f.value)}
                </span>
              </button>
            ))}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search name, email or message…" className="xl:max-w-sm" />
          <FilterSelect
            value={category}
            onChange={setCategory}
            allLabel="All categories"
            options={Object.entries(CATEGORY_META).map(([value, m]) => ({ value, label: m.label }))}
          />
        </div>

        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-5">
                <Skeleton className="h-11 w-11 rounded-xl" />
                <div className="flex flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3.5 w-full max-w-xl" />
                  <Skeleton className="h-3.5 w-2/3 max-w-md" />
                </div>
                <Skeleton className="hidden h-10 w-40 rounded-xl sm:block" />
              </div>
            ))}
          </div>
        ) : paged.pageItems.length > 0 ? (
          <ul className="divide-y divide-border">
            {paged.pageItems.map((r, i) => {
              const cat = CATEGORY_META[r.category];
              const CatIcon = cat.icon;
              return (
                <motion.li
                  key={r.id}
                  variants={fade}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/30 lg:flex-row lg:items-start"
                >
                  <div className="flex min-w-0 flex-1 gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-lime">
                      <CatIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-foreground">{r.name}</p>
                        <Badge variant="neutral">{cat.label}</Badge>
                        <Badge variant={STATUS_META[r.status].variant} dot>
                          {STATUS_META[r.status].label}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                        {r.email && (
                          <a href={`mailto:${r.email}`} className="inline-flex items-center gap-1 hover:text-primary">
                            <Mail className="h-3 w-3" /> {r.email}
                          </a>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {timeAgo(r.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2.5 whitespace-pre-wrap rounded-xl bg-muted/50 px-3.5 py-2.5 text-sm text-foreground/85">{r.message}</p>
                    </div>
                  </div>
                  <div className="w-full shrink-0 lg:w-44">
                    <SearchableSelect
                      value={r.status}
                      onValueChange={(status) => status && updateStatus.mutate({ id: r.id, status: status as ReportStatus })}
                      options={[
                        { value: "NEW", label: "New" },
                        { value: "REVIEWING", label: "Reviewing" },
                        { value: "RESOLVED", label: "Resolved" },
                      ]}
                      searchPlaceholder="Search status…"
                    />
                  </div>
                </motion.li>
              );
            })}
          </ul>
        ) : (
          <EmptyState
            icon={Inbox}
            title={search || category || filter !== "ALL" ? "No reports match" : "No reports yet"}
            description={
              search || category || filter !== "ALL"
                ? "Try another status, category or search term."
                : "Reports submitted from the public 'Report an Issue' page will appear here."
            }
          />
        )}

        {!isLoading && paged.total > 0 && (
          <div className="border-t border-border p-4">
            <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} pageSize={PAGE_SIZE} onChange={paged.setPage} />
          </div>
        )}
      </section>
    </div>
  );
}
