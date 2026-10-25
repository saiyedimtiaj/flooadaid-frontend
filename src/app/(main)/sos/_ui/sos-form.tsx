"use client";

import { useState, useRef, ChangeEvent } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  LifeBuoy,
  UtensilsCrossed,
  Cross,
  Droplets,
  Phone,
  X,
  Camera,
  Users,
  AlertTriangle,
  FileText,
  Loader2,
  MapPinned,
  UserRound,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useDistricts } from "@/lib/hooks/use-locations";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { SOSFormData } from "./types";
import { useT } from "@/lib/i18n/use-t";

export default function SOSForm() {
  const { watch, setValue, register, control } = useFormContext<SOSFormData>();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: districts } = useDistricts();
  const { t, pick } = useT();

  const peopleCount = watch("peopleCount");
  const helpTypes = watch("helpTypes");
  const phone = watch("phone");
  const description = watch("description");
  const photoPreviews = watch("photoPreviews");

  const handlePeopleSelect = (value: "1" | "2-5" | "5-10" | "10+") => {
    setValue("peopleCount", peopleCount === value ? null : value, {
      shouldValidate: true,
    });
  };

  const handleHelpTypeToggle = (type: string) => {
    const exists = helpTypes.includes(type);
    const updated = exists
      ? helpTypes.filter((t) => t !== type)
      : [...helpTypes, type];
    setValue("helpTypes", updated, { shouldValidate: true });
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) {
      setValue("phone", val, { shouldValidate: true });
    }
  };

  const handlePhotoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    // Show local previews immediately
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setValue("photoPreviews", [...watch("photoPreviews"), ...newPreviews]);
    setIsUploadingPhoto(true);

    try {
      const urls = await Promise.all(
        files.map((f) => uploadImageToCloudinary(f)),
      );
      setValue("photoUrls", [...watch("photoUrls"), ...urls]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Photo upload failed");
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setValue(
      "photoPreviews",
      watch("photoPreviews").filter((_, i) => i !== index),
    );
    setValue(
      "photoUrls",
      watch("photoUrls").filter((_, i) => i !== index),
    );
  };

  const helpTypeOptions = [
    {
      id: "Rescue",
      label: t("sos.help.rescue"),
      icon: LifeBuoy,
      color: "from-rose-500/10 to-red-600/5",
      border: "border-red-500/20 hover:border-red-500/50",
      active: "border-red-500 bg-linear-to-br from-red-500/20 via-red-500/10 to-transparent text-red-500 shadow-lg shadow-red-500/10",
      iconColor: "text-red-500",
    },
    {
      id: "Food",
      label: t("sos.help.food"),
      icon: UtensilsCrossed,
      color: "from-amber-500/10 to-orange-600/5",
      border: "border-amber-500/20 hover:border-amber-500/50",
      active: "border-amber-500 bg-linear-to-br from-amber-500/20 via-amber-500/10 to-transparent text-amber-600 dark:text-amber-500 shadow-lg shadow-amber-500/10",
      iconColor: "text-amber-500",
    },
    {
      id: "Medicine",
      label: t("sos.help.medicine"),
      icon: Cross,
      color: "from-sky-500/10 to-blue-600/5",
      border: "border-sky-500/20 hover:border-sky-500/50",
      active: "border-sky-500 bg-linear-to-br from-sky-500/20 via-sky-500/10 to-transparent text-sky-500 shadow-lg shadow-sky-500/10",
      iconColor: "text-sky-500",
    },
    {
      id: "Water",
      label: t("sos.help.water"),
      icon: Droplets,
      color: "from-blue-500/10 to-indigo-600/5",
      border: "border-blue-500/20 hover:border-blue-500/50",
      active: "border-blue-500 bg-linear-to-br from-blue-500/20 via-blue-500/10 to-transparent text-blue-500 shadow-lg shadow-blue-500/10",
      iconColor: "text-blue-500",
    },
  ];

  const peopleOptions = [
    { value: "1" as const, label: t("sos.people.single"), desc: t("sos.people.singleDesc") },
    { value: "2-5" as const, label: t("sos.people.family"), desc: t("sos.people.familyDesc") },
    { value: "5-10" as const, label: t("sos.people.group"), desc: t("sos.people.groupDesc") },
    { value: "10+" as const, label: t("sos.people.mass"), desc: t("sos.people.massDesc") },
  ];

  return (
    <div className="w-full flex flex-col gap-10">
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-red-600/10 via-amber-500/5 to-transparent border border-red-500/20 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-3">
          <div className="inline-flex max-w-44 items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[10px] font-black tracking-widest text-red-500 uppercase">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {t("sos.badge")}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-black tracking-tighter text-red-500/20 font-mono select-none">
              2
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
                {t("sos.step2Title")}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                {t("sos.step2Body")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <MapPinned className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  {t("sos.district")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("sos.districtHint")}
                </p>
              </div>
            </div>

            <Controller
              name="districtId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(val) => field.onChange(Number(val))}
                >
                  <SelectTrigger className="w-full data-[size=default]:h-12 rounded-xl">
                    <SelectValue placeholder={t("sos.selectDistrict")}>
                      {(val: string) =>
                        (() => {
                          const d = districts?.find((x) => String(x.id) === val);
                          return d ? pick(d.nameEn, d.nameBn) : undefined;
                        })() ??
                        "Select district..."
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {districts?.map((district) => (
                      <SelectItem key={district.id} value={String(district.id)}>
                        {pick(district.nameEn, district.nameBn)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Users className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  {t("sos.people")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("sos.peopleHint")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {peopleOptions.map((opt) => {
                const isSelected = peopleCount === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handlePeopleSelect(opt.value)}
                    className={`relative p-5 rounded-2xl border text-left transition-all select-none overflow-hidden ${
                      isSelected
                        ? "border-red-500 bg-red-500/3 shadow-md shadow-red-500/5"
                        : "bg-muted/10 border-border/60 hover:bg-muted/20 hover:border-border"
                    }`}
                  >
                    <div className="flex flex-col justify-between h-full gap-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-mono text-2xl tracking-tighter transition-colors ${
                            isSelected ? "font-black text-red-500" : "font-semibold text-muted-foreground/60"
                          }`}
                        >
                          {opt.value}
                        </span>
                        {isSelected && (
                          <div className="size-2 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-foreground uppercase tracking-wide">
                          {opt.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">
                          {opt.desc}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <AlertTriangle className="size-4 text-primary" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                    {t("sos.help")}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {t("sos.helpHint")}
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-black tracking-widest text-muted-foreground/60 uppercase hidden sm:inline">
                {t("sos.multi")}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {helpTypeOptions.map((opt) => {
                const isSelected = helpTypes.includes(opt.id);
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleHelpTypeToggle(opt.id)}
                    className={`relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-200 select-none ${
                      isSelected ? opt.active : `bg-muted/10 ${opt.border}`
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl border transition-colors ${
                          isSelected
                            ? "bg-foreground/5 border-current/20"
                            : "bg-background border-border/50"
                        }`}
                      >
                        <Icon className={`size-5 shrink-0 ${isSelected ? "text-current" : opt.iconColor}`} />
                      </div>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-foreground">
                        {opt.label}
                      </span>
                    </div>
                    <div
                      className={`size-5 rounded-lg border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-current bg-current/10"
                          : "border-border bg-background"
                      }`}
                    >
                      {isSelected && <div className="size-2 rounded-sm bg-current" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <FileText className="size-4 text-primary" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
                  {t("sos.details")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {t("sos.detailsHint")}
                </p>
              </div>
            </div>

            <div className="relative rounded-2xl border border-border/60 bg-muted/5 focus-within:border-primary/60 focus-within:ring-1 focus-within:ring-primary/20 transition-all p-1">
              <Textarea
                rows={4}
                maxLength={500}
                {...register("description")}
                placeholder={t("sos.detailsPlaceholder")}
                className="resize-none border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm p-4 placeholder:text-muted-foreground/40 shadow-none"
              />
              <div className="flex items-center justify-end p-2 bg-muted/20 rounded-xl border-t border-border/40">
                <span className="text-[10px] font-mono font-bold tracking-wider text-muted-foreground/60 uppercase">
                  {description.length} / 500
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
          <div className="flex flex-col gap-5 p-6 rounded-3xl border border-border/60 bg-muted/5">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black uppercase">
                {t("sos.name")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("sos.nameHint")}
              </p>
            </div>
            <div className="relative flex items-center rounded-xl overflow-hidden border border-border/60 bg-background focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
              <UserRound className="absolute left-4 size-4 text-muted-foreground/50 pointer-events-none" />
              <Input
                {...register("name")}
                placeholder={t("sos.namePlaceholder")}
                className="w-full h-12 pl-11 pr-4 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm shadow-none rounded-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 rounded-3xl border border-border/60 bg-muted/5">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black uppercase">
                {t("sos.phone")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("sos.phoneHint")}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="relative flex rounded-xl overflow-hidden border border-border/60 bg-background focus-within:ring-2 focus-within:ring-red-500/20 focus-within:border-red-500 transition-all">
                <div className="bg-muted/40 px-4 text-xs text-muted-foreground border-r border-border/60 flex items-center justify-center font-bold tracking-widest select-none">
                  +880
                </div>
                <div className="relative flex-1 flex items-center">
                  <Phone className="absolute left-4.5 size-4 text-muted-foreground/50 pointer-events-none" />
                  <Input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-12 pl-12 pr-4 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-mono tracking-widest shadow-none rounded-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-6 rounded-3xl border border-border/60 bg-muted/5">
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-black uppercase">
                {t("sos.photos")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("sos.photosHint")}
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              capture="environment"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
            />

            <div className="grid grid-cols-3 gap-2.5">
              {photoPreviews.map((preview, index) => (
                <div
                  key={preview}
                  className="relative aspect-square rounded-xl overflow-hidden border border-border/60 bg-background group"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt={`SOS photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 size-6 rounded-lg bg-black/60 text-white flex items-center justify-center hover:bg-destructive transition-colors"
                    aria-label="Remove photo"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square border-2 border-dashed border-border/60 hover:border-primary/60 rounded-xl text-center cursor-pointer bg-background hover:bg-muted/10 transition-all flex flex-col items-center justify-center gap-1.5 group"
              >
                {isUploadingPhoto ? (
                  <Loader2 className="size-5 text-primary animate-spin" />
                ) : (
                  <div className="size-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="size-4 text-primary" />
                  </div>
                )}
                <span className="text-[10px] font-bold text-muted-foreground">
                  {photoPreviews.length > 0 ? t("sos.addMore") : t("sos.addPhoto")}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
