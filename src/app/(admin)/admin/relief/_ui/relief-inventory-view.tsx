"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Plus, Boxes, Package, Truck, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  useReliefStock,
  useReliefSummary,
  useUpsertStock,
  type ReliefStock,
} from "@/lib/hooks/use-relief";

interface StockForm {
  item: string;
  unit: string;
  quantity: number;
}

function StockSheet({
  open,
  onOpenChange,
  editing,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  editing: ReliefStock | null;
}) {
  const upsert = useUpsertStock();
  const { register, handleSubmit, reset } = useForm<StockForm>({
    values: editing
      ? { item: editing.item, unit: editing.unit, quantity: editing.quantity }
      : { item: "", unit: "kg", quantity: 0 },
  });

  const onSubmit = async (values: StockForm) => {
    await upsert.mutateAsync({
      item: values.item,
      unit: values.unit,
      quantity: Number(values.quantity),
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{editing ? "Update stock" : "Add stock item"}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 px-4">
          <div className="flex flex-col gap-1.5">
            <Label>Item name</Label>
            <Input
              {...register("item", { required: true })}
              placeholder="Rice (kg)"
              readOnly={!!editing}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>Unit</Label>
              <Input {...register("unit", { required: true })} placeholder="kg" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Quantity in store</Label>
              <Input type="number" {...register("quantity", { required: true, valueAsNumber: true })} />
            </div>
          </div>
          <SheetFooter className="px-0">
            <Button type="submit" disabled={upsert.isPending} className="font-semibold">
              {editing ? "Update Stock" : "Add Item"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

export function ReliefInventoryView() {
  const { data: stock, isLoading } = useReliefStock();
  const { data: summary } = useReliefSummary();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState<ReliefStock | null>(null);

  const openNew = () => {
    setEditing(null);
    setSheetOpen(true);
  };
  const openEdit = (s: ReliefStock) => {
    setEditing(s);
    setSheetOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Stock Items" value={summary?.totalItems} icon={Boxes} tint="primary" />
        <StatCard label="Total Units" value={summary?.totalUnits} icon={Package} tint="teal" />
        <StatCard label="Active Assignments" value={summary?.activeAssignments} icon={Users} tint="warning" />
        <StatCard label="Deliveries" value={summary?.deliveries} icon={Truck} tint="success" />
      </div>

      <Card className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground">Central Store Inventory</h3>
          <Button size="sm" className="gap-2 font-semibold" onClick={openNew}>
            <Plus className="h-4 w-4" /> Add / Update Item
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : stock && stock.length > 0 ? (
          <div className="flex flex-col divide-y divide-border">
            {stock.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center size-9 rounded-xl bg-primary/10 text-primary shrink-0">
                    <Package className="size-4" />
                  </div>
                  <span className="text-sm font-semibold text-foreground truncate">{s.item}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-sm font-black tabular-nums text-foreground">
                    {s.quantity}
                    <span className="text-xs font-medium text-muted-foreground ml-1">{s.unit}</span>
                  </span>
                  <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Boxes}
            title="No stock added yet"
            description="Add items to the central store so you can assign them to volunteers."
            action={
              <Button className="gap-2 font-semibold" onClick={openNew}>
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            }
          />
        )}
      </Card>

      <StockSheet open={sheetOpen} onOpenChange={setSheetOpen} editing={editing} />
    </div>
  );
}
