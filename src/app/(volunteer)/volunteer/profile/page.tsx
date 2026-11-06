"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import {
  Anchor,
  Check,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock,
  HandHeart,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Stethoscope,
  Truck,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { DistrictSelect } from "@/components/dashboard/district-select";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { SosStatusBadge } from "@/components/dashboard/sos-status-badge";
import { useCurrentUser } from "@/lib/hooks/use-current-user";
import { useReliefAssignments } from "@/lib/hooks/use-relief";
import {
  useMyTasks,
  useMyVolunteerProfile,
  useRegisterVolunteer,
  useUpdateVolunteerAvailability,
  type RegisterVolunteerInput,
} from "@/lib/hooks/use-volunteers";
import { timeAgo } from "@/lib/format-time-ago";
import { cn } from "@/lib/utils";

const SKILLS = [
  { value: "medical", label: "Medical", text: "First aid and basic care", icon: Stethoscope },
  { value: "boat_operation", label: "Boat operation", text: "Water rescue by boat", icon: Anchor },
  { value: "cooking", label: "Cooking", text: "Shelter kitchens", icon: ChefHat },
  { value: "logistics", label: "Logistics", text: "Moving relief supplies", icon: Truck },
  { value: "general", label: "General help", text: "Anything that's needed", icon: HandHeart },
];

