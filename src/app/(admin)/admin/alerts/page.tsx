"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { AlertOctagon, Droplets, MapPinned, Plus, Radar, Trash2, Pencil } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
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
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { StatCard } from "@/components/dashboard/stat-card";
import { DistrictFilter, FilterSelect, SearchInput } from "@/components/dashboard/list-toolbar";
import { timeAgo } from "@/lib/format-time-ago";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { AlertSeverityBadge } from "@/components/dashboard/alert-severity-badge";
import { useAlerts, useCreateAlert, useDeleteAlert, useUpdateAlert, type AlertInput } from "@/lib/hooks/use-alerts";
import type { Alert, AlertSeverity } from "@/lib/types/api";

const SEVERITIES: AlertSeverity[] = ["NORMAL", "WATCH", "WARNING", "DANGER", "CRITICAL"];

/** ISO -> value for <input type="datetime-local"> in the browser's timezone. */
function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type AlertFormValues = Omit<AlertInput, "expiresAt"> & { expiresAt: string };

function AlertFormSheet({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: Alert | null;
}) {
  const createAlert = useCreateAlert();
  const updateAlert = useUpdateAlert();
  const { register, handleSubmit, control, reset } = useForm<AlertFormValues>({
    values: editing
      ? {
          title: editing.title,
          titleBn: editing.titleBn ?? "",
          description: editing.description,
          severity: editing.severity,
          districtId: editing.districtId,
          waterLevelCm: editing.waterLevelCm ?? undefined,
          expiresAt: toLocalInput(editing.expiresAt),
        }
      : {
          title: "",
          titleBn: "",
          description: "",
          severity: "WATCH",
          districtId: undefined as unknown as number,
          waterLevelCm: undefined,
          expiresAt: "",
        },
  });

  const severity = useWatch({ control, name: "severity" });
  const broadcasts = severity === "WARNING" || severity === "DANGER" || severity === "CRITICAL";

  const onSubmit = async ({ expiresAt, ...rest }: AlertFormValues) => {
    const expiry = expiresAt ? new Date(expiresAt).toISOString() : null;
    if (editing) {
      // null clears a previously set expiry
      await updateAlert.mutateAsync({ id: editing.id, data: { ...rest, expiresAt: expiry } });
    } else {
      await createAlert.mutateAsync({ ...rest, expiresAt: expiry ?? undefined });
      reset();
    }
    onOpenChange(false);
  };

  const isSubmitting = createAlert.isPending || updateAlert.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{editing ? "Edit Alert" : "New Flood Alert"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-slot="modal-body" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Title</Label>
            <Input {...register("title", { required: true })} placeholder="Flash Flood Warning — Banshkhali" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Title (Bangla)</Label>
            <Input {...register("titleBn")} placeholder="আকস্মিক বন্যা সতর্কতা" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Description</Label>
            <Textarea {...register("description", { required: true })} rows={3} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Severity</Label>
            <Controller
              name="severity"
              control={control}
              render={({ field }) => (
                <SearchableSelect
                  value={field.value ?? ""}
                  onValueChange={(v) => v && field.onChange(v)}
                  options={SEVERITIES.map((sv) => ({ value: sv, label: sv.charAt(0) + sv.slice(1).toLowerCase() }))}
                  placeholder="Select severity..."
                  searchPlaceholder="Search severity…"
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>District</Label>
            <Controller
              name="districtId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <DistrictSelect value={field.value} onChange={field.onChange} />
              )}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Water Level (cm)</Label>
            <Input type="number" {...register("waterLevelCm", { valueAsNumber: true })} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Expires at (optional)</Label>
            <Input type="datetime-local" {...register("expiresAt")} />
            <p className="text-xs text-muted-foreground">
              After this time the alert drops off the public map automatically. Leave empty to keep it until you deactivate it.
            </p>
          </div>
          {!editing && broadcasts && (
            <p className="text-xs rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 p-2.5">
              {severity} alerts notify every registered user whose home district matches.
            </p>
          )}
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isSubmitting} className="font-semibold">
              {editing ? "Save Changes" : "Create Alert"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default function AdminAlertsPage() {
  const { data, isLoading } = useAlerts({ limit: 100 });
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("");
  const [district, setDistrict] = useState("");
  const alerts = useMemo(() => data?.data ?? [], [data]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alerts.filter((a) => {
      if (severity && a.severity !== severity) return false;
      if (district && String(a.districtId) !== district) return false;
      return !q || `${a.title} ${a.description} ${a.district.nameEn}`.toLowerCase().includes(q);
    });
  }, [alerts, search, severity, district]);
  const severe = alerts.filter((a) => a.severity === "DANGER" || a.severity === "CRITICAL").length;
  const districtsOnAlert = new Set(alerts.map((a) => a.districtId)).size;
  const highestLevel = alerts.reduce((m, a) => Math.max(m, a.waterLevelCm ?? 0), 0);
  const deleteAlert = useDeleteAlert();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<Alert | null>(null);
  const [toDelete, setToDelete] = useState<Alert | null>(null);

  const openCreate = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const columns: Column<Alert>[] = [
    {
      key: "title",
      header: "Title",
      primary: true,
      render: (a) => (
        <div className="flex flex-col gap-1 min-w-0">
          <span className="font-semibold text-foreground truncate max-w-full sm:max-w-64">{a.title}</span>
          <div className="sm:hidden"><AlertSeverityBadge severity={a.severity} /></div>
        </div>
      ),
    },
    { key: "district", header: "District", render: (a) => a.district.nameEn },
    {
      key: "severity",
      header: "Severity",
      hideOnMobile: true,
      render: (a) => <AlertSeverityBadge severity={a.severity} />,
    },
    {
      key: "water",
      header: "Water Level",
      render: (a) => (a.waterLevelCm ? `${a.waterLevelCm} cm` : "—"),
    },
    {
      key: "posted",
      header: "Posted",
      render: (a) => <span className="text-muted-foreground">{timeAgo(a.updatedAt)}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (a) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              setEditing(a);
              setSheetOpen(true);
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation();
              setToDelete(a);
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Radar}
        title="Alert Management"
        description="Post and manage flood alerts across districts"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4 text-lime" />
            New alert
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active alerts" value={alerts.length} icon={Radar} isLoading={isLoading} highlight />
        <StatCard label="Danger & critical" value={severe} icon={AlertOctagon} tint="destructive" isLoading={isLoading} />
        <StatCard label="Districts on alert" value={districtsOnAlert} icon={MapPinned} isLoading={isLoading} />
        <StatCard label="Highest water level" value={highestLevel ? `${highestLevel} cm` : "—"} icon={Droplets} isLoading={isLoading} />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        getRowKey={(a) => a.id}
        resetKey={`${search}|${severity}|${district}`}
        toolbar={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search title, description or district…" className="lg:max-w-sm" />
            <FilterSelect
              value={severity}
              onChange={setSeverity}
              allLabel="All severities"
              options={[
                { value: "CRITICAL", label: "Critical" },
                { value: "DANGER", label: "Danger" },
                { value: "WARNING", label: "Warning" },
                { value: "WATCH", label: "Watch" },
                { value: "NORMAL", label: "Normal" },
              ]}
            />
            <DistrictFilter value={district} onChange={setDistrict} />
          </>
        }
        emptyIcon={Radar}
        emptyTitle={search || severity || district ? "No alerts match" : "No alerts posted yet"}
        emptyDescription={search || severity || district ? "Try another severity, district or search term." : "Create a flood alert to warn affected districts."}
        emptyAction={
          <Button className="gap-2 font-semibold" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            New Alert
          </Button>
        }
      />

      <AlertFormSheet open={sheetOpen} onOpenChange={setSheetOpen} editing={editing} />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(open) => !open && setToDelete(null)}
        title="Delete this alert?"
        description={toDelete ? `"${toDelete.title}" will be permanently removed.` : undefined}
        confirmLabel="Delete Alert"
        variant="destructive"
        isLoading={deleteAlert.isPending}
        onConfirm={() => {
          if (toDelete) deleteAlert.mutate(toDelete.id);
        }}
      />
    </div>
  );
}
