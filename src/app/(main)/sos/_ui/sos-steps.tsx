"use client";

import { useRef, useState, type ChangeEvent } from "react";
import dynamic from "next/dynamic";
import { useFormContext } from "react-hook-form";
import {
  Camera,
  Check,
  CheckCircle2,
  Crosshair,
  Droplets,
  HeartPulse,
  LifeBuoy,
  Loader2,
  MapPin,
  Phone,
  UserRound,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapSkeleton } from "@/components/ui/map-skeleton";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { useDistricts } from "@/lib/hooks/use-locations";
import { localizeUploadError, uploadImage } from "@/lib/upload";
import { useT } from "@/lib/i18n/use-t";
import { cn } from "@/lib/utils";
import type { SOSFormData } from "./types";

const SOSMap = dynamic(() => import("./sos-leaflet-map"), { ssr: false, loading: () => <MapSkeleton /> });

export function StepCard({
  n,
  title,
  hint,
  done,
  children,
  aside,
}: {
  n: number;
  title: string;
  hint: string;
  done: boolean;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-card">
      <header className="flex items-center gap-4 border-b border-border px-5 py-4 md:px-6">
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors",
            done ? "bg-primary text-lime" : "bg-destructive/10 text-destructive",
          )}
        >
          {done ? <Check className="h-5 w-5" strokeWidth={3} /> : n}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold tracking-tight text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
        {aside}
      </header>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  );
}

function Label({ children, extra }: { children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <div className="mb-2.5 flex items-center justify-between gap-2">
      <span className="text-sm font-semibold text-foreground">{children}</span>
      {extra}
    </div>
  );
}

export function LocationStep({
  location,
  setLocation,
  address,
  setAddress,
}: {
  location: { lat: number; lng: number } | null;
  setLocation: (l: { lat: number; lng: number }) => void;
  address: string;
  setAddress: (a: string) => void;
}) {
  const { t } = useT();
  const [state, setState] = useState<"idle" | "detecting" | "error">("idle");

  const detect = () => {
    if (!navigator.geolocation) {
      setState("error");
      toast.error(t("sos.tryAgain"));
      return;
    }
    setState("detecting");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setState("idle");
      },
      () => {
        setState("error");
        toast.error(t("sos.locationNotSetHint"));
      },
      { enableHighAccuracy: true, timeout: 12000 },
    );
  };

  return (
    <StepCard
      n={1}
      title={t("sos.where")}
      hint={t("sos.whereHint")}
      done={!!location}
      aside={
        <span
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold sm:inline-flex",
            location ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/12 text-amber-700",
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", location ? "bg-emerald-500" : "bg-amber-500 animate-pulse")} />
          {location ? t("sos.locationSet") : t("sos.locationNotSet")}
        </span>
      }
    >
      <div className="relative h-72 overflow-hidden rounded-2xl border border-border md:h-96">
        <SOSMap location={location} setLocation={setLocation} />
        <div className="pointer-events-none absolute inset-x-0 bottom-4 z-1001 flex justify-center">
          <button
            type="button"
            onClick={detect}
            disabled={state === "detecting"}
            className="pointer-events-auto inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90 disabled:opacity-70"
          >
            {state === "detecting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Crosshair className="h-4 w-4 text-lime" />}
            {state === "detecting" ? t("sos.finding") : state === "error" ? t("sos.tryAgain") : t("sos.useMyLocation")}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "mt-4 flex items-center gap-3 rounded-2xl p-3.5",
          location ? "bg-emerald-500/8 text-emerald-800" : "bg-muted/60 text-muted-foreground",
        )}
      >
        {location ? <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /> : <MapPin className="h-5 w-5 shrink-0" />}
        <p className="text-sm">
          {location ? (
            <>
              <span className="font-semibold">{t("sos.locationSet")}</span>
              <span className="ml-2 font-mono text-xs">
                {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
              </span>
            </>
          ) : (
            t("sos.locationNotSetHint")
          )}
        </p>
      </div>

      <div className="mt-5">
        <Label extra={<span className="text-xs text-muted-foreground">{address.length}/200</span>}>
          {t("sos.landmark")} <span className="font-normal text-muted-foreground">{t("sos.optional")}</span>
        </Label>
        <Textarea
          rows={2}
          maxLength={200}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={t("sos.landmarkPlaceholder")}
          className="resize-none rounded-xl"
        />
      </div>
    </StepCard>
  );
}

const PEOPLE = [
  { value: "1", big: "1", key: "single" },
  { value: "2-5", big: "2–5", key: "family" },
  { value: "5-10", big: "5–10", key: "group" },
  { value: "10+", big: "10+", key: "mass" },
] as const;

const HELP = [
  { id: "Rescue", key: "rescue", icon: LifeBuoy, tone: "text-destructive bg-destructive/10" },
  { id: "Food", key: "food", icon: UtensilsCrossed, tone: "text-amber-700 bg-amber-500/12" },
  { id: "Medicine", key: "medicine", icon: HeartPulse, tone: "text-sky-700 bg-sky-500/12" },
  { id: "Water", key: "water", icon: Droplets, tone: "text-teal-700 bg-teal-500/12" },
] as const;

