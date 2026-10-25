"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Send, Users, Truck, Package, Loader2, Undo2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useReliefStock,
  useReliefAssignments,
  useReliefHoldings,
  useCreateAssignment,
  useCancelAssignment,
} from "@/lib/hooks/use-relief";
import { useAssignableVolunteers } from "@/lib/hooks/use-volunteers";

interface AssignForm {
  item: string;
  quantity: number;
  volunteerId: string;
  note?: string;
}

const STATUS_VARIANT = {
  ASSIGNED: "warning",
  DELIVERED: "success",
  CANCELLED: "neutral",
} as const;

function AssignDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const { data: stock } = useReliefStock();
  const { options: volunteers } = useAssignableVolunteers();
  const createAssignment = useCreateAssignment();

  const { register, handleSubmit, reset, setValue, control } = useForm<AssignForm>({
    defaultValues: { item: "", quantity: 1, volunteerId: "", note: "" },
  });
  const item = useWatch({ control, name: "item" });
  const volunteerId = useWatch({ control, name: "volunteerId" });

  const onSubmit = async (values: AssignForm) => {
    await createAssignment.mutateAsync({
      item: values.item,
      quantity: Number(values.quantity),
      volunteerId: values.volunteerId,
      note: values.note || undefined,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Relief</DialogTitle>
          <DialogDescription>Give relief from the store to a volunteer.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Item from store</Label>
            <Select value={item} onValueChange={(v) => setValue("item", (v as string) ?? "")}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Select item...">
                  {(v: string) => {
                    const s = stock?.find((x) => x.item === v);
                    return s ? `${s.item} (${s.quantity} ${s.unit} left)` : "Select item...";
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {stock?.map((s) => (
                  <SelectItem key={s.id} value={s.item} disabled={s.quantity <= 0}>
                    {s.item} ({s.quantity} {s.unit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Quantity</Label>
            <Input type="number" min={1} {...register("quantity", { required: true, valueAsNumber: true })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Volunteer</Label>
            <Select value={volunteerId} onValueChange={(v) => setValue("volunteerId", (v as string) ?? "")}>
              <SelectTrigger className="w-full rounded-lg">
                <SelectValue placeholder="Select volunteer...">
                  {(v: string) => volunteers.find((x) => x.id === v)?.name ?? "Select volunteer..."}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {volunteers.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Note (optional)</Label>
            <Input {...register("note")} placeholder="For Feni shelter drop-off" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="font-semibold">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createAssignment.isPending || !item || !volunteerId}
              className="gap-2 font-semibold"
            >
              {createAssignment.isPending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Assign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ReliefAssignmentsView() {
  const { data: assignments, isLoading } = useReliefAssignments();
  const { data: holdings } = useReliefHoldings();
  const cancelAssignment = useCancelAssignment();
  const [assignOpen, setAssignOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Assign relief to volunteers and track who holds and delivers what.
        </p>
        <Button className="gap-2 font-semibold shrink-0" onClick={() => setAssignOpen(true)}>
          <Send className="size-4" />
          Assign Relief
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Holdings */}
        <Card className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Who Holds What</h3>
          </div>
          {holdings && holdings.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {holdings.map((h) => {
                const holdingItems = Object.entries(h.holding);
                const deliveredItems = Object.entries(h.delivered);
                return (
                  <div key={h.volunteerId} className="py-3">
                    <p className="text-sm font-bold text-foreground">{h.name}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {holdingItems.length > 0 ? (
                        holdingItems.map(([itm, v]) => (
                          <Badge key={itm} variant="warning">
                            Holding: {itm} {v.quantity}
                            {v.unit}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">Nothing held</span>
                      )}
                      {deliveredItems.map(([itm, v]) => (
                        <Badge key={itm} variant="success" dot>
                          Delivered: {itm} {v.quantity}
                          {v.unit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Package} title="No relief assigned yet" />
          )}
        </Card>

        {/* Assignment ledger */}
        <Card className="rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="size-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Assignment Ledger</h3>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : assignments && assignments.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {assignments.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {a.item} · {a.quantity}
                      {a.unit}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {a.volunteer?.name}
                      {a.shelter
                        ? ` → ${a.shelter.name}`
                        : a.supplyRequest
                          ? ` → for ${a.supplyRequest.shelter.name}`
                          : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Badge variant={STATUS_VARIANT[a.status]}>{a.status.toLowerCase()}</Badge>
                    {a.status === "ASSIGNED" && (
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        title="Cancel and return items to the store"
                        aria-label="Cancel assignment"
                        disabled={cancelAssignment.isPending}
                        onClick={() => {
                          if (window.confirm(`Cancel ${a.quantity} ${a.unit} ${a.item} held by ${a.volunteer?.name}? The items go back to the store.`)) {
                            cancelAssignment.mutate(a.id);
                          }
                        }}
                      >
                        <Undo2 className="size-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Truck} title="No assignments yet" />
          )}
        </Card>
      </div>

      <AssignDialog open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}
