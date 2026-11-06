"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import {
  AlertTriangle,
  Archive,
  Bath,
  Building2,
  Check,
  Droplets,
  Home,
  Loader2,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Power,
  RotateCcw,
  Stethoscope,
  Users,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/dashboard/empty-state";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { StatCard } from "@/components/dashboard/stat-card";
import { Pagination } from "@/components/dashboard/pagination";
import { DistrictFilter, FilterSelect, SearchInput, usePaged } from "@/components/dashboard/list-toolbar";
import { LocationPicker } from "@/components/map/location-picker";
import { toast } from "sonner";
import {
  useCreateShelter,
  useDeleteShelter,
  useShelters,
  useUpdateShelter,
  useUpdateShelterOccupancy,
  type ShelterInput,
} from "@/lib/hooks/use-shelters";
import type { Shelter } from "@/lib/types/api";

/** Create a shelter, or edit one when `shelter` is given (remount via `key` to switch). */
function ShelterFormSheet({
  open,
  onOpenChange,
  shelter,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelter?: Shelter | null;
}) {
  const createShelter = useCreateShelter();
  const updateShelter = useUpdateShelter();
  const isEdit = !!shelter;
  const { register, handleSubmit, control, reset, setValue } = useForm<ShelterInput>({
    defaultValues: shelter
      ? {
          name: shelter.name,
          nameBn: shelter.nameBn ?? "",
          address: shelter.address,
          districtId: shelter.districtId,
          latitude: shelter.latitude,
          longitude: shelter.longitude,
          capacity: shelter.capacity,
          contactPhone: shelter.contactPhone ?? "",
          contactName: shelter.contactName ?? "",
          hasFood: shelter.hasFood,
          hasWater: shelter.hasWater,
          hasMedical: shelter.hasMedical,
          hasElectricity: shelter.hasElectricity,
          hasToilet: shelter.hasToilet,
        }
      : {
          name: "",
          nameBn: "",
          address: "",
          latitude: undefined,
          longitude: undefined,
          capacity: undefined,
          contactPhone: "",
          contactName: "",
          hasFood: false,
          hasWater: false,
          hasMedical: false,
          hasElectricity: false,
          hasToilet: false,
        },
  });

  const lat = useWatch({ control, name: "latitude" });
  const lng = useWatch({ control, name: "longitude" });
  const pickedLocation =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;

  const onSubmit = async (values: ShelterInput) => {
    if (typeof values.latitude !== "number" || typeof values.longitude !== "number") {
      toast.error("Please set the shelter location on the map");
      return;
    }
    const data = { ...values, nameBn: values.nameBn || undefined };
    if (shelter) {
      await updateShelter.mutateAsync({ id: shelter.id, data });
    } else {
      await createShelter.mutateAsync(data);
      reset();
    }
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{isEdit ? "Edit Shelter" : "New Shelter"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-slot="modal-body" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input {...register("name", { required: true })} placeholder="Banshkhali High School Shelter" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Name in Bangla (optional)</Label>
            <Input {...register("nameBn")} placeholder="বাঁশখালী উচ্চ বিদ্যালয় আশ্রয়কেন্দ্র" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Address</Label>
            <Input {...register("address", { required: true })} placeholder="Ward 3, Banshkhali, Chattogram" />
          </div>
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
            <Label>Location on Map</Label>
            <p className="text-xs text-muted-foreground -mt-0.5">
              Tap the shelter&apos;s spot on the map, or use your current location.
            </p>
            <LocationPicker
              value={pickedLocation}
              onChange={(loc) => {
                setValue("latitude", loc.lat, { shouldValidate: true });
                setValue("longitude", loc.lng, { shouldValidate: true });
              }}
              heightClass="h-64"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Capacity</Label>
            <Input type="number" {...register("capacity", { required: true, valueAsNumber: true })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Contact Name</Label>
              <Input {...register("contactName")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Contact Phone</Label>
              <Input {...register("contactPhone")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["hasFood", "Food"],
                ["hasWater", "Water"],
                ["hasMedical", "Medical"],
                ["hasElectricity", "Electricity"],
                ["hasToilet", "Toilet"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm font-medium">
                <Controller
                  name={key}
                  control={control}
                  render={({ field }) => (
                    <Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
                  )}
                />
                {label}
              </label>
            ))}
          </div>
          </div>
          <SheetFooter>
            <Button
              type="submit"
              disabled={createShelter.isPending || updateShelter.isPending}
              className="font-semibold"
            >
              {isEdit ? "Save Changes" : "Add Shelter"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function occupancyTint(rate: number) {
  if (rate >= 80) return { key: "full", fill: "bg-destructive", text: "text-destructive", chip: "bg-destructive/10 text-destructive", label: "Near capacity" };
  if (rate >= 50) return { key: "filling", fill: "bg-amber-500", text: "text-amber-600", chip: "bg-amber-500/12 text-amber-700", label: "Filling up" };
  return { key: "available", fill: "bg-emerald-500", text: "text-emerald-600", chip: "bg-emerald-500/10 text-emerald-700", label: "Available" };
}

const FACILITIES = [
  { key: "hasFood", label: "Food", icon: UtensilsCrossed },
  { key: "hasWater", label: "Water", icon: Droplets },
  { key: "hasMedical", label: "Medical", icon: Stethoscope },
  { key: "hasElectricity", label: "Power", icon: Zap },
  { key: "hasToilet", label: "Toilet", icon: Bath },
] as const;

const CAPACITY_OPTIONS = [
  { value: "available", label: "Available (<50%)" },
  { value: "filling", label: "Filling up (50–79%)" },
  { value: "full", label: "Near capacity (80%+)" },
];

const PAGE_SIZE = 9;

function OccupancyDialog({
  shelter,
  open,
  onOpenChange,
}: {
  shelter: Shelter;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const updateOccupancy = useUpdateShelterOccupancy();
  const [value, setValue] = useState(String(shelter.currentOccupancy));
  const dirty = Number(value) !== shelter.currentOccupancy && value !== "";
  const previewRate = Math.min(
    100,
    Math.round((Number(value || 0) / shelter.capacity) * 100),
  );

  const submit = async () => {
    await updateOccupancy.mutateAsync({ id: shelter.id, currentOccupancy: Number(value) });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Occupancy</DialogTitle>
          <DialogDescription>{shelter.name}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="occ">Current occupancy</Label>
            <Input
              id="occ"
              type="number"
              min={0}
              max={shelter.capacity}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Capacity: {shelter.capacity} people · {previewRate}% full
            </p>
          </div>
          <Progress value={previewRate} className="h-2" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="font-semibold">
            Cancel
          </Button>
          <Button onClick={submit} disabled={!dirty || updateOccupancy.isPending} className="gap-2 font-semibold">
            {updateOccupancy.isPending ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ShelterCard({
  shelter,
  onDelete,
  onEdit,
}: {
  shelter: Shelter;
  onDelete: (shelter: Shelter) => void;
  onEdit: (shelter: Shelter) => void;
}) {
  const updateShelter = useUpdateShelter();
  const [occOpen, setOccOpen] = useState(false);
  const rate = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
  const tint = occupancyTint(rate);
  const free = Math.max(0, shelter.capacity - shelter.currentOccupancy);

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-lift">
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-lime">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">{shelter.name}</h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 shrink-0" />
              {shelter.address}, {shelter.district.nameEn}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${shelter.isActive ? tint.chip : "bg-muted text-muted-foreground"}`}>
            {shelter.isActive ? tint.label : "Closed"}
          </span>
        </div>

        <div className="rounded-xl bg-muted/50 p-3.5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Sheltered</p>
              <p className="text-2xl font-bold tabular-nums text-foreground">
                {shelter.currentOccupancy.toLocaleString()}
                <span className="text-sm font-medium text-muted-foreground"> / {shelter.capacity.toLocaleString()}</span>
              </p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold tabular-nums ${tint.text}`}>{rate}%</p>
              <p className="text-xs text-muted-foreground">{free.toLocaleString()} spaces left</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
            <div className={`h-full rounded-full ${tint.fill}`} style={{ width: `${Math.min(100, rate)}%` }} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {FACILITIES.map((f) => {
            const on = shelter[f.key];
            return (
              <span
                key={f.key}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  on ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground/60 line-through"
                }`}
              >
                <f.icon className="h-3 w-3" />
                {f.label}
              </span>
            );
          })}
        </div>

        {shelter.contactName && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {shelter.contactName}
            {shelter.contactPhone ? ` · ${shelter.contactPhone}` : ""}
          </p>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-t border-border bg-muted/40 p-3">
        {shelter.isActive ? (
          <Button size="sm" onClick={() => setOccOpen(true)}>
            <Users className="h-4 w-4 text-lime" />
            Update occupancy
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={updateShelter.isPending}
            onClick={() => updateShelter.mutate({ id: shelter.id, data: { isActive: true } })}
          >
            <RotateCcw className="h-4 w-4 text-lime" />
            Reopen shelter
          </Button>
        )}
        <Button variant="outline" size="sm" aria-label="Edit shelter" onClick={() => onEdit(shelter)}>
          <Pencil className="h-4 w-4" />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        {shelter.isActive && (
          <Button
            variant="outline"
            size="sm"
            aria-label="Close shelter"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(shelter)}
          >
            <Power className="h-4 w-4" />
            <span className="hidden sm:inline">Close</span>
          </Button>
        )}
      </div>

      <OccupancyDialog shelter={shelter} open={occOpen} onOpenChange={setOccOpen} />
    </div>
  );
}

export default function AdminSheltersPage() {
  const [showClosed, setShowClosed] = useState(false);
  const [search, setSearch] = useState("");
  const [district, setDistrict] = useState("");
  const [capacity, setCapacity] = useState("");
  const { data, isLoading } = useShelters({ limit: 100, isActive: !showClosed });
  const deleteShelter = useDeleteShelter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Shelter | null>(null);
  const [toDelete, setToDelete] = useState<Shelter | null>(null);

  const shelters = useMemo(() => data?.data ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shelters.filter((s) => {
      if (district && String(s.districtId) !== district) return false;
      if (capacity && occupancyTint(Math.round((s.currentOccupancy / s.capacity) * 100)).key !== capacity) return false;
      if (q && !`${s.name} ${s.address} ${s.district.nameEn} ${s.contactName ?? ""}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [shelters, search, district, capacity]);
  const paged = usePaged(filtered, PAGE_SIZE, `${showClosed}|${search}|${district}|${capacity}`);

  const totals = useMemo(() => {
    const capacityTotal = shelters.reduce((n, s) => n + s.capacity, 0);
    const sheltered = shelters.reduce((n, s) => n + s.currentOccupancy, 0);
    const nearFull = shelters.filter((s) => s.currentOccupancy / s.capacity >= 0.8).length;
    return { capacityTotal, sheltered, nearFull };
  }, [shelters]);

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (shelter: Shelter) => {
    setEditing(shelter);
    setSheetOpen(true);
  };
  const hasFilters = !!(search || district || capacity);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={MapPin}
        title="Shelter Management"
        description="Add, edit and monitor emergency shelters"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 text-lime" />
            Add shelter
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label={showClosed ? "Closed shelters" : "Open shelters"} value={shelters.length} icon={Building2} isLoading={isLoading} highlight />
        <StatCard label="Total capacity" value={totals.capacityTotal} icon={Home} isLoading={isLoading} />
        <StatCard label="People sheltered" value={totals.sheltered} icon={Users} isLoading={isLoading} />
        <StatCard label="Near capacity" value={totals.nearFull} icon={AlertTriangle} tint="destructive" sub="80% or more full" isLoading={isLoading} />
      </div>

      <section className="rounded-2xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-4 xl:flex-row xl:items-center">
          <div className="inline-flex shrink-0 self-start rounded-full border border-border bg-background p-1">
            {([false, true] as const).map((closed) => (
              <button
                key={String(closed)}
                type="button"
                onClick={() => setShowClosed(closed)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  showClosed === closed ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {closed ? "Closed" : "Open"}
              </button>
            ))}
          </div>
          <SearchInput value={search} onChange={setSearch} placeholder="Search shelter, address or contact…" className="xl:max-w-sm" />
          <DistrictFilter value={district} onChange={setDistrict} />
          <FilterSelect value={capacity} onChange={setCapacity} options={CAPACITY_OPTIONS} allLabel="Any capacity" className="sm:w-56" />
        </div>

        <div className="p-4">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4 rounded-2xl border border-border p-5">
                  <div className="flex gap-3">
                    <Skeleton className="h-11 w-11 rounded-xl" />
                    <div className="flex flex-1 flex-col gap-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-full rounded-xl" />
                  <div className="flex gap-1.5">
                    {Array.from({ length: 4 }).map((__, j) => (
                      <Skeleton key={j} className="h-6 w-16 rounded-full" />
                    ))}
                  </div>
                  <Skeleton className="h-9 w-full rounded-xl" />
                </div>
              ))}
            </div>
          ) : paged.pageItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paged.pageItems.map((shelter) => (
                <ShelterCard key={shelter.id} shelter={shelter} onDelete={setToDelete} onEdit={openEdit} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={showClosed ? Archive : Building2}
              title={hasFilters ? "No shelters match these filters" : showClosed ? "No closed shelters" : "No shelters yet"}
              description={
                hasFilters
                  ? "Try another district, capacity level or search term."
                  : showClosed
                    ? "Shelters you close will be kept here, so you can reopen them any time."
                    : "Add the first emergency shelter so people can find a safe place nearby."
              }
              action={
                hasFilters ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch("");
                      setDistrict("");
                      setCapacity("");
                    }}
                  >
                    Clear filters
                  </Button>
                ) : showClosed ? (
                  <Button variant="outline" onClick={() => setShowClosed(false)}>
                    View open shelters
                  </Button>
                ) : (
                  <Button onClick={openCreate}>
                    <Plus className="h-4 w-4 text-lime" />
                    Add shelter
                  </Button>
                )
              }
            />
          )}
        </div>

        {paged.total > 0 && (
          <div className="border-t border-border p-4">
            <Pagination page={paged.page} totalPages={paged.totalPages} total={paged.total} pageSize={PAGE_SIZE} onChange={paged.setPage} />
          </div>
        )}
      </section>

      <ShelterFormSheet
        key={editing?.id ?? "new"}
        shelter={editing}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Close this shelter?"
        description={
          toDelete
            ? `"${toDelete.name}" will be hidden from the public map. Its relief history is kept and you can reopen it from the Closed tab.`
            : undefined
        }
        confirmLabel="Close Shelter"
        variant="destructive"
        isLoading={deleteShelter.isPending}
        onConfirm={() => {
          if (toDelete) deleteShelter.mutate(toDelete.id);
        }}
      />
    </div>
  );
}
