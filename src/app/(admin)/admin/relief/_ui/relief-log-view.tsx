"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useFieldArray, useForm, Controller } from "react-hook-form";
import { Plus, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { useCreateRelief, useReliefLogs, type ReliefInput } from "@/lib/hooks/use-relief";
import { DistrictFilter, SearchInput } from "@/components/dashboard/list-toolbar";
import type { ReliefLog } from "@/lib/types/api";

function ReliefFormSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createRelief = useCreateRelief();
  const { register, handleSubmit, control, reset } = useForm<ReliefInput>({
    defaultValues: {
      locationName: "",
      distributedBy: "",
      familiesServed: undefined,
      distributionDate: new Date().toISOString().slice(0, 10),
      notes: "",
      photoUrls: [],
      itemsDistributed: [{ item: "", quantity: 0, unit: "kg" }],
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "itemsDistributed" });

  const onSubmit = async (values: ReliefInput) => {
    await createRelief.mutateAsync(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Log Relief Distribution</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-slot="modal-body" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>District</Label>
            <Controller
              name="districtId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <DistrictSelect value={field.value} onChange={field.onChange} />}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Location</Label>
            <Input {...register("locationName", { required: true })} placeholder="Konagaon Bazar, Rajnagar" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Distributed By</Label>
            <Input {...register("distributedBy", { required: true })} placeholder="Bangladesh Red Crescent Society" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Families Served</Label>
              <Input type="number" {...register("familiesServed", { required: true, valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Date</Label>
              <Input type="date" {...register("distributionDate", { required: true })} />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Items Distributed</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ item: "", quantity: 0, unit: "kg" })}
              >
                <Plus className="h-3.5 w-3.5" /> Add item
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[1fr_5.5rem_4.5rem_auto] gap-2 items-center">
                <Input {...register(`itemsDistributed.${index}.item`, { required: true })} placeholder="Rice" />
                <Input
                  type="number"
                  {...register(`itemsDistributed.${index}.quantity`, { required: true, valueAsNumber: true })}
                  placeholder="500"
                />
                <Input {...register(`itemsDistributed.${index}.unit`, { required: true })} placeholder="kg" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive"
                  disabled={fields.length === 1}
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Evidence Photo</Label>
            <Controller
              name="photoUrls"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value?.[0] ?? null}
                  onChange={(url) => field.onChange(url ? [url] : [])}
                  label="Add photo"
                  folder="relief"
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Notes</Label>
            <Textarea {...register("notes")} rows={2} />
          </div>

          </div>
          <SheetFooter>
            <Button type="submit" disabled={createRelief.isPending} className="font-semibold">
              Log Distribution
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function ReliefLogView() {
  const { data, isLoading } = useReliefLogs({ limit: 100 });
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.data ?? []).filter((log) => {
      if (district && String(log.districtId) !== district) return false;
      return (
        !q ||
        `${log.locationName} ${log.distributedBy} ${log.district.nameEn} ${log.itemsDistributed.map((i) => i.item).join(" ")}`
          .toLowerCase()
          .includes(q)
      );
    });
  }, [data, search, district]);
  const [sheetOpen, setSheetOpen] = useState(false);

  const columns: Column<ReliefLog>[] = [
    {
      key: "location",
      header: "Location",
      primary: true,
      render: (log) => (
        <span className="font-semibold text-foreground truncate max-w-full sm:max-w-48 block">
          {log.locationName}
        </span>
      ),
    },
    { key: "district", header: "District", render: (log) => log.district.nameEn },
    {
      key: "items",
      header: "Items",
      render: (log) => (
        <span className="text-muted-foreground line-clamp-2 sm:max-w-56 sm:truncate block">
          {log.itemsDistributed.map((i) => `${i.item} (${i.quantity}${i.unit})`).join(", ")}
        </span>
      ),
    },
    { key: "families", header: "Families", render: (log) => log.familiesServed },
    {
      key: "date",
      header: "Date",
      render: (log) => (
        <span className="text-muted-foreground">
          {new Date(log.distributionDate).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "by",
      header: "By",
      render: (log) => (
        <span className="text-muted-foreground sm:max-w-40 sm:truncate block">{log.distributedBy}</span>
      ),
    },
    {
      key: "photo",
      header: "Photo",
      align: "right",
      render: (log) =>
        log.photoUrls[0] ? (
          <a href={log.photoUrls[0]} target="_blank" rel="noreferrer" className="inline-block">
            <Image
              src={log.photoUrls[0]}
              alt="Distribution evidence"
              width={36}
              height={36}
              className="h-9 w-9 rounded-lg object-cover border border-border"
            />
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        getRowKey={(log) => log.id}
        resetKey={`${search}|${district}`}
        toolbar={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search location, team or item…" className="lg:max-w-sm" />
            <DistrictFilter value={district} onChange={setDistrict} />
            <Button className="lg:ml-auto" onClick={() => setSheetOpen(true)}>
              <Plus className="h-4 w-4 text-lime" />
              Log distribution
            </Button>
          </>
        }
        emptyIcon={Package}
        emptyTitle="No relief logs yet"
        emptyDescription="Record where relief has been distributed to track coverage."
        emptyAction={
          <Button className="gap-2 font-semibold" onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            Log Distribution
          </Button>
        }
      />

      <ReliefFormSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
}
