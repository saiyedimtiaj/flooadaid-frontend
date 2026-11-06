"use client";

import { SearchableSelect } from "@/components/ui/searchable-select";
import { useState } from "react";
import { PageHero } from "@/components/public/page-hero";
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
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Pagination } from "@/components/dashboard/pagination";
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
  return (
    <SearchableSelect
      value={value ? String(value) : allowAll ? "all" : ""}
      onValueChange={(v) => onChange(v && v !== "all" ? Number(v) : undefined)}
      options={[
        ...(allowAll ? [{ value: "all", label: t("missing.allDistricts") }] : []),
        ...(districts ?? []).map((d) => ({ value: String(d.id), label: pick(d.nameEn, d.nameBn), keywords: `${d.nameEn} ${d.nameBn}` })),
      ]}
      placeholder={t("sos.selectDistrict")}
      searchPlaceholder={t("sos.selectDistrict")}
    />
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("missing.form.title")}</DialogTitle>
          <DialogDescription>{t("missing.form.consent")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div data-slot="modal-body" className="flex flex-col gap-4">
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
                  <SearchableSelect
                    value={field.value ?? ""}
                    onValueChange={(v) => field.onChange(v || undefined)}
                    options={(["male", "female", "other"] as const).map((g) => ({ value: g, label: t(`missing.form.${g}`) }))}
                    placeholder="—"
                  />
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
            <ImageUpload value={photo} onChange={setPhoto} folder="missing-persons" />
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

const TYPE_STYLE = {
  MISSING: { ribbon: "bg-destructive text-white", tint: "bg-destructive/10 text-destructive" },
  FOUND: { ribbon: "bg-sky-600 text-white", tint: "bg-sky-500/10 text-sky-700" },
  REUNITED: { ribbon: "bg-emerald-600 text-white", tint: "bg-emerald-500/10 text-emerald-700" },
} as const;

function PersonCard({ person, canModerate }: { person: MissingPerson; canModerate: boolean }) {
  const { t, pick, num, lang } = useT();
  const update = useUpdateMissingPersonStatus();
  const photo = person.photoUrls[0];
  const kind = person.status === "REUNITED" ? "REUNITED" : person.type;
  const style = TYPE_STYLE[kind];
  const label =
    kind === "REUNITED" ? t("missing.tab.reunited") : kind === "MISSING" ? t("missing.tab.missing") : t("missing.tab.found");
  const initials = person.name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photo}
            alt={person.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-accent">
            <span className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-lime">
              {initials || <UserSearch className="size-10" />}
            </span>
            <span className="text-xs font-medium text-muted-foreground">{lang === "bn" ? "ছবি নেই" : "No photo yet"}</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-5 pt-20 text-white">
          <h3 className="text-xl font-bold leading-tight tracking-tight">{person.name}</h3>
          <p className="mt-1 text-sm text-white/80">
            {[person.age != null ? `${t("missing.age")} ${num(person.age)}` : null, person.gender ? t(`missing.form.${person.gender}`) : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        </div>
        <span className={cn("absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold shadow-lg", style.ribbon)}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          {label}
        </span>
        <span className="absolute right-4 top-4 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
          {lang === "bn" ? new Date(person.createdAt).toLocaleDateString("bn-BD") : timeAgo(person.createdAt)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3 rounded-2xl bg-muted/50 p-3.5">
          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", style.tint)}>
            <MapPin className="size-4" />
          </span>
          <div className="min-w-0 text-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {person.type === "FOUND" ? t("missing.foundAt") : t("missing.lastSeen")}
            </p>
            <p className="mt-0.5 font-medium text-foreground">
              {person.lastSeenText}, {pick(person.district.nameEn, person.district.nameBn)}
            </p>
          </div>
        </div>

        {person.description && <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{person.description}</p>}

        <div className="mt-auto flex items-center gap-3 rounded-2xl border border-border p-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-lime">
            {person.reporterName.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">{person.reporterName}</p>
            <p className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Phone className="size-3" />
              <span lang="en">{person.reporterPhone}</span>
              {person.contactHidden && <EyeOff className="size-3" aria-label={t("missing.contactHidden")} />}
            </p>
          </div>
          {!person.contactHidden && (
            <a
              href={`tel:${person.reporterPhone}`}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="size-3.5 text-lime" />
              {lang === "bn" ? "ফোন" : "Call"}
            </a>
          )}
        </div>
        {person.contactHidden && <p className="text-[11px] leading-snug text-muted-foreground">{t("missing.contactHidden")}</p>}

        {canModerate && (
          <div className="flex gap-2">
            {person.status === "OPEN" ? (
              <Button
                size="sm"
                variant="success-outline"
                className="flex-1 gap-1.5"
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
                className="flex-1 gap-1.5"
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
    </article>
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
        <PageHero
          icon={UserSearch}
          crumb={t("missing.title")}
          title={t("missing.title")}
          description={t("missing.subtitle")}
          statsTitle={t("missing.statsTitle")}
          stats={[
            { label: t("missing.stats.missing"), value: summary ? num(summary.openMissing) : undefined, icon: UserSearch, tone: "alert" },
            { label: t("missing.stats.found"), value: summary ? num(summary.openFound) : undefined, icon: HeartHandshake },
            { label: t("missing.stats.reunited"), value: summary ? num(summary.reunited) : undefined, icon: CheckCircle2 },
            {
              label: t("missing.stats.rate"),
              value: summary
                ? `${Math.round((summary.reunited / Math.max(1, summary.openMissing + summary.openFound + summary.reunited)) * 100)}%`
                : undefined,
              icon: Sparkles,
            },
          ]}
          aside={
            <Button size="lg" className="h-12 px-6" onClick={() => setReportOpen(true)}>
              <Plus className="size-4 text-lime" />
              {t("missing.report")}
            </Button>
          }
        />
      )}

      {embedded && (
        <div className="flex justify-end">
          <Button className="gap-2 font-semibold" onClick={() => setReportOpen(true)}>
            <Plus className="size-4" />
            {t("missing.report")}
          </Button>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid grid-cols-1 gap-2 border-b border-border p-3 sm:grid-cols-3" role="tablist">
          {tabs.map(({ id, label, count, icon: Icon }) => {
            const on = tab === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setTab(id);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl p-3.5 text-left transition-colors",
                  on ? "bg-primary text-primary-foreground" : "hover:bg-muted/60",
                )}
              >
                <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", on ? "bg-lime text-lime-foreground" : "bg-muted text-muted-foreground")}>
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{label}</span>
                  <span className={cn("block text-2xl font-bold tabular-nums leading-tight", on ? "text-white" : "text-foreground")}>
                    {count != null ? num(count) : "—"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <form
          className="grid grid-cols-1 gap-3 p-3 md:grid-cols-[1fr_280px]"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q.trim());
            setPage(1);
          }}
        >
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onBlur={() => {
                setSearch(q.trim());
                setPage(1);
              }}
              placeholder={t("missing.search")}
              className="h-12 pl-10"
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
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-3xl border border-border bg-card">
              <Skeleton className="aspect-4/5 w-full rounded-none" />
              <div className="flex flex-col gap-3 p-5">
                <Skeleton className="h-16 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-14 w-full rounded-2xl" />
              </div>
            </div>
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
        <div className="rounded-2xl border border-border bg-card">
          <EmptyState
            icon={UserSearch}
            title={search || districtId ? t("missing.empty") : t("missing.emptyTitle")}
            description={search || districtId ? t("missing.emptySearchHint") : t("missing.emptyHint")}
            action={
              <>
                {(search || districtId) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQ("");
                      setSearch("");
                      setDistrictId(undefined);
                    }}
                  >
                    {t("missing.clear")}
                  </Button>
                )}
                <Button onClick={() => setReportOpen(true)}>
                  <Plus className="size-4 text-lime" />
                  {t("missing.report")}
                </Button>
              </>
            }
          />
        </div>
      )}

      {data && data.meta.total > 0 && (
        <Pagination page={page} totalPages={data.meta.totalPages} total={data.meta.total} pageSize={12} onChange={setPage} />
      )}

      <ReportDialog key={user?.id ?? "anon"} open={reportOpen} onOpenChange={setReportOpen} />
    </div>
  );
}
