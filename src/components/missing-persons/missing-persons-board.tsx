"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Search,
  UserSearch,
  HeartHandshake,
  Plus,
  MapPin,
  Phone,
  EyeOff,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/dashboard/image-upload";
import { EmptyState } from "@/components/dashboard/empty-state";
import { useDistricts } from "@/lib/hooks/use-locations";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import {
  useMissingPersons,
  useMissingPersonSummary,
  useReportMissingPerson,
  useUpdateMissingPersonStatus,
  type MissingPersonInput,
} from "@/lib/hooks/use-missing-persons";
import { useT } from "@/lib/i18n/use-t";
import { timeAgo } from "@/lib/format-time-ago";
import type { MissingPerson, MissingPersonStatus, MissingPersonType } from "@/lib/types/api";
import { cn } from "@/lib/utils";

type Tab = "MISSING" | "FOUND" | "REUNITED";

const TAB_QUERY: Record<Tab, { type?: MissingPersonType; status: MissingPersonStatus }> = {
  MISSING: { type: "MISSING", status: "OPEN" },
  FOUND: { type: "FOUND", status: "OPEN" },
  REUNITED: { status: "REUNITED" },
};

function DistrictPicker({
  value,
  onChange,
  allowAll,
}: {
  value: number | undefined;
  onChange: (id: number | undefined) => void;
  allowAll?: boolean;
}) {
  const { data: districts } = useDistricts();
  const { t, pick } = useT();
  const label = (id: string) => {
    const d = districts?.find((x) => String(x.id) === id);
    return d ? pick(d.nameEn, d.nameBn) : allowAll ? t("missing.allDistricts") : t("sos.selectDistrict");
  };
  return (
    <Select
      value={value ? String(value) : allowAll ? "all" : ""}
      onValueChange={(v) => onChange(v && v !== "all" ? Number(v) : undefined)}
    >
      <SelectTrigger className="w-full data-[size=default]:h-11 rounded-xl">
        <SelectValue placeholder={t("sos.selectDistrict")}>{(v: string) => label(v)}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {allowAll && <SelectItem value="all">{t("missing.allDistricts")}</SelectItem>}
        {districts?.map((d) => (
          <SelectItem key={d.id} value={String(d.id)}>
            {pick(d.nameEn, d.nameBn)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function ReportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t } = useT();
  const { data: user } = useCurrentUser();
  const report = useReportMissingPerson();
  const [photo, setPhoto] = useState<string | null>(null);
  const { register, handleSubmit, control, reset } = useForm<MissingPersonInput>({
    defaultValues: {
      type: "MISSING",
      name: "",
      lastSeenText: "",
      description: "",
      reporterName: user?.name ?? "",
      reporterPhone: user?.phone ?? "",
    },
  });
  const type = useWatch({ control, name: "type" });

  const onSubmit = async (values: MissingPersonInput) => {
    await report.mutateAsync({
      ...values,
      age: Number.isFinite(values.age) ? values.age : undefined,
      gender: values.gender || undefined,
      description: values.description || undefined,
      photoUrls: photo ? [photo] : undefined,
    });
    reset();
    setPhoto(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("missing.form.title")}</DialogTitle>
          <DialogDescription>{t("missing.form.consent")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("missing.form.type")}</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-2">
                  {(["MISSING", "FOUND"] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => field.onChange(v)}
                      className={cn(
                        "rounded-xl border p-3 text-sm font-semibold text-left transition-colors",
                        field.value === v
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted/40",
                      )}
                    >
                      {v === "MISSING" ? t("missing.form.typeMissing") : t("missing.form.typeFound")}
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mp-name">{t("missing.form.name")}</Label>
            <Input
              id="mp-name"
              placeholder={t("missing.form.namePlaceholder")}
              {...register("name", { required: true, minLength: 2 })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mp-age">{t("missing.form.age")}</Label>
              <Input id="mp-age" type="number" min={0} max={120} {...register("age", { valueAsNumber: true })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("missing.form.gender")}</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || undefined)}>
                    <SelectTrigger className="w-full data-[size=default]:h-10 rounded-lg">
                      <SelectValue placeholder="—">
                        {(v: string) =>
                          v ? t(`missing.form.${v as "male" | "female" | "other"}`) : "—"
                        }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {(["male", "female", "other"] as const).map((g) => (
                        <SelectItem key={g} value={g}>
                          {t(`missing.form.${g}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("missing.form.district")}</Label>
            <Controller
              name="districtId"
              control={control}
              rules={{ required: true }}
              render={({ field }) => <DistrictPicker value={field.value} onChange={field.onChange} />}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mp-seen">
              {type === "FOUND" ? t("missing.form.foundWhere") : t("missing.form.lastSeen")}
            </Label>
            <Input
              id="mp-seen"
              placeholder={t("missing.form.lastSeenPlaceholder")}
              {...register("lastSeenText", { required: true, minLength: 3 })}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mp-desc">{t("missing.form.description")}</Label>
            <Textarea id="mp-desc" rows={2} maxLength={1000} {...register("description")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("missing.form.photo")}</Label>
            <ImageUpload value={photo} onChange={setPhoto} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mp-rname">{t("missing.form.yourName")}</Label>
              <Input id="mp-rname" {...register("reporterName", { required: true, minLength: 2 })} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mp-rphone">{t("missing.form.yourPhone")}</Label>
              <Input
                id="mp-rphone"
                type="tel"
                placeholder="01XXXXXXXXX"
                {...register("reporterPhone", { required: true, minLength: 6 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("missing.form.cancel")}
            </Button>
            <Button type="submit" disabled={report.isPending} className="gap-2 font-semibold">
              {report.isPending && <Loader2 className="size-4 animate-spin" />}
              {t("missing.form.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PersonCard({ person, canModerate }: { person: MissingPerson; canModerate: boolean }) {
  const { t, pick, num, lang } = useT();
  const update = useUpdateMissingPersonStatus();
  const photo = person.photoUrls[0];

  return (
    <Card className="rounded-3xl border border-border bg-card overflow-hidden flex flex-col">
      <div className="relative aspect-4/3 bg-muted/40 flex items-center justify-center">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt={person.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <UserSearch className="size-10 text-muted-foreground/40" />
        )}
        <Badge
          variant={person.status === "REUNITED" ? "success" : person.type === "MISSING" ? "danger" : "info"}
          className="absolute top-3 left-3"
          dot
        >
          {person.status === "REUNITED"
            ? t("missing.tab.reunited")
            : person.type === "MISSING"
              ? t("missing.tab.missing")
              : t("missing.tab.found")}
        </Badge>
      </div>

      <div className="p-5 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="text-base font-bold text-foreground">{person.name}</h3>
          <p className="text-xs text-muted-foreground">
            {person.age != null && `${t("missing.age")} ${num(person.age)} · `}
            {person.gender && `${t(`missing.form.${person.gender}`)} · `}
            {lang === "bn" ? new Date(person.createdAt).toLocaleDateString("bn-BD") : timeAgo(person.createdAt)}
          </p>
        </div>

        <p className="flex items-start gap-1.5 text-sm text-foreground">
          <MapPin className="size-4 shrink-0 mt-0.5 text-muted-foreground" />
          <span>
            <span className="text-muted-foreground">
              {person.type === "FOUND" ? t("missing.foundAt") : t("missing.lastSeen")}:{" "}
            </span>
            {person.lastSeenText}, {pick(person.district.nameEn, person.district.nameBn)}
          </span>
        </p>

        {person.description && <p className="text-sm text-muted-foreground line-clamp-3">{person.description}</p>}

        <div className="mt-auto pt-3 border-t border-border flex flex-col gap-1.5">
          <p className="text-xs text-muted-foreground">
            {t("missing.reportedBy")}: <span className="font-semibold text-foreground">{person.reporterName}</span>
          </p>
          <p className="flex items-center gap-1.5 text-sm font-mono">
            <Phone className="size-3.5 text-muted-foreground" />
            {person.contactHidden ? (
              <span lang="en">{person.reporterPhone}</span>
            ) : (
              <a href={`tel:${person.reporterPhone}`} className="text-primary hover:underline">
                {person.reporterPhone}
              </a>
            )}
          </p>
          {person.contactHidden && (
            <p className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <EyeOff className="size-3 shrink-0 mt-0.5" />
              {t("missing.contactHidden")}
            </p>
          )}
        </div>

        {canModerate && (
          <div className="flex gap-2 pt-1">
            {person.status === "OPEN" ? (
              <Button
                size="sm"
                variant="success-outline"
                className="gap-1.5 flex-1"
                disabled={update.isPending}
                onClick={() => update.mutate({ id: person.id, status: "REUNITED" })}
              >
                <CheckCircle2 className="size-3.5" />
                {t("missing.markReunited")}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 flex-1"
                disabled={update.isPending}
                onClick={() => update.mutate({ id: person.id, status: "OPEN" })}
              >
                <RotateCcw className="size-3.5" />
                {lang === "bn" ? "আবার খুলুন" : "Reopen"}
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

/**
 * Search + report board for missing / found persons. Used on the public
 * page and inside the admin dashboard (`embedded`), where it skips the hero.
 */
export function MissingPersonsBoard({ embedded = false }: { embedded?: boolean }) {
  const { t, num } = useT();
  const { data: user } = useCurrentUser();
  const [tab, setTab] = useState<Tab>("MISSING");
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [districtId, setDistrictId] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const [reportOpen, setReportOpen] = useState(false);

  const { data, isLoading, isFetching } = useMissingPersons({
    ...TAB_QUERY[tab],
    q: search || undefined,
    districtId,
    page,
    limit: 12,
  });
  const { data: summary } = useMissingPersonSummary();

  const isCoordinator = user?.role === "ADMIN" || user?.role === "VOLUNTEER";
  const canModerate = (p: MissingPerson) => isCoordinator || (!!user && p.createdById === user.id);

  const tabs: { id: Tab; label: string; count?: number; icon: typeof UserSearch }[] = [
    { id: "MISSING", label: t("missing.tab.missing"), count: summary?.openMissing, icon: UserSearch },
    { id: "FOUND", label: t("missing.tab.found"), count: summary?.openFound, icon: HeartHandshake },
    { id: "REUNITED", label: t("missing.tab.reunited"), count: summary?.reunited, icon: CheckCircle2 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {!embedded && (
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center justify-center size-12 rounded-2xl bg-primary/10 text-primary mb-4">
              <UserSearch className="size-6" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">{t("missing.title")}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2">{t("missing.subtitle")}</p>
          </div>
          <Button className="gap-2 font-semibold self-start md:self-auto" onClick={() => setReportOpen(true)}>
            <Plus className="size-4" />
            {t("missing.report")}
          </Button>
        </div>
      )}

      {embedded && (
        <div className="flex justify-end">
          <Button className="gap-2 font-semibold" onClick={() => setReportOpen(true)}>
            <Plus className="size-4" />
            {t("missing.report")}
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="tablist">
        {tabs.map(({ id, label, count, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => {
              setTab(id);
              setPage(1);
            }}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
              tab === id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-muted/50",
            )}
          >
            <Icon className="size-4" />
            {label}
            {count != null && (
              <span
                className={cn(
                  "rounded-full px-2 text-xs tabular-nums",
                  tab === id ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground",
                )}
              >
                {num(count)}
              </span>
            )}
          </button>
        ))}
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          setSearch(q.trim());
          setPage(1);
        }}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onBlur={() => {
              setSearch(q.trim());
              setPage(1);
            }}
            placeholder={t("missing.search")}
            className="h-11 pl-10 rounded-xl"
            aria-label={t("missing.search")}
          />
        </div>
        <DistrictPicker
          allowAll
          value={districtId}
          onChange={(id) => {
            setDistrictId(id);
            setPage(1);
          }}
        />
      </form>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-80 rounded-3xl" />
          ))}
        </div>
      ) : data && data.data.length > 0 ? (
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity",
            isFetching && "opacity-60",
          )}
        >
          {data.data.map((p) => (
            <PersonCard key={p.id} person={p} canModerate={canModerate(p)} />
          ))}
        </div>
      ) : (
        <Card className="rounded-3xl border border-border bg-card">
          <EmptyState icon={UserSearch} title={t("missing.empty")} />
        </Card>
      )}

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="gap-1">
            <ChevronLeft className="size-4" />
            {t("missing.prev")}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t("missing.page")} {num(page)} / {num(data.meta.totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="gap-1"
          >
            {t("missing.next")}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}

      <ReportDialog key={user?.id ?? "anon"} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
