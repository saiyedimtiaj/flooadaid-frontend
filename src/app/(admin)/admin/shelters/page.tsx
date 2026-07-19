"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Plus, MapPin, Trash2, Check, Users, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
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
import { LocationPicker } from "@/components/map/location-picker";
import { toast } from "sonner";
import {
  useCreateShelter,
  useDeleteShelter,
  useShelters,
  useUpdateShelterOccupancy,
  type ShelterInput,
} from "@/lib/hooks/use-shelters";
import type { Shelter } from "@/lib/types/api";

function ShelterFormSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const createShelter = useCreateShelter();
  const { register, handleSubmit, control, reset, setValue, watch } = useForm<ShelterInput>({
    defaultValues: {
      name: "",
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

  const lat = watch("latitude");
  const lng = watch("longitude");
  const pickedLocation =
    typeof lat === "number" && typeof lng === "number" ? { lat, lng } : null;

  const onSubmit = async (values: ShelterInput) => {
    if (typeof values.latitude !== "number" || typeof values.longitude !== "number") {
      toast.error("Please set the shelter location on the map");
      return;
    }
    await createShelter.mutateAsync(values);
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>New Shelter</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1.5">
            <Label>Name</Label>
            <Input {...register("name", { required: true })} placeholder="Banshkhali High School Shelter" />
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
          <SheetFooter className="px-0">
            <Button type="submit" disabled={createShelter.isPending} className="font-semibold">
              Add Shelter
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function occupancyTint(rate: number) {
  if (rate >= 80) return { bar: "text-destructive", chip: "bg-destructive/10 text-destructive", label: "Near capacity" };
  if (rate >= 50) return { bar: "text-amber-500", chip: "bg-amber-500/10 text-amber-600 dark:text-amber-500", label: "Filling up" };
  return { bar: "text-emerald-500", chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500", label: "Available" };
}

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
}: {
  shelter: Shelter;
  onDelete: (shelter: Shelter) => void;
}) {
  const [occOpen, setOccOpen] = useState(false);
  const rate = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
  const tint = occupancyTint(rate);

  return (
    <Card className="group rounded-3xl border border-border bg-card p-5 flex flex-col gap-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm hover:border-primary/25">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-foreground truncate">{shelter.name}</h3>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {shelter.district.nameEn} · {shelter.address}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
          onClick={() => onDelete(shelter)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${tint.chip}`}>
          {tint.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
        <span>
          {shelter.currentOccupancy} / {shelter.capacity} people
        </span>
        <span className={tint.bar}>{rate}%</span>
      </div>
      <Progress value={rate} className="h-1.5" />

      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 mt-1 font-semibold"
        onClick={() => setOccOpen(true)}
      >
        <Users className="h-3.5 w-3.5" />
        Update Occupancy
      </Button>

      <OccupancyDialog shelter={shelter} open={occOpen} onOpenChange={setOccOpen} />
    </Card>
  );
}

export default function AdminSheltersPage() {
  const { data, isLoading } = useShelters({ limit: 50 });
  const deleteShelter = useDeleteShelter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Shelter | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={MapPin}
        title="Shelter Management"
        description="Add, edit and monitor emergency shelters"
        action={
          <Button className="gap-2 font-semibold" onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Shelter
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-52 w-full rounded-3xl" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.data.map((shelter) => (
            <ShelterCard key={shelter.id} shelter={shelter} onDelete={setToDelete} />
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card">
          <EmptyState
            icon={MapPin}
            title="No shelters added yet"
            description="Add emergency shelters so people can find safe places nearby."
            action={
              <Button className="gap-2 font-semibold" onClick={() => setSheetOpen(true)}>
                <Plus className="h-4 w-4" />
                Add Shelter
              </Button>
            }
          />
        </Card>
      )}

      <ShelterFormSheet open={sheetOpen} onOpenChange={setSheetOpen} />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Remove this shelter?"
        description={toDelete ? `"${toDelete.name}" will be permanently removed from the map.` : undefined}
        confirmLabel="Remove Shelter"
        variant="destructive"
        isLoading={deleteShelter.isPending}
        onConfirm={() => {
          if (toDelete) deleteShelter.mutate(toDelete.id);
        }}
      />
    </div>
  );
}
