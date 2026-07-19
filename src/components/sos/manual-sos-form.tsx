"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Send,
  Loader2,
  User,
  MapPinned,
  Users,
  LifeBuoy,
  LifeBuoy as RescueIcon,
  UtensilsCrossed,
  Cross,
  Droplets,
  FileText,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "@/components/map/location-picker";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { NearbyHelpPanel } from "@/components/sos/nearby-help-panel";
import { useCreateManualSos, type CreateSosInput } from "@/lib/hooks/use-sos";
import type { LatLng } from "@/components/map/location-picker-map";
import type { PeopleCount, HelpType } from "@/lib/types/api";
import { toast } from "sonner";

const PEOPLE_OPTIONS: { value: PeopleCount; label: string }[] = [
  { value: "1", label: "1 person" },
  { value: "2-5", label: "2 to 5 people" },
  { value: "5-10", label: "5 to 10 people" },
  { value: "10+", label: "More than 10" },
];

const HELP_OPTIONS: { value: HelpType; label: string; icon: typeof LifeBuoy }[] = [
  { value: "rescue", label: "Rescue", icon: RescueIcon },
  { value: "food", label: "Food", icon: UtensilsCrossed },
  { value: "medicine", label: "Medicine", icon: Cross },
  { value: "water", label: "Clean water", icon: Droplets },
];

function SectionHeading({
  step,
  icon: Icon,
  title,
  hint,
}: {
  step: number;
  icon: typeof User;
  title: string;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex items-center justify-center size-9 rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon className="size-4" />
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center size-4 rounded-full bg-primary text-primary-foreground text-[9px] font-black">
          {step}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}

interface FormValues {
  name: string;
  phone: string;
  districtId?: number;
  peopleCount?: PeopleCount;
  description: string;
}

export function ManualSosForm() {
  const createManual = useCreateManualSos();
  const [location, setLocation] = useState<LatLng | null>(null);
  const [helpTypes, setHelpTypes] = useState<HelpType[]>([]);

  const { register, handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: { name: "", phone: "", description: "" },
  });

  const toggleHelp = (h: HelpType) =>
    setHelpTypes((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));

  const onSubmit = async (values: FormValues) => {
    if (!location) return toast.error("Please set the location on the map");
    if (!values.districtId) return toast.error("Please select the district");
    if (!values.peopleCount) return toast.error("Please select how many people");
    if (helpTypes.length === 0) return toast.error("Please select the help needed");

    const payload: CreateSosInput = {
      name: values.name,
      phone: values.phone,
      latitude: location.lat,
      longitude: location.lng,
      districtId: values.districtId,
      peopleCount: values.peopleCount,
      helpType: helpTypes,
      description: values.description || undefined,
    };
    await createManual.mutateAsync(payload);
    reset();
    setLocation(null);
    setHelpTypes([]);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Gradient hero header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/12 via-accent-teal/8 to-transparent p-6 md:p-8"
      >
        <div className="absolute -top-10 -right-8 size-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-start gap-4">
          <div className="flex items-center justify-center size-12 rounded-2xl bg-primary text-primary-foreground shadow-sm shrink-0">
            <PhoneCall className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
              Manual SOS Entry
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Record a rescue request on behalf of someone who cannot reach the app —
              for bad-network flood areas. Nearby shelters and volunteers appear as you set the location.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 flex flex-col gap-5"
        >
          {/* Person */}
          <Card className="rounded-3xl border border-border bg-card p-6 flex flex-col gap-4">
            <SectionHeading step={1} icon={User} title="Who needs help?" hint="Their name and a working phone number" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Person&apos;s name</Label>
                <Input {...register("name", { required: true })} placeholder="Full name" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Phone number</Label>
                <Input {...register("phone", { required: true })} placeholder="01XXXXXXXXX" />
              </div>
            </div>
          </Card>

          {/* Situation */}
          <Card className="rounded-3xl border border-border bg-card p-6 flex flex-col gap-4">
            <SectionHeading step={2} icon={Users} title="The situation" hint="District, headcount, and help needed" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>District</Label>
                <Controller
                  name="districtId"
                  control={control}
                  render={({ field }) => (
                    <DistrictSelect value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>How many people?</Label>
                <Controller
                  name="peopleCount"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full rounded-lg">
                        <SelectValue placeholder="Select...">
                          {(val: string) =>
                            PEOPLE_OPTIONS.find((o) => o.value === val)?.label ?? "Select..."
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {PEOPLE_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Help needed</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {HELP_OPTIONS.map((o) => {
                  const active = helpTypes.includes(o.value);
                  const Icon = o.icon;
                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggleHelp(o.value)}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-3 text-xs font-bold transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-5" />
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="rounded-3xl border border-border bg-card p-6 flex flex-col gap-4">
            <SectionHeading step={3} icon={MapPinned} title="Where are they?" hint="Tap the map or use current location" />
            <LocationPicker value={location} onChange={setLocation} heightClass="h-64" />
          </Card>

          {/* Notes */}
          <Card className="rounded-3xl border border-border bg-card p-6 flex flex-col gap-4">
            <SectionHeading step={4} icon={FileText} title="Notes (optional)" />
            <Textarea
              rows={3}
              {...register("description")}
              placeholder="Anything the rescue team should know — injuries, children, landmarks..."
              className="resize-none"
            />
          </Card>

          <Button
            type="submit"
            disabled={createManual.isPending}
            size="lg"
            className="gap-2 font-bold h-13 rounded-2xl"
          >
            {createManual.isPending ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <Send className="size-5" />
            )}
            Record Request
          </Button>
        </motion.form>

        <div className="lg:col-span-1">
          <NearbyHelpPanel location={location} showVolunteers />
        </div>
      </div>
    </div>
  );
}
