"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useDistricts } from "@/lib/hooks/use-locations";
import { cn } from "@/lib/utils";

export function useDebounced<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-10 pr-10" />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterSelect({
  value,
  onChange,
  options,
  allLabel,
  className,
  searchPlaceholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  allLabel: string;
  className?: string;
  searchPlaceholder?: string;
}) {
  return (
    <SearchableSelect
      value={value || "__all"}
      onValueChange={(v) => onChange(v === "__all" ? "" : v)}
      options={[{ value: "__all", label: allLabel }, ...options]}
      placeholder={allLabel}
      searchPlaceholder={searchPlaceholder ?? "Search…"}
      className={cn("sm:w-48", className)}
    />
  );
}

export function DistrictFilter({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const { data: districts } = useDistricts();
  const options = (districts ?? [])
    .map((d) => ({ value: String(d.id), label: d.nameEn }))
    .sort((a, b) => a.label.localeCompare(b.label));
  return (
    <FilterSelect
      value={value}
      onChange={onChange}
      options={options}
      allLabel="All districts"
      searchPlaceholder="Search district…"
      className={className}
    />
  );
}

export function usePaged<T>(items: T[], pageSize: number, resetKey: unknown) {
  const [page, setPage] = useState(1);
  const [lastKey, setLastKey] = useState(resetKey);
  if (lastKey !== resetKey) {
    setLastKey(resetKey);
    setPage(1);
  }
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, totalPages);
  return {
    page: current,
    setPage,
    totalPages,
    total: items.length,
    pageItems: items.slice((current - 1) * pageSize, current * pageSize),
  };
}
