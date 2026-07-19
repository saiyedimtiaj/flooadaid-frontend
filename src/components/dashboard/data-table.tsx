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
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "./empty-state";
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
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <Card className="rounded-3xl border border-border bg-card p-3 sm:p-4">
        {/* Desktop skeleton */}
        <div className="hidden md:block space-y-2 p-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-11 w-full rounded-lg" />
          ))}
        </div>
        {/* Mobile skeleton */}
        <div className="md:hidden space-y-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="rounded-3xl border border-border bg-card">
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={emptyAction}
        />
      </Card>
    );
  }

  const primaryCol = columns.find((c) => c.primary);
  const mobileCols = columns.filter((c) => !c.hideOnMobile && !c.primary);

  return (
    <>
      {/* Desktop: table scrolls horizontally *inside* the card, never the page. */}
      <Card className="hidden md:block rounded-2xl border border-border bg-card overflow-hidden w-full max-w-full min-w-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={cn(
                    "bg-muted/50 text-[11px] font-bold uppercase tracking-wider text-muted-foreground h-11 first:pl-5 last:pr-5",
                    col.align === "right" && "text-right",
                  )}
                >
                  {col.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <motion.tr
                key={getRowKey(row)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  "border-b border-border/50 transition-colors hover:bg-primary/4",
                  onRowClick && "cursor-pointer",
                )}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "py-3.5 first:pl-5 last:pr-5",
                      col.align === "right" && "text-right",
                      col.className,
                    )}
                  >
                    {col.render(row)}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </Card>

      <div className="md:hidden flex flex-col gap-3">
        {data.map((row, i) => (
          <motion.div
            key={getRowKey(row)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: Math.min(i * 0.04, 0.3) }}
          >
            <Card
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                "rounded-2xl border border-border bg-card p-4",
                onRowClick && "cursor-pointer active:scale-[0.99] transition-transform",
              )}
            >
              {primaryCol && (
                <div className="mb-3 pb-3 border-b border-border/60">
                  {primaryCol.render(row)}
                </div>
              )}
              <div className="flex flex-col gap-2.5">
                {mobileCols.map((col) => (
                  <div key={col.key} className="flex items-start justify-between gap-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground shrink-0 pt-0.5">
                      {col.header}
                    </span>
                    <span className={cn("text-sm text-foreground text-right min-w-0", col.className)}>
                      {col.render(row)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </>
  );
}