export function SituationStep() {
  const { t, pick } = useT();
  const { watch, setValue } = useFormContext<SOSFormData>();
  const { data: districts } = useDistricts();
  const districtId = watch("districtId");
  const people = watch("peopleCount");
  const help = watch("helpTypes");

  const toggleHelp = (id: string) =>
    setValue("helpTypes", help.includes(id) ? help.filter((h) => h !== id) : [...help, id], { shouldValidate: true });

  return (
    <StepCard
      n={2}
      title={t("sos.step.situation")}
      hint={t("sos.step.situationHint")}
      done={districtId !== null && people !== null && help.length > 0}
    >
      <div className="flex flex-col gap-6">
        <div>
          <Label>{t("sos.district")}</Label>
          <SearchableSelect
            size="lg"
            icon={<MapPin />}
            value={districtId ? String(districtId) : ""}
            onValueChange={(v) => setValue("districtId", v ? Number(v) : null, { shouldValidate: true })}
            options={(districts ?? [])
              .map((d) => ({ value: String(d.id), label: pick(d.nameEn, d.nameBn), keywords: `${d.nameEn} ${d.nameBn}` }))
              .sort((a, b) => a.label.localeCompare(b.label))}
            placeholder={t("sos.selectDistrict")}
            searchPlaceholder={t("sos.selectDistrict")}
          />
        </div>

        <div>
          <Label>{t("sos.people")}</Label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {PEOPLE.map((p) => {
              const on = people === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setValue("peopleCount", on ? null : p.value, { shouldValidate: true })}
                  className={cn(
                    "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition-all",
                    on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  <span className={cn("text-2xl font-bold tabular-nums", on ? "text-lime" : "text-foreground")}>{p.big}</span>
                  <span className="text-sm font-semibold">{t(`sos.people.${p.key}`)}</span>
                  <span className={cn("text-xs", on ? "text-white/70" : "text-muted-foreground")}>{t(`sos.people.${p.key}Desc`)}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label extra={<span className="text-xs font-medium text-muted-foreground">{t("sos.multi")}</span>}>{t("sos.help")}</Label>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {HELP.map((h) => {
              const on = help.includes(h.id);
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => toggleHelp(h.id)}
                  className={cn(
                    "flex items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all",
                    on ? "border-primary bg-accent/50 ring-4 ring-primary/10" : "border-border bg-background hover:border-primary/40",
                  )}
                >
                  <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", h.tone)}>
                    <h.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 font-semibold text-foreground">{t(`sos.help.${h.key}`)}</span>
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2",
                      on ? "border-primary bg-primary text-lime" : "border-border",
                    )}
                  >
                    {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </StepCard>
  );
}

export function ContactStep() {
  const { t, tr, lang } = useT();
  const { watch, setValue, register } = useFormContext<SOSFormData>();
  const name = watch("name");
  const phone = watch("phone");
  const previews = watch("photoPreviews");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const onPhone = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "");
    if (v.length <= 11) setValue("phone", v, { shouldValidate: true });
  };

  const onFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const before = watch("photoPreviews");
    const local = files.map((f) => URL.createObjectURL(f));
    setValue("photoPreviews", [...before, ...local]);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((f) => uploadImage(f, { folder: "sos" })));
      setValue("photoUrls", [...watch("photoUrls"), ...urls]);
    } catch (error) {
      setValue("photoPreviews", before);
      const message = error instanceof Error ? error.message : "Upload failed. Please try again.";
      toast.error(localizeUploadError(message, lang));
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removePhoto = (i: number) => {
    setValue("photoPreviews", watch("photoPreviews").filter((_, j) => j !== i));
    setValue("photoUrls", watch("photoUrls").filter((_, j) => j !== i));
  };

  return (
    <StepCard
      n={3}
      title={t("sos.step.contact")}
      hint={t("sos.step.contactHint")}
      done={name.trim().length >= 2 && /^01\d{9}$/.test(phone)}
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <Label>{t("sos.name")}</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input {...register("name")} placeholder={t("sos.namePlaceholder")} className="h-12 pl-10" autoComplete="name" />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{t("sos.nameHint")}</p>
        </div>
        <div>
          <Label>{t("sos.phone")}</Label>
          <div className="flex h-12 overflow-hidden rounded-xl border border-input bg-card shadow-xs focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/12">
            <span className="flex items-center gap-1.5 border-r border-border bg-muted/60 px-3 text-sm font-semibold text-foreground">
              <Phone className="h-4 w-4 text-muted-foreground" />
              +880
            </span>
            <input
              value={phone}
              onChange={onPhone}
              inputMode="numeric"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm tracking-wider outline-none placeholder:text-muted-foreground"
            />
            {/^01\d{9}$/.test(phone) && <CheckCircle2 className="mr-3 h-5 w-5 self-center text-emerald-600" />}
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">{t("sos.phoneHint")}</p>
        </div>
      </div>

      <div className="mt-6">
        <Label>
          {t("sos.photos")}
        </Label>
        <div className="flex flex-wrap gap-3">
          {previews.map((src, i) => (
            <div key={src} className="relative h-20 w-20 overflow-hidden rounded-xl border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                aria-label={tr("Remove photo", "ছবি সরান")}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-border text-xs font-semibold text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
            {previews.length ? t("sos.addMore") : t("sos.addPhoto")}
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={onFiles} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{t("sos.photosHint")}</p>
      </div>
    </StepCard>
  );
}

export function DetailsStep() {
  const { t } = useT();
  const { register, watch } = useFormContext<SOSFormData>();
  const description = watch("description");
  return (
    <StepCard n={4} title={t("sos.details")} hint={t("sos.detailsHint")} done={description.trim().length > 0}>
      <Textarea
        {...register("description")}
        rows={4}
        maxLength={500}
        placeholder={t("sos.detailsPlaceholder")}
        className="resize-none rounded-xl"
      />
      <p className="mt-1.5 text-right text-xs text-muted-foreground">{description.length}/500</p>
    </StepCard>
  );
}
