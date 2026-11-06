"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageList(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, total, page - 1, page, page + 1].filter((p) => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

const BTN =
  "inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-xl border px-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40";

export function Pagination({
  page,
  totalPages,
  onChange,
  total,
  pageSize,
  className,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  total?: number;
  pageSize?: number;
  className?: string;
}) {
  if (totalPages <= 1 && total === undefined) return null;
  const from = total !== undefined && pageSize ? (total === 0 ? 0 : (page - 1) * pageSize + 1) : undefined;
  const to = total !== undefined && pageSize ? Math.min(page * pageSize, total) : undefined;

  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
      <p className="text-sm text-muted-foreground">
        {total !== undefined && from !== undefined ? (
          <>
            Showing <span className="font-semibold text-foreground">{from}</span>–
            <span className="font-semibold text-foreground">{to}</span> of{" "}
            <span className="font-semibold text-foreground">{total}</span>
          </>
        ) : (
          <>
            Page <span className="font-semibold text-foreground">{page}</span> of {totalPages}
          </>
        )}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className={cn(BTN, "border-border bg-card text-foreground hover:bg-muted")}
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          {pageList(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={cn(
                  BTN,
                  "hidden sm:inline-flex",
                  p === page
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:bg-muted",
                )}
              >
                {p}
              </button>
            ),
          )}
          <button
            type="button"
            className={cn(BTN, "border-border bg-card text-foreground hover:bg-muted")}
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </nav>
  );
}
