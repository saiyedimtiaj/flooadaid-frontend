"use client";

import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Pagination } from "@/components/dashboard/pagination";
import { FilterSelect, SearchInput, usePaged } from "@/components/dashboard/list-toolbar";
import { Send, Users, Truck, Package, Loader2, Undo2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { SearchableSelect } from "@/components/ui/searchable-select";
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-slot="modal-body" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Item from store</Label>
            <SearchableSelect
              value={item ?? ""}
              onValueChange={(v) => setValue("item", v)}
              options={(stock ?? []).filter((s) => s.quantity > 0).map((s) => ({ value: s.item, label: s.item, description: `${s.quantity} ${s.unit} in store` }))}
              placeholder="Select item..."
              searchPlaceholder="Search store items…"
              emptyText="No items in stock"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Quantity</Label>
            <Input type="number" min={1} {...register("quantity", { required: true, valueAsNumber: true })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Volunteer</Label>
            <SearchableSelect
              value={volunteerId ?? ""}
              onValueChange={(v) => setValue("volunteerId", v)}
              options={volunteers.map((v) => ({ value: v.id, label: v.name }))}
              placeholder="Select volunteer..."
              searchPlaceholder="Search volunteers…"
              emptyText="No verified volunteers available"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Note (optional)</Label>
            <Input {...register("note")} placeholder="For Feni shelter drop-off" />
          </div>

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
  const [ledgerStatus, setLedgerStatus] = useState("");
  const [ledgerSearch, setLedgerSearch] = useState("");
  const ledger = useMemo(() => {
    const q = ledgerSearch.trim().toLowerCase();
    return (assignments ?? []).filter((a) => {
      if (ledgerStatus && a.status !== ledgerStatus) return false;
      return !q || `${a.item} ${a.volunteer?.name ?? ""} ${a.shelter?.name ?? ""}`.toLowerCase().includes(q);
    });
  }, [assignments, ledgerStatus, ledgerSearch]);
  const ledgerPage = usePaged(ledger, 8, `${ledgerStatus}|${ledgerSearch}`);
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

        <Card className="rounded-2xl p-6">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-lime">
                <Truck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Assignment ledger</h3>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <SearchInput value={ledgerSearch} onChange={setLedgerSearch} placeholder="Item, volunteer or shelter…" />
              <FilterSelect
                value={ledgerStatus}
                onChange={setLedgerStatus}
                allLabel="All statuses"
                options={[
                  { value: "ASSIGNED", label: "Holding" },
                  { value: "DELIVERED", label: "Delivered" },
                  { value: "CANCELLED", label: "Cancelled" },
                ]}
                className="sm:w-40"
              />
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : ledgerPage.pageItems.length > 0 ? (
            <div className="flex flex-col divide-y divide-border">
              {ledgerPage.pageItems.map((a) => (
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
            <EmptyState icon={Truck} title={ledgerSearch || ledgerStatus ? "No assignments match" : "No assignments yet"} />
          )}
          {ledgerPage.total > 0 && (
            <Pagination
              className="mt-4 border-t border-border pt-4"
              page={ledgerPage.page}
              totalPages={ledgerPage.totalPages}
              total={ledgerPage.total}
              pageSize={8}
              onChange={ledgerPage.setPage}
            />
          )}
        </Card>
      </div>

      <AssignDialog open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}
