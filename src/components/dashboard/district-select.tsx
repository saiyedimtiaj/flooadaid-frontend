"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
import { useDistricts } from "@/lib/hooks/use-locations";

export function DistrictSelect({
  value,
  onChange,
  placeholder = "Select district...",
}: {
  value: number | undefined;
  onChange: (districtId: number) => void;
  placeholder?: string;
}) {
  const { data: districts, isLoading } = useDistricts();
  const options = (districts ?? [])
    .map((d) => ({ value: String(d.id), label: d.nameEn, keywords: d.nameBn }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <SearchableSelect
      value={value ? String(value) : ""}
      onValueChange={(v) => v && onChange(Number(v))}
      options={options}
      disabled={isLoading}
      placeholder={isLoading ? "Loading districts..." : placeholder}
      searchPlaceholder="Search district…"
    />
  );
}