function skillKey(k: string) {
  return k.trim().toLowerCase().replace(/\s+/g, "_");
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function RegisterForm() {
  const registerVolunteer = useRegisterVolunteer();
  const { register, handleSubmit, control } = useForm<RegisterVolunteerInput>({
    defaultValues: { skills: [], availableFrom: "06:00", availableTo: "18:00" },
  });
  const chosen = useWatch({ control, name: "skills" }) ?? [];

  return (
    <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-5">
      <form
        onSubmit={handleSubmit((values) => registerVolunteer.mutate(values))}
        className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:p-8 xl:col-span-3"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground">Join the rescue network</h2>
          <p className="mt-1 text-sm text-muted-foreground">Tell us how you can help and when you are free.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <Label>What can you do?</Label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {SKILLS.map((s) => {
              const on = Array.isArray(chosen) && chosen.includes(s.value);
              return (
                <label
                  key={s.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 transition-colors",
                    on ? "border-primary bg-accent/50 ring-4 ring-primary/10" : "border-border hover:bg-muted/50",
                  )}
                >
                  <input type="checkbox" value={s.value} className="sr-only" {...register("skills")} />
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", on ? "bg-primary text-lime" : "bg-muted text-muted-foreground")}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.text}</p>
                  </div>
                  <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2", on ? "border-primary bg-primary text-lime" : "border-border")}>
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Your district</Label>
          <Controller
            name="districtId"
            control={control}
            rules={{ required: true }}
            render={({ field }) => <DistrictSelect value={field.value} onChange={field.onChange} />}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Available from</Label>
            <Input type="time" {...register("availableFrom")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Available until</Label>
            <Input type="time" {...register("availableTo")} />
          </div>
        </div>

        <Button type="submit" size="lg" disabled={registerVolunteer.isPending} className="h-12 self-start px-6">
          {registerVolunteer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandHeart className="h-4 w-4 text-lime" />}
          Register as volunteer
        </Button>
      </form>

      <aside className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground md:p-8 xl:col-span-2">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" aria-hidden />
        <HandHeart className="h-9 w-9 text-lime" />
        <h2 className="mt-4 text-2xl font-bold">Why volunteer with FloodAid?</h2>
        <p className="mt-2 text-sm text-white/70">
          Your skills go straight to families who need them, in your own district.
        </p>
        <ol className="mt-6 flex flex-col gap-4">
          {[
            { t: "Register", d: "Pick your skills, district and hours." },
            { t: "Get verified", d: "An admin confirms your profile, usually within a day." },
            { t: "Receive tasks", d: "Rescue and relief jobs near you appear in My Tasks." },
          ].map((step, i) => (
            <li key={step.t} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime text-sm font-bold text-lime-foreground">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold">{step.t}</p>
                <p className="text-sm text-white/65">{step.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}

export default function VolunteerProfilePage() {
  const { data: user } = useCurrentUser();
  const isVolunteer = user?.role === "VOLUNTEER";
  const { data: profile, isLoading } = useMyVolunteerProfile(isVolunteer);
  const { data: tasks } = useMyTasks(isVolunteer);
  const { data: relief } = useReliefAssignments({ mine: true });
  const updateAvailability = useUpdateVolunteerAvailability();

  if (isVolunteer && isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <div className="flex flex-col gap-6 xl:col-span-2">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader icon={UserRound} title="Become a volunteer" description="Help rescue families and deliver relief in your district" />
        <RegisterForm />
      </div>
    );
  }

  const active = tasks?.filter((t) => t.status === "ASSIGNED" || t.status === "IN_PROGRESS").length ?? 0;
  const rescued = tasks?.filter((t) => t.status === "RESOLVED").length ?? 0;
  const deliveries = relief?.filter((a) => a.status === "DELIVERED").length ?? 0;
  const recent = [...(tasks ?? [])].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt)).slice(0, 5);
  const steps = [
    { label: "Profile registered", done: true },
    { label: "Verified by an admin", done: profile.verified },
    { label: "Available for tasks", done: profile.isAvailable },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader icon={UserRound} title="My Profile" description="Your volunteer profile, availability and activity" />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-3">
        <aside className="flex flex-col gap-6">
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative h-24 bg-primary">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-white/10" aria-hidden />
            </div>
            <div className="relative -mt-10 flex flex-col items-center px-6 pb-6 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime text-2xl font-bold text-lime-foreground ring-4 ring-card">
                {user ? initialsOf(user.name) : ""}
              </div>
              <h2 className="mt-3 text-lg font-bold text-foreground">{user?.name}</h2>
              <span
                className={cn(
                  "mt-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                  profile.verified ? "bg-emerald-500/10 text-emerald-700" : "bg-amber-500/12 text-amber-700",
                )}
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                {profile.verified ? "Verified volunteer" : "Awaiting verification"}
              </span>
              <div className="mt-5 flex w-full flex-col gap-2.5 text-left text-sm">
                <p className="flex items-center gap-2.5 text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{user?.email}</span>
                </p>
                {user?.phone && (
                  <p className="flex items-center gap-2.5 text-foreground">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {user.phone}
                  </p>
                )}
                <p className="flex items-center gap-2.5 text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {profile.district?.nameEn ?? "—"}
                </p>
                <p className="flex items-center gap-2.5 text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {profile.availableFrom && profile.availableTo ? `${profile.availableFrom} – ${profile.availableTo}` : "Any time"}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-foreground">Available for new tasks</p>
                <p className="text-xs text-muted-foreground">Turn off when you can&apos;t take assignments</p>
              </div>
              <Switch
                checked={profile.isAvailable}
                onCheckedChange={(checked) => updateAvailability.mutate({ id: profile.id, isAvailable: checked })}
              />
            </div>
            <ol className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
              {steps.map((s) => (
                <li key={s.label} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full",
                      s.done ? "bg-primary text-lime" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {s.done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Clock className="h-3.5 w-3.5" />}
                  </span>
                  <span className={s.done ? "font-medium text-foreground" : "text-muted-foreground"}>{s.label}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>

        <div className="flex flex-col gap-6 xl:col-span-2">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Lifetime tasks" value={profile.totalAssignments} icon={ClipboardList} highlight />
            <StatCard label="Active now" value={active} icon={Clock} />
            <StatCard label="People rescued" value={rescued} icon={CheckCircle2} />
            <StatCard label="Deliveries" value={deliveries} icon={Package} />
          </div>

          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-bold text-foreground">My skills</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ...SKILLS,
                ...profile.skills
                  .filter((k) => !SKILLS.some((s) => s.value === skillKey(k)))
                  .map((k) => ({ value: k, label: k.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()), text: "Listed on your profile", icon: HandHeart })),
              ].map((s) => {
                const on = profile.skills.some((k) => k === s.value || skillKey(k) === s.value);
                return (
                  <div
                    key={s.value}
                    className={cn("flex items-center gap-3 rounded-2xl border p-3.5", on ? "border-primary/30 bg-accent/40" : "border-dashed border-border opacity-60")}
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", on ? "bg-primary text-lime" : "bg-muted text-muted-foreground")}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{on ? s.text : "Not selected"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card">
            <div className="border-b border-border p-5">
              <h2 className="font-bold text-foreground">Recent missions</h2>
            </div>
            {recent.length > 0 ? (
              <ul className="divide-y divide-border">
                {recent.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {t.district?.nameEn} · {t.peopleCount} people · {timeAgo(t.updatedAt)}
                      </p>
                    </div>
                    <SosStatusBadge status={t.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="p-8 text-center text-sm text-muted-foreground">Missions you take on will be listed here.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
