"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
import { Pagination } from "./pagination";
import { usePaged } from "./list-toolbar";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  hideOnMobile?: boolean;
  align?: "left" | "right";
  primary?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[] | undefined;
  isLoading?: boolean;
  getRowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  toolbar?: React.ReactNode;
  pageSize?: number;
  resetKey?: string;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  getRowKey,
  onRowClick,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  emptyAction,
  toolbar,
  pageSize = 10,
  resetKey = "",
}: DataTableProps<T>) {
  const paged = usePaged(data ?? [], pageSize, resetKey);
  const primaryCol = columns.find((c) => c.primary);
  const mobileCols = columns.filter((c) => !c.hideOnMobile && !c.primary);
  const rows = paged.pageItems;

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card">
      {toolbar && <div className="flex flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center">{toolbar}</div>}

      {isLoading ? (
        <div className="divide-y divide-border">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
              {columns.slice(2).map((c) => (
                <Skeleton key={c.key} className="hidden h-6 w-20 rounded-full md:block" />
              ))}
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} action={emptyAction} />
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={cn(
                        "h-11 bg-muted/50 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pl-5 last:pr-5",
                        col.align === "right" && "text-right",
                      )}
                    >
                      {col.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, i) => (
                  <motion.tr
                    key={getRowKey(row)}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={cn("border-b border-border/60 transition-colors hover:bg-muted/40", onRowClick && "cursor-pointer")}
                  >
                    {columns.map((col) => (
                      <TableCell
                        key={col.key}
                        className={cn("py-3.5 first:pl-5 last:pr-5", col.align === "right" && "text-right", col.className)}
                      >
                        {col.render(row)}
                      </TableCell>
                    ))}
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col divide-y divide-border md:hidden">
            {rows.map((row) => (
              <div
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn("p-4", onRowClick && "cursor-pointer active:bg-muted/40")}
              >
                {primaryCol && <div className="mb-3">{primaryCol.render(row)}</div>}
                <div className="flex flex-col gap-2.5">
                  {mobileCols.map((col) => (
                    <div key={col.key} className="flex items-start justify-between gap-3">
                      <span className="shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {col.header}
                      </span>
                      <span className={cn("min-w-0 text-right text-sm text-foreground", col.className)}>{col.render(row)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!isLoading && paged.total > 0 && (
        <div className="border-t border-border p-4">
          <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} pageSize={pageSize} onChange={paged.setPage} />
        </div>
      )}
    </section>
  );
}
