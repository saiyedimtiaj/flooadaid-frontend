"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  return (
    <Select
      value={value ? String(value) : ""}
      onValueChange={(val) => onChange(Number(val))}
      disabled={isLoading}
    >
      <SelectTrigger className="w-full data-[size=default]:h-10 rounded-lg">
        <SelectValue placeholder={isLoading ? "Loading districts..." : placeholder}>
          {(val: string) =>
            districts?.find((d) => String(d.id) === val)?.nameEn ?? placeholder
          }
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {districts?.map((district) => (
          <SelectItem key={district.id} value={String(district.id)}>
            {district.nameEn}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
